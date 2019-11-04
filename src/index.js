import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'simple-react-state';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { App } from './components'
import { HashRouter as Router } from 'react-router-dom';
import store from './store';

let API_URL = "http://192.168.43.129:8000/api";

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

export {API_URL}
