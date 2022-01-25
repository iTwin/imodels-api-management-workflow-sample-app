/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { BrowserAuthorizationClient, BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";

export class AuthorizationService {
  private _authorizationClient: BrowserAuthorizationClient | undefined;

  private async createAuthorizationClient(): Promise<BrowserAuthorizationClient> {
    if (!process.env.IMJS_AUTH_CLIENT_ID || !process.env.IMJS_AUTH_REDIRECT_URL || !process.env.IMJS_AUTH_CLIENT_SCOPES)
      throw new Error("Missing configuration. Keys IMJS_AUTH_CLIENT_ID, IMJS_AUTH_REDIRECT_URL, IMJS_AUTH_CLIENT_SCOPES must have values. Please provide them in the .env file.");

    const authorizationClientConfiguration: BrowserAuthorizationClientConfiguration = {
      authority: process.env.IMJS_AUTH_CLIENT_AUTHORITY,
      clientId: process.env.IMJS_AUTH_CLIENT_ID,
      redirectUri: process.env.IMJS_AUTH_REDIRECT_URL,
      postSignoutRedirectUri: undefined,
      scope: process.env.IMJS_AUTH_CLIENT_SCOPES,
      responseType: "code",
    };

    const client = new BrowserAuthorizationClient(authorizationClientConfiguration);
    return client;
  }

  public async getAccessToken(): Promise<string> {
    if (!this._authorizationClient) {
      this._authorizationClient = await this.createAuthorizationClient();
      await this._authorizationClient.signIn();
    }

    return this._authorizationClient.getAccessToken();
  }
}
