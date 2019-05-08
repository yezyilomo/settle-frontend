import React from 'react';
import './SideBar.css';

function SideBar(props) {
    return (
        <div class={`sidebar  text-secondary ${props.setting}`}>
            <h6 class="w-100 ml-0 mb-0 font-weight-bold">Quick Filter</h6>
            <form>
                <select class="custom-select mr-sm-2 my-2" id="inlineFormCustomSelect">
                    <option selected>I want to...</option>
                    <option value="1">Rent</option>
                    <option value="2">Buy</option>
                    <option value="2">Book</option>
                </select>
                <select class="custom-select mr-sm-2 my-2" id="inlineFormCustomSelect">
                    <option selected>Property...</option>
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
                <input type="text" class="form-control my-4" id="inlineFormInput" placeholder="Location" />
                <input type="text" class="form-control my-4" id="inlineFormInput" placeholder="Amenities" />
                <div class="mt-4">
                    <label class="form-check-label mt-2 ml-1">Electricity</label>
                    <input class="form-check-input ml-4 my-2" type="checkbox" ></input>
                </div>
                <div class="mt-4">
                    <label class="form-check-label mt-2 ml-1">Price Negotiation</label>
                    <input class="form-check-input ml-4 my-2" type="checkbox" ></input>
                </div>
                <button type="submit" class="btn btn-info mt-4 col-12">Submit</button>
            </form>
        </div>
    );
}

export { SideBar };