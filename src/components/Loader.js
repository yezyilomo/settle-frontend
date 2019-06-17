import React, { } from 'react';
import './Loader.css';


function Loader() {
    return (
        <div class="col-12 text-center">
            <div class="col-12 page-loader">
                <div class="spinner-border text-secondary" role="status">
                </div>
                <div>Loading..</div>
            </div>
        </div>
    );
}

export { Loader };
