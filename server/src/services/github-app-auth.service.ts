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
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

    if (!appId || !privateKey) {
      throw new Error(
        'GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY environment variables are required',
      );
    }

    this.appId = appId;
    this.privateKey = privateKey.replace(/\\n/g, '\n'); // Handle escaped newlines
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
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('GITHUB_WEBHOOK_SECRET not configured');
      return false;
    }

    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(payload);
    const expectedSignature = 'sha256=' + hmac.digest('hex');

    return signature === expectedSignature;
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
