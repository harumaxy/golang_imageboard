import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
import * as serviceWorker from "./serviceWorker"
import "./index.css"

import { PostContainer } from "./containers/PostContainer"

import List from "./page/Index"
import Create from "./page/Create"
import Read from "./page/Read"
import Lock from "./components/AuthButton"
import AppBar from "./components/AppBar"
import SncakbarContainer from "./containers/SncakbarContainer"
import { PUBLIC_URL } from "./setting"
import { Auth0Provider } from "./containers/react-auth0-spa"
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./setting"
import history from "./utils/history"

// リダイレクトを使うとき、historyに目的のurlをpushする
const onRedirectCallback = (appState: any) => {
  history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname)
}

ReactDOM.render(
  <Auth0Provider domain={AUTH0_DOMAIN} client_id={AUTH0_CLIENT_ID} redirect_uri={window.location.origin} onRedirectCallback={onRedirectCallback as any}>
    <PostContainer.Provider>
      <SncakbarContainer.Provider>
        <Router basename={PUBLIC_URL}>
          <AppBar />
          <Switch>
            <Route exact path="/posts/create" component={Create} />
            <Route exact path="/posts/:id" component={Read} />
            <Route exact path="" component={List} />
          </Switch>
          <p>
            <Link to="">List</Link>
          </p>
          <p>
            <Link to="/posts/create">Create</Link>
          </p>
        </Router>
      </SncakbarContainer.Provider>
    </PostContainer.Provider>
  </Auth0Provider>,

  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
