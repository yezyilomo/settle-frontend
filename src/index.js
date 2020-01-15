import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'simple-react-state';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import './icons.scss';
import { App } from './components';
import { HashRouter as Router } from 'react-router-dom';
import store from './store';


//let API_URL = "http://192.168.43.129:8000";  //Just for testing purpose
let API_URL = "https://api.yezyilomo.com";

window.onScrollActions = {}

window.onscroll = () => {
    for(let action in window.onScrollActions){
        window.onScrollActions[action]();
    }
}

function Application(props){
    return (
        <Provider store={store}>
            <Router base="/">
                <App/>
            </Router>
        </Provider>
    );
}

ReactDOM.render(<Application/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

export {API_URL}
