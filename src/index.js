import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './custom.scss';
import './index.scss';
import './icons.scss';
import { App } from './components';
import { HashRouter as Router } from 'react-router-dom';
import { ReactQueryConfigProvider } from 'react-query';
import { initializeStore } from './store';


// Do this before calling ReactDOM.render
initializeStore()

//let BASE_API_URL = "http://172.20.10.2:8000";  //For testing purpose
let BASE_API_URL = "https://api.yezyilomo.me";

window.onScrollActions = {};

window.onscroll = () => {
    for (let action in window.onScrollActions) {
        window.onScrollActions[action]();
    }
};

const queryConfig = {
    queries: {
        staleTime: 1000 * 60 * 5
    }
}

function Application(props) {
    return (
        <ReactQueryConfigProvider config={queryConfig}>
            <Router base="/">
                <App />
            </Router>
        </ReactQueryConfigProvider>
    );
}

ReactDOM.render(<Application />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

export { BASE_API_URL }
