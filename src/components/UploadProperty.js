import React, { useState } from 'react';
import './UploadProperty.css';
import { } from 'react-router-dom';
import { Block, Select } from './';


function UploadProperty(props) {
    let options = [
        "one", "two", "three", "four", "five", "six", "seven",
        "eight", "nine", "ten", "eleven", "twelve", "thirteen",
        "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
        "nineteen", "twelve"
    ]

    return (
        <div class="container-fluid p-0 m-0 px-2">
            <form class="property-form text-secondary">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="form-row justify-content-center p-0 m-0">
                            <label class="form-check-label m-0 mt-lg-1 text-align-left col-12">Price</label>
                            <div class="row p-0 m-0">
                                <div class="col-8 d-inline my-1 px-1">
                                    <input type="number" class="form-control" placeholder="Price" />
                                </div>
                                <div class="col-4 d-inline my-1 px-1">
                                    <input type="text" class="form-control" placeholder="Currency" />
                                </div>
                            </div>
                        </div>
                        <div class="form-row justify-content-center p-0 m-0 my-2 my-lg-3">
                            <label class="form-check-label mt-2 text-align-left col-12">Location</label>
                            <div class="row p-0 m-0">
                                <div class="col-12 d-inline my-1 px-1">
                                    <input type="text" class="form-control" placeholder="Country" />
                                </div>
                                <div class="col-6 d-inline my-1 px-1">
                                    <input type="text" class="form-control" placeholder="Region" />
                                </div>
                                <div class="col-6 d-inline my-1 px-1">
                                    <input type="text" class="form-control" placeholder="Distric" />
                                </div>
                                <div class="col-6 d-inline my-1 px-1">
                                    <input type="text" class="form-control" placeholder="Street1" />
                                </div>
                                <div class="col-6 d-inline my-1 px-1">
                                    <input type="text" class="form-control" placeholder="Street2" />
                                </div>
                            </div>
                        </div>

                        <div class="col-12 px-1 my-3 my-lg-4">
                            <label class="form-check-label col-12 px-0">Amenities</label>
                            <Select
                                class="custom-select"
                                options={options}
                                placeholder="Select Amenity"
                            />
                        </div>

                        <div class="col-12 px-1 my-3 my-lg-4">
                            <label class="form-check-label col-12 px-0">Services</label>
                            <Select
                                class="custom-select"
                                options={options}
                                placeholder="Select Service"
                            />
                        </div>

                        <div class="col-12 px-1 my-3 my-lg-4">
                            <label class="form-check-label col-12 px-0">Potentials</label>
                            <Select
                                class="custom-select"
                                options={options}
                                placeholder="Select Potential"
                            />
                        </div>

                        <div class="col-12 px-1 my-2 my-lg-3">
                            <input type="text" class="form-control" id="inlineFormInput" placeholder="Location" />
                        </div>
                        <div class="col-12 px-1 my-2 my-lg-3">
                            <input type="text" class="form-control" id="inlineFormInput" placeholder="Amenities" />
                        </div>
                    </div>

                    <div class="col-12 col-md-6">
                        <div class="row col-12 p-0 m-0 justify-content-center mt-3">
                            <div class="upload-main-img">
                                <span class="fa fa-camera"/>
                            </div>
                        </div>

                        <div class="row col-12 p-0 m-0 justify-content-center mt-3">
                            <div class="upload-other-img">
                                <span class="fa fa-camera align-content-end"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <button type="submit" class="btn btn-info mt-4 col-6">Submit</button>
                </div>

            </form>
        </div>
    )
}

export { UploadProperty }
