import { useQuery, useInfiniteQuery, queryCache } from 'react-query';


const DataFetcher = ({ action, placeholder, children, error, onError, selection }) => {
    const response = useQuery(selection, action, {retry: 2});

    const retry = () => {
        queryCache.invalidateQueries(selection);
    }

    if (response.isLoading) {
        return placeholder;
    }

    if (response.isError) {
        if (onError) {
            return onError(retry);
        }
        return error;
    }

    return children(response);
};


const PaginatedDataFetcher = ({ action, placeholder, children, error, onError, selection }) => {
    const response = useInfiniteQuery(selection, action, {
        getFetchMore: (lastGroup, allGroups) => lastGroup.next,
        retry: 2
    });

    const retry = () => {
        queryCache.invalidateQueries(selection);
    }

    if (response.isLoading) {
        return placeholder;
    }

    if (response.isError) {
        if (onError) {
            return onError(retry);
        }
        return error;
    }

    return children(response);
};


export { DataFetcher, PaginatedDataFetcher };
