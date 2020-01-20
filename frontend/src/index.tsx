import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
import * as serviceWorker from "./serviceWorker"

import { PostContainer } from "./containers/PostContainer"

import List from "./page/Index"
import Create from "./page/Create"
import Read from "./page/Read"
import Lock from "./components/AuthButton"
import AppBar from "./components/AppBar"
import SncakbarContainer from "./containers/SncakbarContainer"
import { PUBLIC_URL, AUTH0_AUDIENCE } from "./setting"
import { Auth0Provider } from "./containers/react-auth0-spa"
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./setting"
import history from "./utils/history"
import gopher from "./gopher.png"

import { jsx, Global, css } from "@emotion/core"
import emotionReset from "emotion-reset"
// import "./index.css"

// リダイレクトを使うとき、historyに目的のurlをpushする
const onRedirectCallback = (appState: any) => {
  history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname)
}

ReactDOM.render(
  <>
    <Global
      styles={css`
        ${emotionReset}

        *, *::after, *::before {
          box-sizing: border-box;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
          font-smoothing: antialiased;
        }

        body {
          background-image: url(${gopher});
          background-repeat: repeat;
          background-size: 200px;
          background-position: center;
          filter: alpha(opacity=50);
          height: 100vh;
          background-color: rgba(255, 255, 255, 0.6);
          background-blend-mode: lighten;
        }
      `}
    />
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      client_id={AUTH0_CLIENT_ID}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback as any}
      audience={AUTH0_AUDIENCE}
    >
      <PostContainer.Provider>
        <SncakbarContainer.Provider>
          <Router basename={PUBLIC_URL}>
            <AppBar />
            <div style={{ margin: 10 }}>
              <Switch>
                <Route exact path="/posts/create" component={Create} />
                <Route exact path="/posts/:id" component={Read} />
                <Route exact path="" component={List} />
              </Switch>
            </div>
          </Router>
        </SncakbarContainer.Provider>
      </PostContainer.Provider>
    </Auth0Provider>
  </>,

  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
