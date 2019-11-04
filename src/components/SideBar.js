import React from 'react';
import { withRouter } from  'react-router-dom';
import { useGlobalState } from 'simple-react-state';
import './SideBar.css';
import { Select } from   './';

let options = [
    {id: 1, name: "one"},
    {id: 2, name: "two"},
    {id: 3, name: "three"},
    {id: 4, name: "four"},
    {id: 5, name: "five"},
    {id: 1, name: "Repeat One"}
];


function SideBar(props) {
    let [filterFields, updateFilterFields] = useGlobalState("sideBar");

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
        props.history.push("/ft");
    }
    return (
        <div class={`sidebar  text-secondary ${props.setting}`}>
            <h6 class="w-100 ml-0 mb-0 font-weight-bold">Quick Filter</h6>
            <form id="filter-form" onSubmit={handleSubmit}>
                <select class="custom-select mr-sm-2 my-2" name="category" value={filterFields.category} onChange={updateFieldValue} required>
                    <option selected disabled>I want to...</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Buy</option>
                    <option value="book">Book</option>
                </select>
                <select class="custom-select mr-sm-2 my-2" name="property_type" value={filterFields.property_type} onChange={updateFieldValue} required>
                    <option selected disabled>Property...</option>
                    <option value="room">Room</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                </select>
                <div class="form-row align-items-center">
                    <label class="form-check-label mt-2 mb-0 p-0 mx-2">Price range</label>
                    <div class="row p-0 mx-2">
                        <input type="number" name="price__gt" class="form-control m-0 px-2 col-5 d-inline"
                        value={filterFields.price__gt} onChange={updateFieldValue} placeholder="From" />
                        <div class="col p-0 m-0"><hr class="mx-1" /></div>
                        <input type="number" name="price__lt" class="form-control m-0 px-2 col-5 d-inline"
                        value={filterFields.price__lt} onChange={updateFieldValue} placeholder="To" />
                    </div>
                </div>
                <select class="custom-select mr-sm-2 my-3" name="currency" value={filterFields.currency} onChange={updateFieldValue}>
                    <option selected disabled>Currency</option>
                    <option value="TZS">TZS</option>
                    <option value="USD">USD</option>
                </select>

                <input type="text" name="location" class="form-control my-3" value={filterFields.location}
                 onChange={updateFieldValue} placeholder="Location" />

                <label class="form-check-label col-12 mt-1 mb-0 p-0 mx-0">Amenities</label>
                <Select class="custom-select" name="amenities" options={options} placeholder="Select Amenity"
                onChange={updateSelectionField} value={filterFields.amenities.selected} optionName={optionName} optionValue={optionValue}
                />
                <button type="submit" class="col-12 btn btn-info mt-4">Submit</button>
            </form>
        </div>
    );
}

const comp = withRouter(SideBar)

export { comp as SideBar }
