import React, {  } from 'react';
import './UploadProperty.css';
import { } from 'react-router-dom';
import {setGlobal, useGlobal} from 'reactn';
import { Select, FeaturesInput} from './';

let options = [
    {id: 1, name: "one"},
    {id: 2, name: "two"},
    {id: 3, name: "three"},
    {id: 4, name: "four"},
    {id: 5, name: "five"},
    {id: 1, name: "Repeat One"}
];

setGlobal({
    UploadProperty: {
        amenities: {selected: [], options: options},
        services: {selected: [], options: options},
        potentials: {selected: [], options: options}
    }
})

function UploadProperty(props) {
    let [fields, setFields] = useGlobal("UploadProperty")
    let [otherFeatures, ] = useGlobal("FeaturesInput")

    let currencies = ["TZS", "USD"];
    let countries = ["Tanzania", "Kenya", "Uganda", "Zambia", "Zanzibar"];

    let handleSubmit = (e) => {
        e.preventDefault();
        let form = e.target
        let data = {
            price: form.price.value,
            currency: form.currency.value,
            Country: form.country.value,
            region: form.region.value,
            distric: form.distric.value,
            street1: form.street1.value,
            Street2: form.street2.value,
            amenities: fields.amenities.selected.map(amenity => amenity.id),
            services: fields.services.selected.map(service => service.id),
            potentials: fields.potentials.selected.map(potential => potential.id),
            other_features: otherFeatures
        }
        alert(JSON.stringify(data));
    }

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
        setFields(fields)
    }

    return (
        <div class="custom-container">
            <form class="property-form text-secondary" onSubmit={handleSubmit}>
                <div class="row">
                    <div class="col-12 col-md-6 justify-content-center ">

                            <div class="row p-0 m-0 my-0 my-lg-1">
                                <label class="form-check-label col-12 px-2">Pricing</label>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-8 px-2">
                                            <input type="number" name="price" value={fields.price} onChange={updateValue} class="form-control" placeholder="Price" />
                                        </div>
                                        <div class="col-4 px-2">
                                            <select class="custom-select" name="currency" value={fields.currency} onChange={updateValue}>
                                                <option value="" disabled selected>Currency</option>
                                                {currencies.map((currency)=><option  value={currency}>{currency}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Location</label>
                                <div class="col-12 my-1 px-2">
                                    <select class="custom-select" name="country" value={fields.country} onChange={updateValue}>
                                        <option value="" disabled selected>Country</option>
                                        {countries.map((country)=><option value={country}>{country}</option>)}
                                    </select>
                                </div>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-6 px-2">
                                            <input type="text" name="region" value={fields.region} onChange={updateValue}
                                            class="form-control" placeholder="Region" />
                                        </div>
                                        <div class="col-6 px-2">
                                            <input type="text" name="distric" value={fields.distric} onChange={updateValue}
                                            class="form-control" placeholder="Distric" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-6 px-2">
                                            <input type="text" name="street1" value={fields.street1} onChange={updateValue}
                                            class="form-control" placeholder="Street1" />
                                        </div>
                                        <div class="col-6 px-2">
                                            <input type="text" name="street2" value={fields.street2} onChange={updateValue}
                                            class="form-control" placeholder="Street2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Amenities</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" name="amenities" options={fields.amenities.options} onChange={updateField}
                                     value={fields.amenities.selected} optionName={optionName} optionValue={optionValue} placeholder="Select Amenity"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Services</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" name="services" options={fields.services.options} onChange={updateField}
                                     value={fields.services.selected} optionName={optionName} optionValue={optionValue} placeholder="Select Service"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Potentials</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" name="potentials" options={fields.potentials.options} onChange={updateField}
                                      value={fields.potentials.selected} optionName={optionName} optionValue={optionValue} placeholder="Select Potential"/>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <FeaturesInput label="Add Other Features"/>
                            </div>

                    </div>

                    <div class="col-12 col-md-6">
                        <div class="row p-0 m-0 mt-3 mt-md-1 justify-content-center">
                            <label class="form-check-label col-12 p-0 m-0 px-0">Pictures</label>
                            <div class="upload-main-img d-flex flex-column align-content-center justify-content-center flex-wrap">
                                <div>Upload main image</div>
                                <div class="d-flex flex-row justify-content-end">
                                    <span class="camera fa fa-camera"/>
                                    <span class="plus fa fa-plus"/>
                                </div>
                            </div>
                        </div>
                        <hr class="mx-0 mx-lg-0"/>
                        <div class="row p-0 m-0  mt-3 justify-content-center">
                            <div class="upload-other-img d-flex flex-column justify-content-center align-content-center flex-wrap">
                                <div>Upload other images</div>
                                <div class="d-flex flex-row justify-content-center">
                                    <span class="camera fa fa-camera"/>
                                    <span class="plus fa fa-plus"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <button type="submit" class="btn btn-info mt-4 col-11 col-sm-6">Submit</button>
                </div>

            </form>
        </div>
    )
}

export { UploadProperty }
