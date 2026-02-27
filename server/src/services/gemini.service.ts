import { injectable, BindingScope } from '@loopback/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface PRAnalysisResult {
  summary: string;
  suggestions: string[];
  testSuggestions: string[];
  securityConcerns: string[];
  performance: boolean;
  scalability: boolean;
  maintainability: string;
}

@injectable({ scope: BindingScope.SINGLETON })
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private analysisCache: Map<string, { result: PRAnalysisResult; timestamp: number }>;
  private readonly CACHE_TTL = 3600000; // 1 hour
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.analysisCache = new Map();
  }

  async analyzePR(prDetails: {
    title: string;
    description: string;
    files: Array<{ filename: string; patch: string }>;
    additions: number;
    deletions: number;
  }): Promise<PRAnalysisResult> {
    // Generate cache key
    const cacheKey = this.generateCacheKey(prDetails);

    // Check cache
    const cached = this.analysisCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log('✅ Using cached analysis result');
      return cached.result;
    }

    const prompt = this.buildPRAnalysisPrompt(prDetails);

    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const analysis = this.parsePRAnalysis(text);

        // Cache the result
        this.analysisCache.set(cacheKey, {
          result: analysis,
          timestamp: Date.now(),
        });

        return analysis;
      } catch (error) {
        lastError = error as Error;
        console.error(
          `Attempt ${attempt}/${this.MAX_RETRIES} failed: ${lastError.message}`,
        );

        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * attempt); // Exponential backoff
        }
      }
    }

    // Return fallback analysis if all retries fail
    console.error(`All ${this.MAX_RETRIES} attempts failed for PR analysis`);
    return this.getFallbackAnalysis();
  }

  private generateCacheKey(prDetails: {
    title: string;
    description: string;
    files: Array<{ filename: string; patch: string }>;
  }): string {
    const crypto = require('crypto');
    const content = `${prDetails.title}|${prDetails.description}|${prDetails.files.map(f => f.filename).join(',')}`;
    return crypto.createHash('md5').update(content).digest('hex');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getFallbackAnalysis(): PRAnalysisResult {
    return {
      summary:
        'AI analysis temporarily unavailable. Please review the code manually.',
      suggestions: [
        'Check for proper error handling',
        'Verify code follows project standards',
        'Test all edge cases',
      ],
      testSuggestions: [
        'Add unit tests for new functionality',
        'Test integration with existing code',
      ],
      securityConcerns: [
        'Review authentication mechanisms',
        'Check for potential vulnerabilities',
      ],
      performance: false,
      scalability: false,
      maintainability: 'Could not assess',
    };
  }

  async generateCommitMessage(
    changes: string,
    fileNames: string[],
  ): Promise<string> {
    const prompt = `Based on the following code changes and file names, generate a concise and descriptive commit message following conventional commits format (feat:, fix:, refactor:, etc.):

Files changed: ${fileNames.join(', ')}

Changes summary: ${changes}

Please provide only the commit message without any additional explanation.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating commit message:', error);
      throw new Error(`Failed to generate commit message: ${error}`);
    }
  }

  private buildPRAnalysisPrompt(prDetails: {
    title: string;
    description: string;
    files: Array<{ filename: string; patch: string }>;
    additions: number;
    deletions: number;
  }): string {
    const filesInfo = prDetails.files
      .map(f => `- ${f.filename} (+${f.patch.split('\n').filter(l => l.startsWith('+')).length} -${f.patch.split('\n').filter(l => l.startsWith('-')).length})`)
      .join('\n');

    return `You are an expert code reviewer with 15+ years of experience. Analyze the following Pull Request comprehensively and provide structured feedback.

PR Title: ${prDetails.title}
PR Description: ${prDetails.description}

Files Changed (${prDetails.files.length} files):
${filesInfo}

Total additions: ${prDetails.additions}, Total deletions: ${prDetails.deletions}

Analyze and provide feedback on:
1. Code quality and best practices
2. Performance implications
3. Security concerns
4. Testing recommendations
5. Maintainability and scalability
6. Architecture and design patterns

File patches:
${prDetails.files.map(f => `\n--- ${f.filename} ---\n${f.patch.substring(0, 1000)}`).join('\n')}

Please format your response as valid JSON (no markdown, no code blocks, pure JSON):
{
  "summary": "Brief 2-3 sentence summary of changes",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "testSuggestions": ["test suggestion 1", "test suggestion 2"],
  "securityConcerns": ["security concern 1", "security concern 2"],
  "performance": true/false,
  "scalability": true/false,
  "maintainability": "good/fair/needs-improvement"
}`;
  }

  private parsePRAnalysis(text: string): PRAnalysisResult {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in Gemini response, using fallback');
        return this.getFallbackAnalysis();
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || '',
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions.slice(0, 5)
          : [],
        testSuggestions: Array.isArray(parsed.testSuggestions)
          ? parsed.testSuggestions.slice(0, 3)
          : [],
        securityConcerns: Array.isArray(parsed.securityConcerns)
          ? parsed.securityConcerns.slice(0, 3)
          : [],
        performance: parsed.performance === true,
        scalability: parsed.scalability === true,
        maintainability: parsed.maintainability || 'Could not assess',
      };
    } catch (error) {
      console.error('Error parsing PR analysis:', error);
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Clear analysis cache
   */
  clearCache(): void {
    this.analysisCache.clear();
    console.log('✅ Analysis cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: number } {
    return {
      size: this.analysisCache.size,
      entries: this.analysisCache.size,
    };
  }
}
