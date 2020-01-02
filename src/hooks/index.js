import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useGlobalState, useLocalState } from 'simple-react-state';


function useRestoreScrollState(){
    let history = useHistory();
    let prefix = "location__";  // This is for avoiding empty key when location  is '/'
    let location = prefix + history.location.hash;

    if(window.scrollState === undefined){
        window.scrollState = {}  // Initialize scrollState
    }

    window.onhashchange = () => {
        // use onhashchange to avoid page jumping when scrolling
        if (window.scrollState !== undefined){
            window.scrollTo({top: window.scrollState[location]})
        }
    }

    useEffect(() => {
        return () => {
            window.scrollState[location] = window.scrollY;
        }
    }, [])
}

function useLocalFetcher(action) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, updateData] = useLocalState(null);

    async function loadData() {
        try {
            setLoading(true);
            const actionData = await action();
            updateData({
                value:actionData
            });
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [action]);

    return [data, updateData, loading, error];
}

function useGlobalFetcher(action, selection) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, updateData] = useGlobalState(selection);

    async function loadData() {
        try {
            setLoading(true);
            const actionData = await action();
            updateData({
                value: actionData
            });
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!data){
            // fetch only if no data saved
            loadData();
        }
    }, [action]);

    return [data, updateData, loading, error];
}

export { useRestoreScrollState, useLocalFetcher, useGlobalFetcher };
