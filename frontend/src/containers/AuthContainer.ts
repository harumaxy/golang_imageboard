import { createContainer } from "unstated-next"
import { useState } from "react"
import Auth0Lock from "auth0-lock"
import auth0 from "auth0-js"
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "../setting"

// const lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
//   closable: true,
//   auth: {
//     responseType: "token id_token",
//     sso: true
//   }
// });
// lock.on("authenticated", authResult => {
//   const expiredAt = authResult.expiresIn * 1000 + new Date().getTime();
//   localStorage.setItem("access_token", authResult.accessToken);
//   localStorage.setItem("id_token", authResult.idToken);
//   localStorage.setItem("expired_at", expiredAt.toString());
//   localStorage.setItem("user_info", JSON.stringify(authResult.idTokenPayload));
//   console.log(authResult);
//   // 認証情報をlocalStorageに保存したあとに再レンダリングする。
//   setLoading(true);
// });
// lock.on("authorization_error", error => {
//   // error code
//   console.log(error);
// });

// const AuthContainer = createContainer(() => {
//   return {};
// });
