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

ReactDOM.render(<Router base="/"><App/></Router>, document.getElementById('root'));

export {API_URL}
