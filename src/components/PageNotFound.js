import React from 'react';
import './PageNotFound.css';


function PageNotFound(props) {
    return (
        <div class="col-12 text-center">
            <div class="col-12 page-not-found">
                <i class="page-not-found-icon fas fa-exclamation-triangle"></i>
                <div>Error 404. Page Not Found!.</div>
            </div>
        </div>
    );
}

export { PageNotFound};
