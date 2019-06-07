import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Home} from './components'
import {HashRouter as Router} from 'react-router-dom';

let API_URL = "http://192.168.1.14:8000";

ReactDOM.render(<Router base="/"><Home/></Router>, document.getElementById('root'));

export {API_URL}
