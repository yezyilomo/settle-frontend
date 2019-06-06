import { useEffect, useState } from 'react';

function useFetcher(action) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    async function loadData() {
        try {
            setLoading(true);
            const actionData = await action();
            setData(actionData);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [action]);

    return [data, loading, error];
}

export {useFetcher}
