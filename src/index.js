import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Home} from './components'
import {HashRouter as Router} from 'react-router-dom';

ReactDOM.render(<Router base="/"><Home/></Router>, document.getElementById('root'));
