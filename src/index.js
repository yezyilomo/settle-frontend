import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './components'
import {HashRouter as Router} from 'react-router-dom';

let API_URL = "http://localhost:8000/api";

window.onScrollActions = {}

window.onscroll = () => {
    for(let action in window.onScrollActions){
        window.onScrollActions[action]();
    }
}

function Application(props){
    return (
        <Router base="/">
            <App/>
        </Router>
    );
}

ReactDOM.render(<Application/>, document.getElementById('root'));

export {API_URL}
