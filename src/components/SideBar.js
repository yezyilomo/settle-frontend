import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useGlobalState } from 'simple-react-state';
import './SideBar.scss';
import { Select } from   './';
import { setErrorClass } from '../utils';


let options = [
    {id: 1, name: "one"},
    {id: 2, name: "two"},
    {id: 3, name: "three"},
    {id: 4, name: "four"},
    {id: 5, name: "five"},
    {id: 1, name: "Repeat One"}
];

function SideBar(props) {
    let history = useHistory();
    let [filterFields, updateFilterFields] = useGlobalState("sideBar");

    useEffect(setErrorClass, [])

    let updateFieldValue = (e) => {
        let field = e.target.name;
        let value = e.target.value;
        updateFilterFields({
            field: field,
            value: value
        });
    }

    let optionName = (opt) => {
        return opt.name
    }

    let optionValue = (opt) => {
        return opt.id
    }

    let updateSelectionField = (target) => {
        updateFilterFields({
            field: target.name,
            value: target.values.add
        });
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        history.push("/ft");
    }
    return (
        <div class={`sidebar text-secondary p-0 m-0 ${props.setting}`}>
            <h5 class="m-0 p-0 px-2 mt-3 mt-md-0 col-12">Quick Filter</h5>
            <form id="filter-form" class="p-0 m-0 px-2 pr-md-3" onSubmit={handleSubmit}>
                <select class="custom-select mt-3" name="available_for" value={filterFields.available_for} onChange={updateFieldValue} required>
                    <option selected disabled value="">I want to...</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Buy</option>
                    <option value="book">Book</option>
                </select>
                <select class="custom-select mt-4" name="property_type" value={filterFields.property_type} onChange={updateFieldValue} required>
                    <option selected disabled value="">Property...</option>
                    <option value="rooms">Room</option>
                    <option value="apartments">Apartment</option>
                    <option value="houses">House</option>
                    <option value="halls">Hall</option>
                    <option value="frames">Frame</option>
                    <option value="offices">Office</option>
                    <option value="hostels">Hostel</option>
                    <option value="lands">Land</option>
                </select>

                <label class="form-check-label p-0 m-0 mt-5">Price range</label>
                <div class="row col-12 p-0 m-0 mt-2">
                    <input type="number" name="price__gt" class="form-control m-0 col-5"
                    value={filterFields.price__gt} onChange={updateFieldValue} placeholder="From" />
                    <div class="col-2 p-0 m-0"><hr class="line mx-4" /></div>
                    <input type="number" name="price__lt" class="form-control m-0 col-5"
                    value={filterFields.price__lt} onChange={updateFieldValue} placeholder="To" />
                </div>

                <select class="custom-select mt-4" name="currency" value={filterFields.currency} onChange={updateFieldValue}>
                    <option selected disabled>Currency</option>
                    <option value="TZS">TZS</option>
                    <option value="USD">USD</option>
                </select>

                <label class="form-check-label col-12 m-0 p-0 mt-5">Location</label>
                <input type="text" name="location" class="form-control col-12" value={filterFields.location}
                onChange={updateFieldValue} placeholder="Dar es salaam" />

                <label class="form-check-label col-12 m-0 p-0 mt-4">Amenities</label>
                <Select class="custom-select" name="amenities" options={options} placeholder="Select amenity"
                onChange={updateSelectionField} value={filterFields.amenities.selected} optionName={optionName} optionValue={optionValue}
                />
                <button type="submit" class="col-12 btn btn-info my-5 my-md-4 py-2 py-md-1">Submit</button>
            </form>
        </div>
    );
}


export { SideBar }
