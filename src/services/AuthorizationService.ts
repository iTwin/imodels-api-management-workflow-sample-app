/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { BrowserAuthorizationClient, BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";
import { appConfig } from "./AppConfigService";

class AuthorizationService {
  private _authorizationClient: BrowserAuthorizationClient | undefined;

  private async createAuthorizationClient(): Promise<BrowserAuthorizationClient> {
    const authorizationClientConfiguration: BrowserAuthorizationClientConfiguration = {
      authority: appConfig.auth.authority,
      clientId: appConfig.auth.clientId,
      redirectUri: appConfig.auth.redirectUrl,
      postSignoutRedirectUri: undefined,
      scope: appConfig.auth.scopes,
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

export const authorizationService = new AuthorizationService();
