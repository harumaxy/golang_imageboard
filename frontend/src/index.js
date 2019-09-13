import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom"
import * as serviceWorker from './serviceWorker';

import { PostContainer } from "./containers/PostContainer";

import List from "./components/List"
import Create from "./components/Create"
import Read from "./components/Read"
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';


ReactDOM.render(
    <PostContainer.Provider>
        <Router>
            <Switch>
                <Route exact path="/signup" exact component={SignUp}/>
                <Route exact path="/signin" exact component={SignIn}/>
                <Route exact path="/posts/create" exact component={Create}/>
                <Route exact path="/posts/:id" component={Read}/>
                <Route exact path="" exact component={List}/>
            </Switch>
            <p><Link to="">List</Link></p>
            <p><Link to="/posts/create">Create</Link></p>
            <p><Link to="/signup">Sign up</Link></p>
            <p><Link to="/signin">Sign in</Link></p>
        </Router>
    </PostContainer.Provider>

, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
