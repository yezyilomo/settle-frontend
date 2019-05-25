import React, {  } from 'react';
import './UploadProperty.css';
import { } from 'react-router-dom';
import { Select, FeatureForm } from './';


function UploadProperty(props) {
    let options = [
        "one", "two", "three", "four", "five", "six", "seven",
        "eight", "nine", "ten", "eleven", "twelve", "thirteen",
        "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
        "nineteen", "twenty"
    ];

    let values = ["one", "two", "three"];
    let currencies = ["TZS", "USD"];
    let countries = ["Tanzania", "Kenya", "Uganda", "Zambia", "Zanzibar"];

    return (
        <div class="custom-container">
            <form class="property-form text-secondary">
                <div class="row">
                    <div class="col-12 col-md-6 justify-content-center ">

                            <div class="row p-0 m-0 my-0 my-lg-1">
                                <label class="form-check-label col-12 px-2">Pricing</label>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-8 px-2">
                                            <input type="number" class="form-control" placeholder="Price" />
                                        </div>
                                        <div class="col-4 px-2">
                                            <select class="custom-select" name="currency">
                                                <option value="" disabled selected>Currency</option>
                                                {currencies.map((currency)=><option value={currency}>{currency}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Location</label>
                                <div class="col-12 my-1 px-2">
                                    <select class="custom-select" name="country">
                                        <option value="" disabled selected>Country</option>
                                        {countries.map((country)=><option value={country}>{country}</option>)}
                                    </select>
                                </div>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-6 px-2">
                                            <input type="text" class="form-control" placeholder="Region" />
                                        </div>
                                        <div class="col-6 px-2">
                                            <input type="text" class="form-control" placeholder="Distric" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-6 px-2">
                                            <input type="text" class="form-control" placeholder="Street1" />
                                        </div>
                                        <div class="col-6 px-2">
                                            <input type="text" class="form-control" placeholder="Street2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Amenities</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" options={options} placeholder="Select Amenity"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Services</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" options={options} values={values} placeholder="Select Service"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Potentials</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" options={options} placeholder="Select Potential"/>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <FeatureForm  label="Add Other Features"/>
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
