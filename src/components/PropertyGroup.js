import React from 'react';
import {PropertyOverview} from './'
import './PropertyGroup.css';

function PropertyGroup(props) {
    return (
        <div class="property-container row col-12 mb-3 mt-0 mx-0 p-0">
            <h5 class="w-100 ml-2 mb-0 mt-0">{props.header}</h5>
            {props.properties.map(property =>
                <PropertyOverview property={property}/>
            )}
        </div>
    )
}

export {PropertyGroup};