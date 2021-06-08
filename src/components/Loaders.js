import React, { useState } from 'react';
import './Loaders.scss';
import { Spinner } from 'react-bootstrap';


const LOADER_DELAY = 150;

function SpinnerPageLoader(props) {
    const [visible, setVisibility] = useState(false);
    setTimeout(function () { setVisibility(true) }, LOADER_DELAY);

    if (!visible) {
        return null
    }
    return (
        <div class="col-12 text-center">
            <div class="col-12 page-loader">
                <Spinner animation="border" variant="secondary" size="sm" />
            </div>
        </div>
    );
}

function SpinnerInlineLoader(props) {
    const [visible, setVisibility] = useState(false);
    setTimeout(function () { setVisibility(true) }, LOADER_DELAY);

    if (!visible) {
        return null
    }
    return (
        <div class="col-12 text-center mx-0 px-0">
            <div class="col-12 inline-loader">
                <Spinner animation="border" variant="secondary" size="sm" />
            </div>
        </div>
    );
}

function GlowPageLoader(props) {
    const [visible, setVisibility] = useState(false);
    setTimeout(function () { setVisibility(true) }, LOADER_DELAY);

    if (!visible) {
        return null
    }
    return (
        <div class="col-12 text-center">
            <div class="col-12 page-loader">
                <Spinner animation="grow" variant="primary" size="sm" />
                <Spinner animation="grow" variant="primary" size="sm" />
                <Spinner animation="grow" variant="primary" size="sm" />
            </div>
        </div>
    );
}

function GlowBlockLoader(props) {
    const [visible, setVisibility] = useState(false);
    setTimeout(function () { setVisibility(true) }, LOADER_DELAY);

    if (!visible) {
        return null
    }
    return (
        <div class="glow-block-loader col-12 my-3 text-center">
            <Spinner animation="grow" variant="primary" size="sm" />
            <Spinner animation="grow" variant="primary" size="sm" />
            <Spinner animation="grow" variant="primary" size="sm" />
        </div>
    );
}

function GlowInlineLoader(props) {
    const [visible, setVisibility] = useState(false);
    setTimeout(function () { setVisibility(true) }, LOADER_DELAY);

    if (!visible) {
        return null
    }
    return (
        <div class="glow-inline-loader">
            <Spinner animation="grow" variant="primary" size="sm" />
            <Spinner animation="grow" variant="primary" size="sm" />
            <Spinner animation="grow" variant="primary" size="sm" />
        </div>
    );
}

export { SpinnerPageLoader, SpinnerInlineLoader, GlowPageLoader, GlowBlockLoader, GlowInlineLoader};
