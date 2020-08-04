import React, {useEffect} from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";

import "./Map.scss";
import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";


const libraries = ["places"];

const mapContainerStyle = {
    height: "300px",
    width: "100%",
    "border-radius": "3px",
    border: "solid 1px rgb(238, 238, 238)",
    "margin-top": "8px"
};
const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
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

function Search({ panTo, onSelect, selected}) {
    let location = { lat: () => 43.6532, lng: () => -79.3832 }
    if (selected) {
        location = { lat: () => selected.lat, lng: () => selected.lng }
    }
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: location,
            radius: 100 * 1000,
        },
    });

    useEffect(function(){
        handleSelect(null, selected);
    }, [selected])

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address, selectedLocation) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address, location: selectedLocation });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });

            if(onSelect && !selectedLocation) {
                const point = {lat, lng}
                onSelect({point, address});
            }
            if (selectedLocation && !address) {
                const point = selectedLocation
                const selectedAddress = results[0].formatted_address
                setValue(selectedAddress, false);
                clearSuggestions();
                onSelect({point, address: selectedAddress});
                panTo(point);
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
                                <ComboboxOption key={id} value={description} />
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

    const [selected, setSelected] = React.useState(props.center);

    const onMapClick = React.useCallback((e) => {
        setSelected({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        })
    }, []);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
    }, []);

    const handleSelectSearched = (selectedInfo) => {
        setSelected(selectedInfo.point);
        if(props.onChangeLocation) {
            props.onChangeLocation(selectedInfo);
        }
    }

    if (loadError) return "Failed to load Map";
    if (!isLoaded) return "Loading Map...";

    return (
        <div>
            <Search selected={selected} onSelect={handleSelectSearched} panTo={panTo} />
            <Locate panTo={panTo} />

            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={10}
                center={props.center}
                options={options}
                onDblClick={onMapClick}
                onLoad={onMapLoad}>
                    <Marker
                        draggable
                        position={selected}
                        onDragEnd={onMapClick}
                        onClick={() => {
                            // Show Info
                           // setSelected();
                        }}
                    />
            </GoogleMap>
        </div>
    );
}

export { Map }