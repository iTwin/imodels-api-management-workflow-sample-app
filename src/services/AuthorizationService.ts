/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { BrowserAuthorizationClient, BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";

export class AuthorizationService {
  private _authorizationClient: BrowserAuthorizationClient | undefined;

  private async authorize(): Promise<void> {
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

    this._authorizationClient = new BrowserAuthorizationClient(authorizationClientConfiguration);
    await this._authorizationClient.signIn();
  }

  public async getAccessToken(): Promise<string> {
    if (!this._authorizationClient)
      await this.authorize();

    return this._authorizationClient!.getAccessToken();
  }
}
