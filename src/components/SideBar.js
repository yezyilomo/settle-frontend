import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useGlobalState } from 'state-pool';
import './SideBar.scss';
import variables from '../variables.scss';
import { BASE_API_URL } from '../';
import { AsyncSelect } from './'
import { setErrorClass } from '../utils';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox, ComboboxInput, ComboboxPopover,
    ComboboxList, ComboboxOption,
} from "@reach/combobox";
import { useLoadScript } from "@react-google-maps/api";
import { usePageTransition, useScrollTop } from '../hooks';


const libraries = ["places"];

const PriceRangeSlider = withStyles({
    root: {
        color: variables.primaryColor,
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        //marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);


function Search(props) {
    const [loading, setLoading] = useState(false);
    const {
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({defaultValue: props.value.address});

    const handleSelect = async (address) => {
        setValue(address, false);  // Don't make API call
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            if(props.onChange) {
                props.onChange({
                    address: address,
                    point: {latitude: lat, longitude: lng}
                })
            }
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    const handleInputChange = (e) => {
        if (props.simple) {
            setValue(e.target.value, false);  // Don't make API call
        }
        else {
            setValue(e.target.value);  // Make API call
            if(props.onChange){
                props.onChange({
                    address: e.target.value,
                    point: null // use the old value
                })
            }
        }
    };

    const setLocation = async (position) => {
        const selectedPoint = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        try {
            const results = await getGeocode({ location: selectedPoint });
            const { lat, lng } = await getLatLng(results[0]);

            const point = { latitude: lat, longitude: lng };
            const address = results[0].formatted_address
            setValue(address, false);  // Don't make API call
            clearSuggestions();
            if(props.onChange){
                props.onChange({
                    address: address,
                    point: point
                })
            }
        } catch (error) {
            console.log("😱 Error: ", error);
        } finally {
            setLoading(false);
        }
    }

    const setCurrentLocation = (e) => {
        setLoading(true);
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(
            setLocation,
            () => {setLoading(false); return null}
        );
    }

    const showLoading = () => {
        if(loading){
            return "load-location"
        }
        return ""
    }

    return (
            <Combobox onSelect={handleSelect} className="location-container col-12 p-0 m-0">
                <ComboboxInput value={value} onChange={handleInputChange} autoComplete="off"
                    name="location" type="search" placeholder="City, Region or Street"
                    className="location col-12"/>

                <div class="current-location" data-toggle="tooltip" onClick={setCurrentLocation}
                    data-placement="bottom" title="Click to get your current location">
                    <span class={`icon icon-marker ${showLoading()}`} />
                </div>

                {status === "OK" && data ?
                    <ComboboxPopover className="location-suggestions-box">
                        <ComboboxList>
                            {data.map(({ id, description }) => (
                                <ComboboxOption key={id} value={description} />
                            ))}
                        </ComboboxList>
                    </ComboboxPopover> : null
                }
            </Combobox>
    );
}

function SimpleSearch(props){
    return <Search {...props} simple/>
}

function AdvancedSearch(props){
    return <Search {...props}/>
}

function FiltersView(props) {
    const history = useHistory();
    const [filterFields, updateFilterFields] = useGlobalState("sideBar");

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(setErrorClass, []);

    let updateFieldValue = (e) => {
        let field = e.target.name;
        let value = e.target.value;
        updateFilterFields(filter => {
            filter[field] = value;
        });
    }

    let updateLocation = (location) => {
        updateFilterFields(filter => {
            filter["location"] = location
        })
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        history.push("/ft");
    }

    let getOptions = (url) => {
        return fetch(url)
            .then(res => res.json())
            .then(results => results.results.map(
                amenity => { return {value: amenity.id, label: amenity.name} }
            ))
    }

    let getAmenities = inputValue => {
        const URL = `${BASE_API_URL}/amenities/?query={id,name}&format=json&name__icontains=${inputValue}`
        return getOptions(URL)
    }

    let updateAmenities = (amenities) => {
        if (!amenities) {
            amenities = []
        }
        updateFilterFields(filter => {
            filter['amenities'] = amenities;
        })
    }

    const handlePriceRangeChange = (event, newValue) => {
        updateFilterFields(filter => {
            filter['price__gt'] = newValue[0];
            filter['price__lt'] = newValue[1];
        });
    };

    return (
        <>
            <div class="m-0 p-0 px-2 px-lg-3 mt-2 mt-md-0 col-12 filter-header">Quick Filter</div>
            <form id="filter-form" class="p-0 m-0 px-2 px-lg-3" onSubmit={handleSubmit}>
                <div class="m-0 p-0 mt-2">
                    <label class="form-check-label col-12 p-0 m-0">I want to</label>
                    <select class="custom-select" name="available_for" value={filterFields.available_for} onChange={updateFieldValue} required>
                        <option value="rent">Rent</option>
                        <option value="sale">Buy</option>
                    </select>
                </div>

                <div class="m-0 p-0 mt-2">
                    <label class="form-check-label col-12 p-0 m-0">Property</label>
                    <select class="custom-select" name="property_type" value={filterFields.property_type} onChange={updateFieldValue} required>
                        <option value="rooms">Room</option>
                        <option value="apartments">Apartment</option>
                        <option value="houses">House</option>
                        <option value="frames">Frame</option>
                        <option value="offices">Office</option>
                        <option value="hostels">Hostel</option>
                        <option value="lands">Land</option>
                    </select>
                </div>

                <label class="form-check-label p-0 m-0 m-0 p-0 mt-5 mt-lg-4">Price range</label>
                <div class="row col-12 p-0 m-0 mt-1">
                    <div class="p-0 m-0 col-5">
                        <label class="form-check-label col-12 p-0 m-0">Min</label>
                        <input type="number" name="price__gt" class="form-control number-input"
                            value={filterFields.price__gt} onChange={updateFieldValue} placeholder="20000" />
                    </div>
                    <div class="col-2 p-0 m-0 px-2"><hr class="line-separator"/></div>
                    <div class="p-0 m-0 col-5">
                        <label class="form-check-label col-12 p-0 m-0">Max</label>
                        <input type="number" name="price__lt" class="form-control number-input"
                            value={filterFields.price__lt} onChange={updateFieldValue} placeholder="60000" />
                    </div>
                </div>

                <div className="price-range p-0 m-0 mt-3">
                    <PriceRangeSlider
                        className="range-input"
                        value={[filterFields.price__gt, filterFields.price__lt]}
                        max={1000000}
                        min={0}
                        step={1000}
                        onChange={handlePriceRangeChange}
                        valueLabelDisplay="off"
                        aria-labelledby="range-slider" />
                </div>

                <div class="m-0 p-0">
                    <label class="form-check-label col-12 p-0 m-0">Currency</label>
                    <select class="custom-select" name="currency" value={filterFields.currency} onChange={updateFieldValue}>
                        <option value="">All</option>
                        <option value="TZS">TZS</option>
                        <option value="USD">USD</option>
                    </select>
                </div>

                <div class="m-0 p-0 mt-5 mt-lg-4">
                    <label class="form-check-label col-12 p-0 m-0">Location</label>
                { isLoaded ?
                    <AdvancedSearch value={filterFields.location} onChange={updateLocation} />:
                    <SimpleSearch value={filterFields.location} onChange={updateLocation} />
                }
                </div>

                <div class="m-0 p-0 mt-2 mb-2">
                    <label class="form-check-label col-12 p-0 m-0">Amenities</label>
                    <div class="row mt-1 mb-3">
                        <div class="col-12">
                            <AsyncSelect isMulti cacheOptions
                                defaultOptions value={filterFields.amenities}
                                loadOptions={getAmenities} onChange={updateAmenities} />
                        </div>
                    </div>

                </div>
                <button type="submit" class="col-12 btn btn-primary mt-3 my-md-2 py-2 py-md-1">Search</button>
            </form>
        </>
    );
}


function SideBar(props){
    return (
        <div class={`sidebar sidebar-lg text-secondary p-0 m-0 pt-2 sticky-top d-none d-lg-block col-lg-2`}>
            <FiltersView />
        </div>
    )
}


function FiltersPage(props){
    useScrollTop();
    const animate = usePageTransition();
    return (
        <div class={`sidebar sidebar-sm text-secondary p-0 m-0 px-2 d-relative d-lg-none col-12 pb-4 ${animate()}`}>
            <FiltersView />
        </div>
    )
}


export { SideBar, FiltersPage }
