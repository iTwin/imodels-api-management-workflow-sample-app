/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from "react";
import { BrowserAuthorizationCallbackHandler } from "@bentley/frontend-authorization-client";
import ReactDOM from "react-dom";
import App from "./App";

const redirectUrl = new URL(`${window.location.origin}/signin-callback`);
if (redirectUrl.pathname === window.location.pathname) {
  BrowserAuthorizationCallbackHandler
    .handleSigninCallback(redirectUrl.toString())
    // eslint-disable-next-line no-console
    .catch(console.error);
} else {
  ReactDOM.render(<App />, document.getElementById("root"));
}

