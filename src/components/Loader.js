import React, { } from 'react';
import './Loader.css';
import {withRouter} from 'react-router-dom';
import {Spinner} from 'react-bootstrap';


function PageLoader(props) {
    return (
        <div class="col-12 text-center">
            <div class="col-12 page-loader">
                <Spinner animation="border" variant="secondary" size="sm"/>
            </div>
        </div>
    );
}

function InlineLoader(props) {
    return (
        <div class="col-12 text-center mx-0 px-0">
            <div class="col-12 inline-loader">
                <Spinner animation="border" variant="secondary" size="sm"/>
            </div>
        </div>
    );
}

function GlowInlineLoader(props){
    return (
        <div class="glow-inline-loader col-12 my-3 text-center">
            <Spinner animation="grow" variant="info" size="sm"/>
            <Spinner animation="grow" variant="info" size="sm"/>
            <Spinner animation="grow" variant="info" size="sm"/>
        </div>
    );
}


let comp1 = withRouter(PageLoader)
let comp2 = withRouter(InlineLoader)

export { comp1 as Loader, comp2 as InlineLoader, GlowInlineLoader};
