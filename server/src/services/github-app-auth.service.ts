import { injectable, bind, BindingScope } from '@loopback/core';
import jwt from 'jsonwebtoken';

export interface GitHubAppToken {
  token: string;
  expiresAt: number;
}

export interface InstallationToken {
  token: string;
  expiresAt: Date;
}

@injectable({ scope: BindingScope.SINGLETON })
export class GitHubAppAuthService {
  private appId: string;
  private privateKey: string;
  private tokenCache: Map<number, InstallationToken>;
  private readonly TOKEN_EXPIRY_BUFFER = 60; // Refresh 60 seconds before expiry

  constructor() {
    const appId = process.env.GITHUB_APP_ID;
    let privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

    if (!appId || !privateKey) {
      throw new Error(
        'GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY environment variables are required',
      );
    }

    this.appId = appId;
    
    // Handle various private key formats
    // Support both escaped newlines (\\n) and literal newlines
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    // Ensure key is properly formatted for PEM
    if (!privateKey.includes('-----BEGIN')) {
      // If key doesn't have header, it might be base64 encoded
      try {
        privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
      } catch (e) {
        // Not base64, use as-is
      }
    }
    
    this.privateKey = privateKey;
    this.tokenCache = new Map();
  }

  /**
   * Generate JWT token for GitHub App authentication
   * Valid for 10 minutes
   */
  generateAppJWT(): string {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: parseInt(this.appId),
      iat: now,
      exp: now + 600, // 10 minutes
    };

    return jwt.sign(payload, this.privateKey, { algorithm: 'RS256' });
  }

  /**
   * Get installation token for a specific installation
   * Tokens are cached to avoid unnecessary API calls
   */
  async getInstallationToken(installationId: number): Promise<string> {
    // Check cache
    const cached = this.tokenCache.get(installationId);
    if (cached && new Date() < new Date(cached.expiresAt.getTime() - this.TOKEN_EXPIRY_BUFFER * 1000)) {
      return cached.token;
    }

    // Get new token
    const token = await this.fetchInstallationToken(installationId);
    this.tokenCache.set(installationId, token);
    return token.token;
  }

  /**
   * Fetch new installation token from GitHub API
   */
  private async fetchInstallationToken(
    installationId: number,
  ): Promise<InstallationToken> {
    const jwtToken = this.generateAppJWT();

    try {
      const response = await fetch(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'NIT-Placement-PR-Bot',
          },
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to get installation token: ${response.status} ${error}`,
        );
      }

      const data = (await response.json()) as {
        token: string;
        expires_at: string;
      };

      return {
        token: data.token,
        expiresAt: new Date(data.expires_at),
      };
    } catch (error) {
      console.error(
        `Error fetching installation token for ${installationId}:`,
        error,
      );
      throw new Error(`Failed to fetch installation token: ${error}`);
    }
  }

  /**
   * Verify webhook signature from GitHub
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
  ): boolean {
    const crypto = require('crypto');
    
    // Try webhook secret first (for repository webhooks)
    let webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    
    // If no webhook secret, try app secret
    if (!webhookSecret) {
      webhookSecret = process.env.GITHUB_APP_WEBHOOK_SECRET;
    }

    if (!webhookSecret) {
      console.warn('⚠️  Neither GITHUB_WEBHOOK_SECRET nor GITHUB_APP_WEBHOOK_SECRET configured');
      console.warn('Signature verification skipped - webhook will be accepted');
      // For testing/development, allow webhooks without secret
      return true;
    }

    try {
      const hmac = crypto.createHmac('sha256', webhookSecret);
      hmac.update(payload);
      const expectedSignature = 'sha256=' + hmac.digest('hex');

      const isValid = signature === expectedSignature;
      
      if (!isValid) {
        console.warn('❌ Webhook signature mismatch');
        console.warn('Expected:', expectedSignature.substring(0, 20) + '...');
        console.warn('Received:', signature ? signature.substring(0, 20) + '...' : 'none');
      }
      
      return isValid;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Clear token cache for an installation
   */
  clearInstallationTokenCache(installationId: number): void {
    this.tokenCache.delete(installationId);
  }

  /**
   * Clear all cached tokens
   */
  clearAllTokenCache(): void {
    this.tokenCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: number[] } {
    return {
      size: this.tokenCache.size,
      keys: Array.from(this.tokenCache.keys()),
    };
  }
}
