import React, { } from 'react';
import {useFetcher} from '../hooks';

const Fetcher = ({ action, placeholder, children }) => {
    const [data, loading, error] = useFetcher(action);

    if (loading){
        if(placeholder){
            return placeholder;
        }
        return null;
    }
    if (error) return <div>Error occured while loading..</div>

    if (!data) return null;

    return children(data);
};

export {Fetcher};
