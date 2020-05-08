import React, { } from 'react';
import './Errors.css';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';


function PageError(props) {
    const history = useHistory();
    let path = history.location.pathname;
    let search = history.location.search||"";
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
    let history = useHistory()
    return (
        <div class="col-12 text-center mx-0 px-0">
            <div class="col-12 inline-error py-1">
                <i class="error-icon fas fa-exclamation-triangle"></i>
                <div>Error,&nbsp;
                    <Link to={history.pathname}>
                        Try again
                    </Link>
                </div>
            </div>
        </div>
    );
}

export { PageError, InlineError };
