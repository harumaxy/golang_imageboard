import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom"
import * as serviceWorker from './serviceWorker';

import List from "./components/List"
import Create from "./components/Create"
import Read from "./components/Read"

ReactDOM.render(
    <React.Fragment>
        <Router>
            <Switch>
                <Route path="/posts/:id" component={Read}/>
                <Route path="/posts/create" exact component={Create}/>
                <Route path="" exact component={List}/>
            </Switch>
            <p><Link to="">List</Link></p>
            <p><Link to="/posts/create">Create</Link></p>
        </Router>
    </React.Fragment>

, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
