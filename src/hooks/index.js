import { useEffect } from 'react';
import { useLocation } from 'react-router';


function useUserLocation(){
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    function logError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.")
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.")
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.")
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred when getting user location.")
                break;
        }
    }

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
            console.log("Geolocation is not supported by this browser.");
        }
    }, [])

    return {location, error};
}


function useRestoreScrollState() {
    const locationObj = useLocation();
    let location = locationObj.pathname;

    if (window.scrollState === undefined) {
        window.scrollState = {}  // Initialize scrollState
    }

    useEffect(() => {
        if (window.scrollState !== undefined && window.scrollState[location] !== undefined) {
            // Restore scroll position when the component mounts
            window.scrollTo({ top: window.scrollState[location] });
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

export { useRestoreScrollState, useScrollTop, useUserLocation };
