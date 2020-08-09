import React from "react";
import {
    GoogleMap, useLoadScript, Marker,
    InfoWindow, Circle
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox, ComboboxInput, ComboboxPopover,
    ComboboxList, ComboboxOption,
} from "@reach/combobox";

import "./Map.scss";
import "@reach/combobox/styles.css";
//import mapStyles from "./mapStyles";


const libraries = ["places"];

const mapContainerStyle = {
    height: "300px",
    width: "100%",
    "border-radius": "3px",
    border: "solid 1px rgb(238, 238, 238)"
};

const options = {
    //styles: mapStyles, // Change map style
    disableDefaultUI: true,
    fullscreenControl: true,
    zoomControl: true
};


function Locate({ panTo }) {
    return (
        <button
            className="locate"
            onClick={(e) => {
                e.preventDefault();
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        panTo({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    () => null
                );
            }}
        >
            <img src="/compass.svg" alt="compass" />
        </button>
    );
}


function Search(props) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {
                lat: () => props.location.point.lat,
                lng: () => props.location.point.lng
            },
            radius: 100 * 1000,
        },
    });

    React.useEffect(function(){
        setValue(props.location.address, false);
    }, [props.location])

    const handleInput = (e) => {
        setValue(e.target.value);  // Make API call
    };

    const handleSelect = async (address) => {
        setValue(address, false);  // Don't make API call
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);

            const point = {lat, lng}
            props.panTo(point);

            if(props.onSelectingSearchResult) {
                props.onSelectingSearchResult({point, address});
            }
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    return (
        <div className="search">
            <Combobox onSelect={handleSelect}>
                <ComboboxInput
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Search your location"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                            data.map(({ id, description }) => (
                                <ComboboxOption style={{height: "40px"}} key={id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}


function Map(props) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [location, setLocation] = React.useState(props.location);
    const [showInfoWindow, setShowInfoWindow] = React.useState(true);

    const handleLocationChange = React.useCallback(async (e) => {
        const selectedPoint = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        }

        try {
            const results = await getGeocode({ location: selectedPoint });
            const { lat, lng } = await getLatLng(results[0]);

            const point = { lat, lng };
            const address = results[0].formatted_address
            panTo(point);

            const selectedLocation = { address, point }

            setLocation(selectedLocation);
            if (props.onChangeLocation) {
                props.onChangeLocation(selectedLocation);
            }
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    }, []);

    const handleSelectingSearchResult = (selectedLocation) => {
        setLocation(selectedLocation);
        if (props.onChangeLocation) {
            props.onChangeLocation(selectedLocation);
        }
    }

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
    }, []);

    if (loadError) return "Failed to load Map";
    if (!isLoaded) return "Loading Map...";

    return (
        <div>
            {props.search ?
                <>
                    <Search location={location} onSelectingSearchResult={handleSelectingSearchResult} panTo={panTo} />
                    <Locate panTo={panTo} />
                </> : null
            }

            <GoogleMap
                id="map"
                mapContainerStyle={{ ...mapContainerStyle, ...props.style }}
                zoom={15}
                center={location.point}
                options={options}
                onDblClick={handleLocationChange}
                onLoad={onMapLoad}>

                { showInfoWindow ?
                    <InfoWindow
                        position={location.point}
                        onCloseClick={(e) => { setShowInfoWindow(false) }}
                    >
                        <div class="info-window text-center">
                            <span class="icon icon-house"></span> <br />
                            {location.address}
                        </div>
                    </InfoWindow> :
                    null
                }

                <Marker
                    draggable
                    options={{
                        icon: '',
                    }}
                    position={location.point}
                    onDragEnd={handleLocationChange}
                    onClick={() => {
                        setShowInfoWindow(true);
                    }}
                />

                <Circle
                    center={location.point}
                    options={{
                        strokeColor: 'black',
                        strokeOpacity: 0,
                        strokeWeight: 2,
                        fillColor: 'black',
                        fillOpacity: 0.3,
                        clickable: false,
                        draggable: false,
                        editable: false,
                        visible: true,
                        radius: 120,
                        zIndex: 1
                    }}
                />
                
            </GoogleMap>
        </div>
    );
}

export { Map }