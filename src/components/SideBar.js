import React, { } from 'react';
import { Link } from 'react-router-dom';
import {setGlobal, useGlobal} from 'reactn';
import './SideBar.css';
import { Select } from './';

let options = [
    {id: 1, name: "one"},
    {id: 2, name: "two"},
    {id: 3, name: "three"},
    {id: 4, name: "four"},
    {id: 5, name: "five"},
    {id: 1, name: "Repeat One"}
];

let sideBarGlobalStates = {
    SideBar: {
        price__lt: "",
        price__gt: "",
        location: "",
        amenities: {selected: [], options: options},
    }
}

setGlobal(sideBarGlobalStates);

function SideBar(props) {

    let [fields, setFields] = useGlobal("SideBar")

    let updateValue = (e) => {
        let field = e.target.name;
        fields[field] = e.target.value;
        setFields(fields)
    }

    let optionName = (opt) => {
        return opt.name
    }

    let optionValue = (opt) => {
        return opt.id
    }

    let updateField = (target) => {
        fields[target.name] = {
            selected: target.selected,
            options: target.options
        }
        setFields(fields);
    }
    return (
        <div class={`sidebar  text-secondary ${props.setting}`}>
            <h6 class="w-100 ml-0 mb-0 font-weight-bold">Quick Filter</h6>
            <form id="filter-form">
                <select class="custom-select mr-sm-2 my-2" name="category" value={fields.category} onChange={updateValue}>
                    <option selected disabled>I want to...</option>
                    <option value="rent">Rent</option>
                    <option value="buy">Buy</option>
                    <option value="book">Book</option>
                </select>
                <select class="custom-select mr-sm-2 my-2" name="property_type" value={fields.property_type} onChange={updateValue}>
                    <option selected disabled>Property...</option>
                    <option value="room">Room</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                </select>
                <div class="form-row align-items-center">
                    <label class="form-check-label mt-2 mb-0 p-0 mx-2">Price range</label>
                    <div class="row p-0 mx-2">
                        <input type="number" name="price__gt" class="form-control m-0 px-2 col-5 d-inline"
                        value={fields.price__gt} onChange={updateValue} placeholder="From" />
                        <div class="col p-0 m-0"><hr class="mx-1" /></div>
                        <input type="number" name="price__lt" class="form-control m-0 px-2 col-5 d-inline"
                        value={fields.price__lt} onChange={updateValue} placeholder="To" />
                    </div>
                </div>

                <label class="form-check-label col-12 mt-4 mb-0 p-0 mx-0">Amenities</label>
                <Select class="custom-select" name="amenities" options={fields.amenities.options} placeholder="Select Amenity"
                onChange={updateField} value={fields.amenities.selected} optionName={optionName} optionValue={optionValue}
                />
                <input type="text" name="location" class="form-control my-4" value={fields.location}
                 onChange={updateValue} placeholder="Location" />
                <Link to="/ft" >
                    <button class="btn btn-info mt-3 mb-5 col-12">Submit</button>
                </Link>
            </form>
        </div>
    );
}

export { SideBar };
