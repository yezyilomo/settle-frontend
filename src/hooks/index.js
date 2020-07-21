import { useEffect } from 'react';
import { useLocation } from 'react-router';


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

export { useRestoreScrollState };
