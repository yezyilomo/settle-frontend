import React, { } from 'react';
import './Loader.css';
import {withRouter} from 'react-router-dom';


function PageLoader(props) {
    return (
        <div class="col-12 text-center">
            <div class="col-12 page-loader">
                <div class="spinner-border text-secondary" role="status">
                </div>
            </div>
        </div>
    );
}

function InlineLoader(props) {
    return (
        <div class="col-12 text-center mx-0 px-0">
            <div class="col-12 inline-loader">
                <div class="spinner-border text-secondary" role="status" >
                </div>
            </div>
        </div>
    );
}

let comp1 = withRouter(PageLoader)
let comp2 = withRouter(InlineLoader)

export { comp1 as Loader, comp2 as InlineLoader };
