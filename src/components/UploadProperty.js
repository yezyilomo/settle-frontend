import React, { useState, useEffect } from 'react';
import './UploadProperty.css';
import {withRouter} from 'react-router-dom';
import {useGlobal} from 'reactn';
import {
    Select, FeaturesInput, ImageUploader,
    MultipleImageUploader, Loader
} from './';
import {API_URL} from '../';


let initialData = {
    amenities: {selected: [], options: []},
    services: {selected: [], options: []},
    potentials: {selected: [], options: []},
    main_picture: [],
    other_pictures: [],
    other_features: []
}


function UploadProperty(props){
    let [fields, setFields] = useState(initialData);
    let [user, ] = useGlobal("User");

    let currencies = ["TZS", "USD"];
    let countries = ["Tanzania", "Kenya", "Uganda", "Zambia", "Zanzibar"];
    let categories = ["rent", "sale", "book" ];
    let types = ["room", "house", "apartment", "land", "frame", "office"];

    let selectionFields = {
        amenities: {"add": [], "remove": []},
        service: {"add": [], "remove": []},
        potentials: {"add": [], "remove": []}
    }

    let postImages = (propertyID, pictures) => {
        if(pictures.length === 0){
            // Render property
            props.history.push({
                pathname: `/property/${propertyID}`,
                edit: true
            })
            props.history.push(`/property/${propertyID}`);
            return
        }
        let img = pictures.pop();
        let postData = new FormData();
        postData.append("property", propertyID)
        postData.append("is_main", Number(img.is_main))
        postData.append("tool_tip", img.tool_tip)
        postData.append("src", img.src)

        let postUrl = `${API_URL}/picture/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`
        }
        fetch(postUrl, {method: 'POST', body: postData, headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => postImages(propertyID, pictures))
        .catch(error => console.log(error));
    }

    let updatePropertyImages = (response) => {
        if(response.status !== 201){
            // Report error
            return
        }
        let id = response.data.id;
        let pictures = [...fields.main_picture, ...fields.other_pictures]
        postImages(id, pictures)
    }

    let createProperty = (e) => {
        e.preventDefault();
        let form = e.target
        let formData = {
            category: form.category.value,
            price: form.price.value,
            currency: form.currency.value,
            location: {
                country: form.country.value,
                region: form.region.value,
                distric: form.distric.value,
                street1: form.street1.value,
                street2: form.street2.value
            },
            contact: {
                name: form.full_name.value,
                email: form.email.value,
                phone: form.phone.value
            },
            amenities: {
                "add": selectionFields.amenities.add
            },
            services: {
                "add": selectionFields.services.add
            },
            potentials: {
                "add": selectionFields.potentials.add
            },
            other_features: {
                "create": fields.other_features
            }
        }

        let postUrl = `${API_URL}/${form.type.value}/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`,
            //'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        fetch(postUrl, {method: 'POST', body: JSON.stringify(formData), headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => updatePropertyImages(obj))
        .catch(error => alert(error));
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

    let updateSelection = (target) => {
        selectionFields[target.name] = target.values;
    }

    let updateOtherImages = (value) => {
        fields.other_pictures = value
        setFields(fields);
    }

    let updateMainImage = (value) => {
        fields.main_picture = value
        setFields(fields);
    }

    let updateFeatures = (features) => {
        fields.other_features = features;
        setFields(fields);
    }

    return (
        <div class="custom-container">
            <form class="property-form text-secondary" onSubmit={createProperty}>
                <div class="row">
                    <div class="col-12 col-md-6 justify-content-center ">

                            <div class="row p-0 m-0 my-0 my-lg-1">
                                <label class="form-check-label col-12 px-2">Property type</label>
                                <div class="col-12 my-1 px-2">
                                    <select class="custom-select" name="type" value={fields.type} onChange={updateValue} required>
                                        <option value="" disabled selected>Select Type</option>
                                        {types.map((type)=><option value={type}>{type}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-2 my-lg-1">
                                <label class="form-check-label col-12 px-2">Available for</label>
                                <div class="col-12 my-1 px-2">
                                    <select class="custom-select" name="category" value={fields.category} onChange={updateValue} required>
                                        <option value="" disabled selected>Select Category</option>
                                        {categories.map((category)=><option value={category}>{category}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <label class="form-check-label col-12 px-2">Pricing</label>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-8 px-2">
                                            <input type="number" name="price" value={fields.price} onChange={updateValue}
                                                class="form-control" placeholder="Price" required/>
                                        </div>
                                        <div class="col-4 px-2">
                                            <select class="custom-select" name="currency" value={fields.currency} onChange={updateValue} required>
                                                <option value="" disabled selected>Currency</option>
                                                {currencies.map((currency)=><option  value={currency}>{currency}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
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

                            <div class="my-4">
                                <label class="form-check-label col-12 px-2">Features</label>
                                <div class="row col-12 p-0 m-0 mt-1 mb-3">
                                    <div class="col-12 px-2">
                                        <Select class="custom-select" name="amenities" options={props.options.amenities} onChange={updateSelection}
                                         value={fields.amenities.selected} optionName={optionName} optionValue={optionValue} placeholder="Amenities"/>
                                    </div>
                                </div>

                                <div class="row col-12 p-0 m-0 my-3 my-lg-3">
                                    <div class="col-12 px-2">
                                        <Select class="custom-select" name="services" options={props.options.services} onChange={updateSelection}
                                         value={fields.services.selected} optionName={optionName} optionValue={optionValue} placeholder="Services"/>
                                    </div>
                                </div>

                                <div class="row col-12 p-0 m-0 my-3 my-lg-3">
                                    <div class="col-12 px-2">
                                        <Select class="custom-select" name="potentials" options={props.options.potentials} onChange={updateSelection}
                                          value={fields.potentials.selected} optionName={optionName} optionValue={optionValue} placeholder="Potentials"/>
                                    </div>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <FeaturesInput label="Add Other Features" onChange={updateFeatures}/>
                            </div>

                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-check-label col-12 p-0 m-0 px-0 mt-1">Main Picture</label>
                        <ImageUploader name="main_picture" onChange={updateMainImage} />
                        <hr class="mx-0 mx-lg-0"/>
                        <label class="form-check-label col-12 p-0 m-0 px-0 mt-1">Other Pictures</label>
                        <MultipleImageUploader name="other_pictures" onChange={updateOtherImages}/>
                        <hr class="mx-0 mx-lg-0"/>
                        <div class="row p-0 m-0 my-2 my-lg-3">
                            <label class="form-check-label col-12 px-0">Contact</label>
                            <div class="col-12 my-1 px-0">
                                <input type="text" name="phone" value={fields.phone} onChange={updateValue}
                                class="form-control" placeholder="Phone Number" required/>
                            </div>
                            <div class="col-12 my-1">
                                <div class="row">
                                    <div class="col m-0 p-0 pr-1">
                                        <input type="text" name="full_name" value={fields.name} onChange={updateValue}
                                        class="form-control" placeholder="Name" required/>
                                    </div>
                                    <div class="col m-0 p-0 pl-1">
                                        <input type="text" name="email" value={fields.email} onChange={updateValue}
                                        class="form-control" placeholder="Email" required/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-content-center mb-4">
                    <button type="submit" class="btn btn-info mt-4 col-11 col-sm-6">Submit</button>
                </div>

            </form>
        </div>
    )
}

function OptionsFetcher(props) {
    let [amenities, setAmenities] = useState(null);
    let [services, setServices] = useState(null);
    let [potentials, setPotentials] = useState(null);
    let fetchOptions = () => {
        fetch(`${API_URL}/amenity/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setAmenities(results.results))
        .catch(error => console.log(error));

        fetch(`${API_URL}/service/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setServices(results.results))
        .catch(error => console.log(error));

        fetch(`${API_URL}/potential/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setPotentials(results.results))
        .catch(error => console.log(error));
    }
    useEffect(fetchOptions, []);
    let options = {
        amenities: amenities,
        services: services,
        potentials: potentials
    }

    return (
        amenities !== null && services !== null && potentials !== null?
            <UploadProperty history={props.history} options={options}/>:
            <Loader/>
    );
}


const comp = withRouter(OptionsFetcher);

export { comp as UploadProperty }
