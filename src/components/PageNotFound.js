import React, { } from 'react';
import './PageNotFound.css';
import {Link, withRouter} from 'react-router-dom';


function PageNotFound(props) {
    let path = props.history.location.pathname;
    let search = props.history.location.search||"";
    return (
        <div class="col-12 text-center">
            <div class="col-12 page-not-found">
                <i class="page-not-found-icon fas fa-exclamation-triangle"></i>
                <div>Error 404. Page Not Found!.</div>
            </div>
        </div>
    );
}

let comp = withRouter(PageNotFound)

export { comp as PageNotFound};
