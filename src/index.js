import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'

import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';


const app = (
    <BrowserRouter>
        <App title="Burger shop"/>
    </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
