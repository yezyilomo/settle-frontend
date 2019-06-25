import React, { } from 'react';
import {useFetcher} from '../hooks';

const Fetcher = ({ action, placeholder, children, error }) => {
    const [data, loading, fetchError] = useFetcher(action);

    if (loading){
        if(placeholder){
            return placeholder;
        }
        return null;
    }
    if (fetchError) return error;

    if (!data) return null;

    return children(data);
};

export {Fetcher};
