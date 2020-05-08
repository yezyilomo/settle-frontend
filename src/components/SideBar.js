import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useGlobalState } from 'state-pool';
import './SideBar.scss';
import { API_URL } from '../';
import { setErrorClass } from '../utils';
import AsyncCreatableSelect from 'react-select/async-creatable';


function SideBar(props) {
    let history = useHistory();
    let [filterFields, updateFilterFields] = useGlobalState("sideBar");

    useEffect(setErrorClass, [])

    let updateFieldValue = (e) => {
        let field = e.target.name;
        let value = e.target.value;
        updateFilterFields(filter => {
            filter[field] = value;
        });
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        history.push("/ft");
    }

    let getOptions = (url) => {
        return fetch(url)
            .then(res => res.json())
            .then(results => results.results.map(
                amenity => { return { value: amenity.id, label: amenity.name } }
            ))
    }

    let getAmenities = inputValue => {
        const URL = `${API_URL}/amenities/?query={id,name}&format=json&name__icontains=${inputValue}`
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

    return (
        <div class={`sidebar text-secondary p-0 m-0 ${props.setting}`}>
            <div class="m-0 p-0 px-2 mt-4 mt-md-0 col-12 filter-header">Quick Filter</div>
            <form id="filter-form" class="p-0 m-0 px-2 pr-md-3" onSubmit={handleSubmit}>
                <div class="m-0 p-0 mt-2">
                    <label class="form-check-label col-12 p-0 m-0">I want to</label>
                    <select class="custom-select" name="available_for" value={filterFields.available_for} onChange={updateFieldValue} required>
                        <option value="rent">Rent</option>
                        <option value="sale">Buy</option>
                        <option value="book">Book</option>
                    </select>
                </div>

                <div class="m-0 p-0 mt-2">
                    <label class="form-check-label col-12 p-0 m-0">Property</label>
                    <select class="custom-select" name="property_type" value={filterFields.property_type} onChange={updateFieldValue} required>
                        <option value="rooms">Room</option>
                        <option value="apartments">Apartment</option>
                        <option value="houses">House</option>
                        <option value="halls">Hall</option>
                        <option value="frames">Frame</option>
                        <option value="offices">Office</option>
                        <option value="hostels">Hostel</option>
                        <option value="lands">Land</option>
                    </select>
                </div>

                <label class="form-check-label p-0 m-0 m-0 p-0 mt-5 mt-lg-4">Price range</label>
                <div class="row col-12 p-0 m-0 mt-1">
                    <div class="p-0 m-0 col-5">
                        <label class="form-check-label col-12 p-0 m-0">From</label>
                        <input type="number" name="price__gt" class="form-control"
                            value={filterFields.price__gt} onChange={updateFieldValue} placeholder="20000" />
                    </div>
                    <div class="col-2 p-0 m-0 px-2"><hr class="line-separator"/></div>
                    <div class="p-0 m-0 col-5">
                        <label class="form-check-label col-12 p-0 m-0">To</label>
                        <input type="number" name="price__lt" class="form-control"
                            value={filterFields.price__lt} onChange={updateFieldValue} placeholder="60000" />
                    </div>
                </div>

                <div class="m-0 p-0 mt-1">
                    <label class="form-check-label col-12 p-0 m-0">Currency</label>
                    <select class="custom-select" name="currency" value={filterFields.currency} onChange={updateFieldValue}>
                        <option value="">All</option>
                        <option value="TZS">TZS</option>
                        <option value="USD">USD</option>
                    </select>
                </div>

                <div class="m-0 p-0 mt-5 mt-lg-4">
                    <label class="form-check-label col-12 p-0 m-0">Location</label>
                    <input type="text" name="location" class="form-control col-12" value={filterFields.location}
                        onChange={updateFieldValue} placeholder="City, Region or Street" />
                </div>

                <div class="m-0 p-0 mt-3 mb-2">
                    <label class="form-check-label col-12 p-0 m-0">Amenities</label>
                    <div class="row mt-1 mb-3">
                        <div class="col-12">
                            <AsyncCreatableSelect className="react-select-container" isMulti cacheOptions
                                defaultOptions value={filterFields.amenities}
                                loadOptions={getAmenities} onChange={updateAmenities} />
                        </div>
                    </div>

                </div>
                <button type="submit" class="col-12 btn btn-primary mt-4 my-md-2 py-2 py-md-1">Submit</button>
            </form>
        </div>
    );
}


export { SideBar }
