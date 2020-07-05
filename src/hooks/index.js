import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useGlobalState, useLocalState } from 'state-pool';


function useRestoreScrollState(){
    const locationObj = useLocation();
    let location = locationObj.pathname;

    if(window.scrollState === undefined){
        window.scrollState = {}  // Initialize scrollState
    }

    useEffect(() => {
        if (window.scrollState !== undefined && window.scrollState[location] !== undefined){
            // Restore scroll position when the component mounts
            window.scrollTo({top: window.scrollState[location]});
        }
        return () => {
            // Save scroll position when the component unmount
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
            updateData(data => actionData);
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

function useGlobalFetcher(action, selection, {setter, fetchCondition}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, updateData] = useGlobalState(selection, {default: null});

    async function loadData() {
        try {
            setLoading(true);
            const actionData = await action();
            if(setter){
                updateData(data => setter(actionData));
            }
            else{
                updateData(data => actionData);
            }
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (fetchCondition){
            if(fetchCondition(data)){
                // fetch only if the fetch condition is met
                loadData();
            }
        }

        else{
            if(!data){
                // fetch only if no data saved
                loadData();
            }
        }
    }, [action]);

    return [data, updateData, loading, error];
}

export { useRestoreScrollState, useLocalFetcher, useGlobalFetcher };
