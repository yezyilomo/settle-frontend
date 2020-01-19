import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useGlobalState, useLocalState } from 'simple-react-state';


function useRestoreScrollState(){
    let history = useHistory();
    let location = history.location.pathname;

    if(window.scrollState === undefined){
        window.scrollState = {}  // Initialize scrollState
    }

    useEffect(() => {
        if (window.scrollState !== undefined && window.scrollState[location] !== undefined){
            window.scrollTo({top: window.scrollState[location]})
        }
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
