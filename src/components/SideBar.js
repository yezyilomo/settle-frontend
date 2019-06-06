import React, { } from 'react';
import { Link } from 'react-router-dom';
import {setGlobal, useGlobal} from 'reactn';
import './SideBar.css';
import { Select } from './';


let filters = {
    category: "",
    property_type: "",
    price__lt: 0,
    price__gt: 0,
    amenities: "[]",
    location: ""
}

let sideBarGlobalStates = {
    SideBar: {filters: filters }
}

setGlobal(sideBarGlobalStates);

function SideBar(props) {
    let options = [
        "one", "two", "three", "four", "five", "six", "seven",
        "eight", "nine", "ten", "eleven", "twelve", "thirteen",
        "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
        "nineteen", "twelve",
    ]

    let [sideBarStates, setSideBarStates] = useGlobal("SideBar")

    let handleSubmit = (e) => {
        e.preventDefault();
        let form = document.getElementById("filter-form")
        let filters = {
            category: form.category.value,
            property_type: form.property_type.value,
            price__lt: form.price__lt.value,
            price__gt: form.price__gt.value,
            amenities: form.amenities.value,
            location: form.loc.value
        }
        sideBarStates.filters = filters
        setSideBarStates(sideBarStates);
    }
    return (
        <div class={`sidebar  text-secondary ${props.setting}`}>
            <h6 class="w-100 ml-0 mb-0 font-weight-bold">Quick Filter</h6>
            <form onChange={handleSubmit} id="filter-form">
                <select class="custom-select mr-sm-2 my-2" name="category" id="inlineFormCustomSelect">
                    <option selected disabled>I want to...</option>
                    <option value="rent">Rent</option>
                    <option value="buy">Buy</option>
                    <option value="book">Book</option>
                </select>
                <select class="custom-select mr-sm-2 my-2" name="property_type" id="inlineFormCustomSelect">
                    <option selected disabled>Property...</option>
                    <option value="room">Room</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                </select>
                <div class="form-row align-items-center">
                    <label class="form-check-label mt-2 mb-0 p-0 mx-2">Price range</label>
                    <div class="row p-0 mx-2">
                        <input type="number" name="price__gt" class="form-control m-0 px-2 col-5 d-inline" placeholder="From" />
                        <div class="col p-0 m-0"><hr class="mx-1" /></div>
                        <input type="number" name="price__lt" class="form-control m-0 px-2 col-5 d-inline" placeholder="To" />
                    </div>
                </div>

                <label class="form-check-label col-12 mt-4 mb-0 p-0 mx-0">Amenities</label>
                <Select
                    class="custom-select"
                    name="amenities"
                    options={options}
                    placeholder="Select Amenity"
                />
                <input type="text" name="loc" class="form-control my-4" id="inlineFormInput" placeholder="Location" />
                <Link to="/ft" >
                    <button type="submit" class="btn btn-info mt-3 mb-5 col-12">Submit</button>
                </Link>
            </form>
        </div>
    );
}

export { SideBar };
