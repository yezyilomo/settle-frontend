import React from 'react';
import { PropertyOverview } from './'
import './PropertyGroup.css';

function PropertyGroup(props) {
    return (
        <div class="property-container row col-12 mb-3 mt-0 mx-0 p-0">
            <h6 class="w-100 ml-2 mb-0 mt-0 font-weight-bold">{props.header}</h6>
            {props.properties.map(property =>
                <PropertyOverview property={property} edit={props.edit} />
            )}
        </div>
    )
}

export { PropertyGroup };
