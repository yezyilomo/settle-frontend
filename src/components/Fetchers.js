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


const GlobalFetcher = ({ action, placeholder, children, error, selection, setter, getter, fetchCondition }) => {
    const [data, updateData, loading, fetchError] = useGlobalFetcher(action, selection, {setter, fetchCondition});

    if (loading){
        if(placeholder){
            return placeholder;
        }
        return null;
    }
    if (fetchError) return error;

    // Beware this is the source of a very big bug 
    // TODO: Find a way to solve this
    if (!data || (fetchCondition && fetchCondition(data))) return null;  // Timeout, No Network Connection 

    if(getter){
        return children(getter(data), updateData);
    }
    return children(data, updateData);
};


export {LocalFetcher, GlobalFetcher};
