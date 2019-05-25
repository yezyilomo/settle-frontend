import React from 'react';
import './SideBar.css';
import {Select} from './';

function SideBar(props) {
    let options = [
        "one", "two", "three", "four", "five", "six", "seven",
        "eight", "nine", "ten", "eleven", "twelve", "thirteen",
        "fourteen", "fifteen", "sixteen", "seventeen, thousand, three hundred and one", "eighteen",
        "nineteen", "twelve",
    ]
    return (
        <div class={`sidebar  text-secondary ${props.setting}`}>
            <h6 class="w-100 ml-0 mb-0 font-weight-bold">Quick Filter</h6>
            <form>
                <select class="custom-select mr-sm-2 my-2" id="inlineFormCustomSelect">
                    <option selected disabled>I want to...</option>
                    <option value="1">Rent</option>
                    <option value="2">Buy</option>
                    <option value="2">Book</option>
                </select>
                <select class="custom-select mr-sm-2 my-2" id="inlineFormCustomSelect">
                    <option selected disabled>Property...</option>
                    <option value="1">Room</option>
                    <option value="2">Apartment</option>
                    <option value="3">House</option>
                </select>
                <div class="form-row align-items-center">
                    <label class="form-check-label mt-2 mb-0 p-0 mx-2">Price range</label>
                    <div class="row p-0 mx-2">
                        <input type="number" class="form-control m-0 px-2 col-5 d-inline" placeholder="From" />
                        <div class="col p-0 m-0"><hr class="mx-1" /></div>
                        <input type="number" class="form-control m-0 px-2 col-5 d-inline" placeholder="To" />
                    </div>
                </div>

                <label class="form-check-label col-12 mt-4 mb-0 p-0 mx-0">Amenities</label>
                <Select
                    class="custom-select"
                    options={options}
                    placeholder="Select Amenity"
                />
                <input type="text" class="form-control my-4" id="inlineFormInput" placeholder="Location" />
                <button type="submit" class="btn btn-info mt-3 mb-5 col-12">Submit</button>
            </form>
        </div>
    );
}

export { SideBar };
