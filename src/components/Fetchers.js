import {useLocalFetcher, useGlobalFetcher} from '../hooks';


const LocalFetcher = ({ action, placeholder, children, error }) => {
    const [data, updateData, loading, fetchError] = useLocalFetcher(action);

    if (loading){
        if(placeholder){
            return placeholder;
        }
        return null;
    }
    if (fetchError) return error;

    if (!data) return null;  // Timeout, No Network Connection 

    return children(data, updateData);
};


const GlobalFetcher = ({ action, placeholder, children, error, selection }) => {
    const [data, updateData, loading, fetchError] = useGlobalFetcher(action, selection);

    if (loading){
        if(placeholder){
            return placeholder;
        }
        return null;
    }
    if (fetchError) return error;

    if (!data) return null;  // Timeout, No Network Connection 

    return children(data, updateData);
};


export {LocalFetcher, GlobalFetcher};
