import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useGlobalState } from 'simple-react-state';
import './SideBar.scss';
import { Select } from   './';
import { setErrorClass } from '../utils';
import store from '../store';


let options = [
    {id: 1, name: "one"},
    {id: 2, name: "two"},
    {id: 3, name: "three"},
    {id: 4, name: "four"},
    {id: 5, name: "five"},
    {id: 1, name: "Repeat One"}
];


store.setState({
    field: "sideBar",
    value: {
        price__lt: "",
        price__gt: "",
        currency: "",
        location: "",
        available_for: "",
        property_type: "",
        amenities: []
    }
})

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
                <div class="floating m-0 p-0 mt-4">
                  <select class="custom-select floating__input" name="available_for" value={filterFields.available_for} onChange={updateFieldValue} required>
                      <option selected disabled value=""></option>
                      <option value="rent">Rent</option>
                      <option value="sale">Buy</option>
                      <option value="book">Book</option>
                  </select>
                  <label for="price__gt" class="floating__label" data-content="I want to"></label>
                </div>

                <div class="floating m-0 p-0 mt-5">
                    <select class="custom-select floating__input" name="property_type" value={filterFields.property_type} onChange={updateFieldValue} required>
                        <option selected disabled value=""></option>
                        <option value="rooms">Room</option>
                        <option value="apartments">Apartment</option>
                        <option value="houses">House</option>
                        <option value="halls">Hall</option>
                        <option value="frames">Frame</option>
                        <option value="offices">Office</option>
                        <option value="hostels">Hostel</option>
                        <option value="lands">Land</option>
                    </select>
                    <label for="property_type" class="floating__label" data-content="Property"></label>
                </div>

                <label class="form-check-label p-0 m-0 m-0 p-0 mt-4">Price range</label>
                <div class="row col-12 p-0 m-0 mt-2">
                    <div class="floating p-0 m-0 col-5">
                        <input type="number" name="price__gt" class="form-control floating__input"
                        value={filterFields.price__gt} onChange={updateFieldValue} placeholder="From" />
                        <label for="price__gt" class="floating__label" data-content="From"></label>
                    </div>
                    <div class="col-2 p-0 m-0"></div>
                    <div class="floating p-0 m-0 col-5">
                        <input type="number" name="price__lt" class="form-control floating__input"
                        value={filterFields.price__lt} onChange={updateFieldValue} placeholder="To" />
                        <label for="price__lt" class="floating__label" data-content="To"></label>
                    </div>
                </div>

                <div class="floating m-0 p-0 mt-4">
                    <select class="custom-select floating__input" name="currency" value={filterFields.currency} onChange={updateFieldValue}>
                        <option value="">All</option>
                        <option value="TZS">TZS</option>
                        <option value="USD">USD</option>
                    </select>
                    <label for="currency" class="floating__label" data-content="Currency"></label>
                </div>

                <div class="floating m-0 p-0 mt-5">
                    <input type="text" name="location" class="form-control col-12 floating__input" value={filterFields.location}
                    onChange={updateFieldValue} placeholder="Location" />
                    <label for="location" class="floating__label" data-content="Location"></label>
                </div>

                <div class="m-0 p-0 mt-4 mb-2">
                    <label class="form-check-label col-12 m-0 p-0">Amenities</label>
                    <Select className="custom-select floating__input" name="amenities" options={options} placeholder="Select amenity"
                    onChange={updateSelectionField} value={filterFields.amenities.selected} optionName={optionName} optionValue={optionValue}/>
                </div>
                <button type="submit" class="col-12 btn btn-primary my-5 my-md-4 py-2 py-md-1">Submit</button>
            </form>
        </div>
    );
}


export { SideBar }
