import React, { useState, useEffect } from 'react';
import './UploadProperty.scss';
import { useHistory } from 'react-router';
import { Button, Spinner } from 'react-bootstrap';
import { useGlobalState, useLocalState } from 'simple-react-state';
import {
    FeaturesInput, ImageUploader, MultipleImageUploader
} from './';
import { API_URL } from '../';
import { getPropertyRoute } from '../utils';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AsyncCreatableSelect from 'react-select/async-creatable';


let initialData = {
    amenities: [],
    services: [],
    potentials: [],
    main_picture: [],
    other_pictures: [],
    other_features: []
}


function UploadProperty(props){
    const history = useHistory();
    const [fields, setFields] = useLocalState(initialData);
    const [user, ] = useGlobalState("user");
    const [isLoading, setLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    let currencies = ["TZS", "USD"];
    let countries = ["Tanzania", "Kenya", "Uganda", "Zambia", "Zanzibar"];

    let postImages = (propertyID, pictures) => {
        if(pictures.length === 0){
            return history.push(`/${getPropertyRoute(props.type)}/${propertyID}`);
        }
        let img = pictures.pop();
        let postData = new FormData();
        postData.append("property", propertyID)
        postData.append("is_main", Number(img.is_main))
        postData.append("tool_tip", img.tool_tip)
        postData.append("src", img.src)

        let postUrl = `${API_URL}/property-pictures/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`
        }
        return fetch(postUrl, {method: 'POST', body: postData, headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => postImages(propertyID, pictures))
    }

    let updatePropertyImages = async (response) => {
        if(response.status !== 201){
            // Report error
            return
        }
        let id = response.data.id;
        let pictures = [...fields.main_picture, ...fields.other_pictures]
        await postImages(id, pictures)
    }

    let getAddList = options => {
        return options.filter(option => !option.__isNew__)
        .map(option => option.value)
    }

    let getCreateList = options => {
         return options.filter(option => option.__isNew__)
         .map(option => {return {name: option.label}})
    }

    let createProperty = (e) => {
        e.preventDefault();
        setCreateError("");
        setLoading(true);
        let form = e.target
        let formData = {
            available_for: form.available_for.value,
            price: form.price.value,
            currency: form.currency.value,
            location: {
                country: form.country.value,
                region: form.region.value,
                distric: form.distric.value,
                street1: form.street1.value,
                street2: form.street2.value
            },
            descriptions: fields.descriptions,
            contact: {
                name: form.full_name.value,
                email: form.email.value,
                phone: form.phone.value
            },
            amenities: {
                "add": getAddList(fields.amenities),
                "create": getCreateList(fields.amenities)
            },
            services: {
                "add": getAddList(fields.services),
                "create": getCreateList(fields.services)
            },
            potentials: {
                "add": getAddList(fields.potentials),
                "create": getCreateList(fields.potentials)
            },
            other_features: {
                "create": fields.other_features
            }
        }

        let postUrl = `${API_URL}/${getPropertyRoute(props.type)}/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`,
            'Content-Type': 'application/json'
        }
        fetch(postUrl, {method: 'POST', body: JSON.stringify(formData), headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => updatePropertyImages(obj))
        .catch(error => {
            // Network error
            setCreateError("No network connection, please try again!.");
        })
        .finally(() => {
            // Enable button
            setLoading(false);
        })
    }

    let updateValue = (e) => {
        setFields({
            field: e.target.name,
            value: e.target.value
        })
    }

    let updateOtherImages = (value) => {
        setFields({
            field: 'other_pictures',
            "value": value
        })
    }

    let updateMainImage = (value) => {
        setFields({
            field: 'main_picture',
            "value": value
        })
    }

    let updateFeatures = (features) => {
        setFields({
            field: 'other_features',
            value: features
        })
    }

    let getOptions = (url) => {
        return fetch(url)
        .then(res => res.json())
        .then(results => results.results.map(
            amenity => {return {value: amenity.id, label: amenity.name}}
        ))
    }

    let getAmenities = inputValue => {
        const URL = `${API_URL}/amenities/?query={id,name}&format=json&name__icontains=${inputValue}`
        return getOptions(URL)
    }

    let getServices = inputValue => {
        const URL = `${API_URL}/services/?query={id,name}&format=json&name__icontains=${inputValue}`
        return getOptions(URL)
    }

    let getPotentials = inputValue => {
        const URL = `${API_URL}/potentials/?query={id,name}&format=json&name__icontains=${inputValue}`
        return getOptions(URL)
    }

    let updateAmenities = (amenities) => {
        setFields({
            field: 'amenities',
            value: amenities
        })
    }

    let updateServices = (services) => {
        setFields({
            field: 'services',
            value: services
        })
    }

    let updatePotentials = (potentials) => {
        setFields({
            field: 'potentials',
            value: potentials
        })
    }

    return (
        <form class="property-form text-secondary px-3 px-sm-4 mt-2 mt-sm-3" onSubmit={createProperty}>
            <div class="row mt-3">
                <div class="col-12 col-md-6">

                    <div class="row p-0 m-0 mb-lg-1">
                        <label class="form-check-label col-12 p-0 m-0">Available for</label>
                        <div class="col-12 p-0 m-0 my-1">
                            <select class="custom-select" name="available_for" value={fields.available_for} onChange={updateValue} required>
                                <option value="" disabled selected>Select Category</option>
                                <option value="rent">Rent</option>
                                <option value="sale">Sale</option>
                                <option value="book">Book</option>
                            </select>
                        </div>
                    </div>

                    <div class="row p-0 m-0 my-4">
                        <label class="form-check-label col-12 p-0 m-0">Pricing</label>
                        <div class="col-12 p-0 m-0 my-1">
                            <div class="row">
                                <div class="col-8 pr-1">
                                    <input type="number" name="price" value={fields.price} onChange={updateValue}
                                        class="form-control" placeholder="Price" required />
                                </div>
                                <div class="col-4 pl-1">
                                    <select class="custom-select" name="currency" value={fields.currency} onChange={updateValue} required>
                                        <option value="" disabled selected>Currency</option>
                                        {currencies.map((currency) => <option value={currency}>{currency}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row p-0 m-0 my-4">
                        <label class="form-check-label col-12 p-0 m-0">Location</label>
                        <div class="col-12 p-0 m-0 my-1">
                            <select class="custom-select" name="country" value={fields.country} onChange={updateValue}>
                                <option value="" disabled selected>Country</option>
                                {countries.map((country) => <option value={country}>{country}</option>)}
                            </select>
                        </div>
                        <div class="col-12 p-0 m-0 my-1">
                            <div class="row">
                                <div class="col pr-1">
                                    <input type="text" name="region" value={fields.region} onChange={updateValue}
                                        class="form-control" placeholder="Region" />
                                </div>
                                <div class="col pl-1">
                                    <input type="text" name="distric" value={fields.distric} onChange={updateValue}
                                        class="form-control" placeholder="Distric" />
                                </div>
                            </div>
                        </div>
                        <div class="col-12 p-0 m-0 my-1">
                            <div class="row">
                                <div class="col pr-1">
                                    <input type="text" name="street1" value={fields.street1} onChange={updateValue}
                                        class="form-control" placeholder="Street1" />
                                </div>
                                <div class="col pl-1">
                                    <input type="text" name="street2" value={fields.street2} onChange={updateValue}
                                        class="form-control" placeholder="Street2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="my-4">
                        <label class="form-check-label col-12 p-0 m-0">Amenities</label>
                        <div class="row mt-1 mb-3">
                            <div class="col-12">
                            <AsyncCreatableSelect className="react-select-container" isMulti cacheOptions defaultOptions 
                            loadOptions={getAmenities} onChange={updateAmenities}/>
                            </div>
                        </div>

                        <label class="form-check-label col-12 p-0 m-0">Services</label>
                        <div class="row mt-1 mb-3">
                            <div class="col-12">
                            <AsyncCreatableSelect className="react-select-container" isMulti cacheOptions defaultOptions 
                            loadOptions={getServices} onChange={updateServices}/>
                            </div>
                        </div>

                        <label class="form-check-label col-12 p-0 m-0">Potentials</label>
                        <div class="row mt-1 mb-3">
                            <div class="col-12">
                            <AsyncCreatableSelect className="react-select-container" isMulti cacheOptions defaultOptions 
                            loadOptions={getPotentials} onChange={updatePotentials}/>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 p-0 m-0 my-4">
                        <FeaturesInput label="Add Other Features" onChange={updateFeatures} value={fields.other_features} />
                    </div>

                    <label class="form-check-label col-12 p-0 m-0">Description</label>
                    <div class="editor-container">
                        <CKEditor
                            editor={ClassicEditor}
                            data={fields.descriptions}
                            onInit={editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setFields({
                                    field: "descriptions",
                                    value: data
                                })
                            }}
                            onBlur={(event, editor) => {
                                console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                                console.log('Focus.', editor);
                            }}
                        />
                    </div>

                    <div class="row p-0 m-0 mt-4">
                        <label class="form-check-label col-12 p-0 m-0">Contact</label>
                        <div class="col-12 my-1 px-0">
                            <input type="text" name="phone" value={fields.phone} onChange={updateValue}
                                class="form-control" placeholder="Phone Number" required />
                        </div>
                        <div class="col-12 my-1">
                            <div class="row">
                                <div class="col m-0 p-0 pr-1">
                                    <input type="text" name="full_name" value={fields.name} onChange={updateValue}
                                        class="form-control" placeholder="Name" required />
                                </div>
                                <div class="col m-0 p-0 pl-1">
                                    <input type="text" name="email" value={fields.email} onChange={updateValue}
                                        class="form-control" placeholder="Email" required />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 mt-4 mt-md-0">
                    <div class="prop-pics-card sticky-top m-0 mb-md-1">
                        <label class="form-check-label col-12 p-0 m-0 mb-1">Main Picture</label>
                        <ImageUploader name="main_picture" onChange={updateMainImage} />
                        <hr class="line p-0 m-0 my-3" />
    
                        <label class="form-check-label col-12 p-0 m-0 my-1">Other Pictures</label>
                        <MultipleImageUploader name="other_pictures" onChange={updateOtherImages} />
                    </div>
                </div>
            </div>

            <hr class="line p-0 m-0 my-3" />

            <div class="row p-0 m-0 justify-content-center py-2 mt-4">
                <div class="col-12 mb-2 text-center text-danger">
                    {createError}
                </div>
                <Button className="col-12 col-md-6" variant="info" disabled={isLoading} type="submit">
                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
                </Button>
            </div>
        </form>
    )
}

function OptionsFetcher(props) {
    let [amenities, setAmenities] = useState(null);
    let [services, setServices] = useState(null);
    let [potentials, setPotentials] = useState(null);
    let fetchOptions = () => {
        fetch(`${API_URL}/amenities/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setAmenities(results.results))

        fetch(`${API_URL}/services/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setServices(results.results))

        fetch(`${API_URL}/potentials/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setPotentials(results.results))
    }
    useEffect(fetchOptions, []);
    let options = {
        amenities: amenities,
        services: services,
        potentials: potentials
    }

    return (
        <UploadProperty options={options} {...props}/>
    );
}


export { OptionsFetcher as UploadProperty }
