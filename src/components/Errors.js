import React, { } from 'react';
import './Errors.css';
import {Link, withRouter} from 'react-router-dom';


function PageError(props) {
    let path = props.history.location.pathname;
    let search = props.history.location.search||"";
    return (
        <div class="col-12 text-center">
            <div class="col-12 page-error">
                <i class="error-icon fas fa-exclamation-triangle"></i>
                <div>Error,&nbsp;
                    <Link to={path+search}>
                         Try again
                    </Link>
                </div>
            </div>
        </div>
    );
}

function InlineError(props) {
    return (
        <div class="col-12 text-center mx-0 px-0">
            <div class="col-12 inline-error py-1">
                <i class="error-icon fas fa-exclamation-triangle"></i>
                <div>Error,&nbsp;
                    <Link to={props.history.pathname}>
                        Try again
                    </Link>
                </div>
            </div>
        </div>
    );
}

let comp1 = withRouter(PageError)
let comp2 = withRouter(InlineError)

export { comp1 as PageError, comp2 as InlineError };
