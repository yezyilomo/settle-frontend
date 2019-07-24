import React, {useState} from 'react';
import { PropertyOverview, InlineLoader } from './'
import './PropertyGroup.css';
import {onScrollToBottom} from '../utils';

function PropertyGroup(props) {
    let { next, prev, count, results } = props.properties;
    let metaDataObj = {
        count: count,
        next: next,
        prev: prev
    }

    let [metaData, setMetaData] = useState(metaDataObj);
    let [properties, setProperties] = useState(results);
    let [loading, setLoading] = useState(false);

    let fetchMore = () => {
        if(props.onScrollToBottom !== undefined && metaData.next !== null){
            setLoading(true);
            props.onScrollToBottom(metaData, setMetaData, setProperties);
        }
        else{
            setLoading(false);
        }
    }

    window.onScrollActions.fetchMore = onScrollToBottom(fetchMore)

    return (
        <div class="property-container row col-12 mb-3 mt-0 mx-0 p-0">
            <h6 class="w-100 ml-2 mb-0 mt-0 font-weight-bold">{props.header}</h6>
            {properties.length === 0?
                <div class="ml-2 mt-5">
                  <div>
                      No results found!..
                  </div>
                </div>:
                null
            }
            {properties.map(property =>
                <PropertyOverview property={property} edit={props.edit} />
            )}
            {loading?
                <InlineLoader/>:
                null
            }
        </div>
    )
}

export { PropertyGroup };
