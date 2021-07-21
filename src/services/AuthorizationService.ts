/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { BrowserAuthorizationClient, BrowserAuthorizationClientConfiguration } from "@bentley/frontend-authorization-client";

export class AuthorizationService {
  private accessToken: string | undefined = undefined;

  private async authorize(): Promise<void> {
    if (!process.env.IMJS_AUTH_CLIENT_ID || !process.env.IMJS_AUTH_REDIRECT_URL || !process.env.IMJS_AUTH_CLIENT_SCOPES)
      throw new Error("Missing configuration. Keys IMJS_AUTH_CLIENT_ID, IMJS_AUTH_REDIRECT_URL, IMJS_AUTH_CLIENT_SCOPES must have values. Please provide them in the .env file.");

    const oidcConfiguration: BrowserAuthorizationClientConfiguration = {
      authority: process.env.IMJS_AUTH_CLIENT_AUTHORITY,
      clientId: process.env.IMJS_AUTH_CLIENT_ID,
      redirectUri: process.env.IMJS_AUTH_REDIRECT_URL,
      postSignoutRedirectUri: undefined,
      scope: process.env.IMJS_AUTH_CLIENT_SCOPES,
      responseType: "code",
    };

    const oidcClient = new BrowserAuthorizationClient(oidcConfiguration);
    oidcClient.onUserStateChanged.addListener((token) => this.accessToken = token?.toTokenString() ?? "");
    await oidcClient.signIn(new ClientRequestContext());
  }

  public async getAccessToken(): Promise<string> {
    if (this.accessToken)
      return this.accessToken;

    await this.authorize();
    return this.accessToken!;
  }
}
