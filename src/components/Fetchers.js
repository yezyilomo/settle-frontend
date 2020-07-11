import {useLocalFetcher, useGlobalFetcher} from '../hooks';


const LocalFetcher = ({ action, placeholder, children, error, onError }) => {
    const [data, updateData, loading, fetchError, refetch] = useLocalFetcher(action);

    if (loading){
        return placeholder;
    }

    if (fetchError) {
        if(onError){
            return onError(refetch);
        }
        return error;
    };

    if (!data) return null;  // Timeout, No Network Connection 

    return children(data, updateData);
};


const GlobalFetcher = ({ action, placeholder, children, error, onError, selection, setter, getter, fetchCondition }) => {
    const [data, updateData, loading, fetchError, refetch] = useGlobalFetcher(action, selection, {setter, fetchCondition});

    if (loading){
        return placeholder;
    }

    if (fetchError) {
        if(onError){
            return onError(refetch);
        }
        return error;
    };

    // Beware this is the source of a very big bug 
    // TODO: Find a way to solve this
    if (!data || (fetchCondition && fetchCondition(data))) return null;  // Timeout, No Network Connection 

    if(getter){
        return children(getter(data), updateData);
    }
    return children(data, updateData);
};


export {LocalFetcher, GlobalFetcher};
