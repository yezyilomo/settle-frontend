import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useGlobalState } from 'state-pool';


function useGeolocationErrorsLogger(displayNotification){
    const [, updateNotifications] = useGlobalState("notifications");

    function showNotification(msg){
        updateNotifications((notifications) => {
            notifications.push(msg)
        })
    }

    function logError(error) {
        let msg = "";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                msg = "User denied the request for Geolocation."
                console.log(msg);
                if(displayNotification){
                    showNotification(msg);
                }
                break;
            case error.POSITION_UNAVAILABLE:
                msg = "Location information is unavailable."
                console.log(msg)
                if(displayNotification){
                    showNotification(msg);
                }
                break;
            case error.TIMEOUT:
                msg = "The request to get user location timed out."
                console.log(msg)
                if(displayNotification){
                    showNotification(msg);
                }
                break;
            case error.UNKNOWN_ERROR:
                msg = "An unknown error occurred when getting user location."
                console.log(msg)
                if(displayNotification){
                    showNotification(msg);
                }
                break;
        }
    }

    return logError;
}


function useUserLocation(){
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const logError = useGeolocationErrorsLogger(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (userLocation) => {
                    setLocation(userLocation);
                },
                (error) => {
                    logError(error);
                    setError(error);
                }
            );
        } else {
            let msg = "Geolocation is not supported by this browser."
            console.log(msg);
        }
    }, [])

    return {location, error};
}


function useRestoreScrollState(restoreOnMovingBackOnly) {
    const history = useHistory();
    let location = history.location.pathname + history.location.search;

    if (window.scrollState === undefined) {
        window.scrollState = {}  // Initialize scrollState
    }

    useEffect(() => {
        if (window.scrollState !== undefined && window.scrollState[location] !== undefined) {
            if(restoreOnMovingBackOnly){
                if(history.action === 'POP'){
                    // Restore scroll position when the component mounts
                    window.scrollTo({ top: window.scrollState[location] });
                }
            }
            else {
                // Restore scroll position when the component mounts
                window.scrollTo({ top: window.scrollState[location] });
            }
        }
        return () => {
            // Save scroll position when the component unmount
            window.scrollState[location] = window.scrollY || 0;
        }
    }, [])
}


function useScrollTop() {
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [])
}

function usePageTransition(){
    const [animatePageTransition, , setAnimatePageTransition] = useGlobalState("animatePageTransition");
    const animate = () => {
        if(animatePageTransition === true){
            setAnimatePageTransition(false);
            return "animate-page"
        }
        setAnimatePageTransition(false);
        return ""
    }
    return animate;
}

export {
    useRestoreScrollState, useScrollTop, useUserLocation,
    usePageTransition, useGeolocationErrorsLogger
};
