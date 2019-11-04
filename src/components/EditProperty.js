import React, { useState, useEffect } from 'react';
import './EditProperty.css';
import {withRouter} from 'react-router-dom';
import {
    Select, FeaturesInput, Fetcher, Loader,
    ImageUploader, MultipleImageUploader, PageError
} from './';
import {API_URL} from '../';
import { useLocalState, useGlobalState } from 'simple-react-state';


function EditProperty(props){
    let [fields, updateFields] = useLocalState(props.property);
    let [user, ] = useGlobalState("user");
    let [featuresToDelete, ] = useState([]);
    let [imgsToDelete, ] = useState([]);
    let [mainImg, setMainImg] = useState([]);
    let [otherImgs, setOtherImgs] = useState([]);

    let selectionFields = {
        amenities: {"add": [], "remove": []},
        service: {"add": [], "remove": []},
        potentials: {"add": [], "remove": []}
    }

    let currencies = ["TZS", "USD"];
    let countries = ["Tanzania", "Kenya", "Uganda", "Zambia", "Zanzibar"];
    let categories = ["rent", "sale", "book" ];
    let types = ["room", "house", "apartment", "land", "frame", "office"];

    let createImage = (img) => {
        let postData = new FormData();
        postData.append("property", fields.id)
        postData.append("is_main", Number(img.is_main))
        postData.append("tool_tip", img.tool_tip)
        postData.append("src", img.src)

        let postUrl = `${API_URL}/picture/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`
        }
        return fetch(postUrl, {method: 'POST', body: postData, headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => obj)
        .catch(error => console.log(error));
    }

    /*
    let updateImage = (img) => {
        let imgInfo = {
            tool_tip: img.tool_tip,
            is_main: img.is_main
        }
        let postUrl = `${API_URL}/picture/${img.id}/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`,
            'Content-Type': 'application/json'
        }
        return fetch(postUrl, {method: 'PUT', body: JSON.stringify(imgInfo), headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => obj)
        .catch(error => console.log(error));
    }
    */

    let deleteImage = (imgID) => {
        let postUrl = `${API_URL}/picture/${imgID}/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`,
            'Content-Type': 'application/json'
        }
        return fetch(postUrl, {method: 'DELETE', body: "", headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => obj)
        .catch(error => console.log(error));
    }

    let updateImages = (prevResponse) => {
        let pictures = [...mainImg, ...otherImgs]
        for(let picture of pictures){
            if(picture.id === null){
                createImage(picture);
            }
            else{
                //updateImage(picture);
            }
        }
        for(let pictureID of imgsToDelete){
            deleteImage(pictureID)
        }
        return prevResponse
    }

    let redirect = (response) => {
        return props.history.replace({
            pathname: `/property/${fields.id}`,
            edit: true
        })
    }

    let updateProperty = (e) => {
        e.preventDefault();
        let form = e.target

        let features = {
            create: [],
            remove: [],
            update: {}
        }
        
        for(let feature of fields.other_features){
            if(featuresToDelete.indexOf(feature.id) !== -1){
                //To delete
                continue
            }
            else if(feature.id === null){
                let featureValues = {name: feature.name, value: feature.value}
                features.create.push(featureValues)
            }
            else{
                let featureValues = {name: feature.name, value: feature.value}
                features.update[`${feature.id}`] = featureValues
            }
        }
        features.remove = featuresToDelete

        let formData = {
            category: form.category.value,
            price: form.price.value,
            currency: form.currency.value,
            amenities: selectionFields.amenities,
            services: selectionFields.services,
            potentials: selectionFields.potentials,
            location: {
                country: form.country.value,
                region: form.region.value,
                distric: form.distric.value,
                street1: form.street1.value,
                street2: form.street2.value
            },
            contact: {
                name: form._name.value,
                email: form.email.value,
                phone: form.phone.value
            },
            other_features: features
        }

        let postUrl = `${API_URL}/${form.type.value}/${fields.id}/?format=json`;
        let headers = {
            'Authorization': `Token ${user.authToken}`,
            'Content-Type': 'application/json'
        }
        fetch(postUrl, {method: 'PUT', body: JSON.stringify(formData), headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => updateImages(obj))
        .then(obj => redirect(obj))
        .catch(error => console.log(error));
    }

    let updateValue = (e) => {
        updateFields({
            field: e.target.getAttribute("data-field"),
            value: e.target.value
        })
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
        setOtherImgs(value);
    }

    let updateMainImage = (value) => {
        setMainImg(value);
    }

    let updateFeatures = (features) => {
        updateFields({
            field: "other_features",
            value: features
        })
    }

    let markToDelete = (feature) => {
        if(feature.id !== null){
            featuresToDelete.push(feature.id);
        }
    }

    let markImgToDelete = (img) => {
        if(img.id !== null){
            imgsToDelete.push(img.id);
        }
    }


    return (
        <div class="custom-container pb-5">
            <form class="property-form text-secondary" onSubmit={updateProperty}>
                <div class="row">
                    <div class="col-12 col-md-6 justify-content-center ">

                            <div class="row p-0 m-0 my-3 my-lg-1">
                                <label class="form-check-label col-12 px-2">Property type</label>
                                <div class="col-12 my-1 px-2">
                                    <select disabled class="custom-select" data-field="type" name="type" value={fields.prop_type} onChange={updateValue} required>
                                        <option value="" disabled selected>Select Type</option>
                                        {types.map((type)=><option value={type}>{type}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-3 my-lg-1">
                                <label class="form-check-label col-12 px-2">Available for</label>
                                <div class="col-12 my-1 px-2">
                                    <select class="custom-select" data-field="category" name="category" value={fields.category} onChange={updateValue} required>
                                        <option value="" disabled selected>Select Category</option>
                                        {categories.map((category)=><option value={category}>{category}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-3 my-lg-3">
                                <label class="form-check-label col-12 px-2">Pricing</label>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-8 px-2">
                                            <input type="number" data-field="price" name="price" value={fields.price} onChange={updateValue}
                                                class="form-control" placeholder="Price" required/>
                                        </div>
                                        <div class="col-4 px-2">
                                            <select class="custom-select" data-field="currency" name="currency" value={fields.currency} onChange={updateValue} required>
                                                <option value="" disabled selected>Currency</option>
                                                {currencies.map((currency)=><option  value={currency}>{currency}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-3 my-lg-3">
                                <label class="form-check-label col-12 px-2">Location</label>
                                <div class="col-12 my-1 px-2">
                                    <select class="custom-select" data-field="location.country" name="country" value={fields.location.country} onChange={updateValue}>
                                        <option value="" disabled selected>Country</option>
                                        {countries.map((country)=><option value={country}>{country}</option>)}
                                    </select>
                                </div>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-6 px-2">
                                            <input type="text" data-field="location.region" name="region" value={fields.location.region} onChange={updateValue}
                                            class="form-control" placeholder="Region" />
                                        </div>
                                        <div class="col-6 px-2">
                                            <input type="text" data-field="location.distric" name="distric" value={fields.location.distric} onChange={updateValue}
                                            class="form-control" placeholder="Distric" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-6 px-2">
                                            <input type="text" data-field="location.street1" name="street1" value={fields.location.street1} onChange={updateValue}
                                            class="form-control" placeholder="Street1" />
                                        </div>
                                        <div class="col-6 px-2">
                                            <input type="text" data-field="location.street2" name="street2" value={fields.location.street2} onChange={updateValue}
                                            class="form-control" placeholder="Street2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-3 my-lg-3">
                                <label class="form-check-label col-12 px-2">Amenities</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" name="amenities" options={props.options.amenities} onChange={updateSelection}
                                     value={fields.amenities} optionName={optionName} optionValue={optionValue} placeholder="Select Amenity"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-3 my-lg-3">
                                <label class="form-check-label col-12 px-2">Services</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" name="services" options={props.options.services} onChange={updateSelection}
                                     value={fields.services} optionName={optionName} optionValue={optionValue} placeholder="Select Service"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-3 my-lg-3">
                                <label class="form-check-label col-12 px-2">Potentials</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" name="potentials" options={props.options.potentials} onChange={updateSelection}
                                      value={fields.potentials} optionName={optionName} optionValue={optionValue} placeholder="Select Potential"/>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <FeaturesInput label="Add Other Features" onChange={updateFeatures}
                                 onDelete={markToDelete} value={fields.other_features}/>
                            </div>

                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-check-label col-12 p-0 m-0 px-0 mt-1">Main Picture</label>
                        <ImageUploader name="main_picture" src={fields.pictures.filter(img=>img.is_main)}
                            onChange={updateMainImage} onDelete={markImgToDelete}/>
                        <hr class="mx-0 mx-lg-0"/>
                        <label class="form-check-label col-12 p-0 m-0 px-0 mt-1">Other Pictures</label>
                        <MultipleImageUploader name="other_pictures" src={fields.pictures.filter(img=>!img.is_main)}
                            onChange={updateOtherImages} onDelete={markImgToDelete}/>
                        <hr class="mx-0 mx-lg-0"/>
                        <div class="row p-0 m-0 my-2 my-lg-3">
                            <label class="form-check-label col-12 px-0">Contact</label>
                            <div class="col-12 my-1 px-0">
                                <input type="text" data-field="contact.phone" name="phone" value={fields.contact.phone} onChange={updateValue}
                                class="form-control" placeholder="Phone Number" />
                            </div>
                            <div class="col-12 my-1">
                                <div class="row">
                                    <div class="col m-0 p-0 pr-1">
                                        <input type="text" data-field="contact.name" name="_name" value={fields.contact.name} onChange={updateValue}
                                        class="form-control" placeholder="Name" />
                                    </div>
                                    <div class="col m-0 p-0 pl-1">
                                        <input type="text" data-field="contact.email" name="email" value={fields.contact.email} onChange={updateValue}
                                        class="form-control" placeholder="Email" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <button type="submit" class="btn btn-info mt-4 col-11 col-sm-6">Save</button>
                </div>

            </form>
        </div>
    )
}

function PropertyFetcher(props){
    let fetchProperty = () => {
        return fetch(`${API_URL}/property/${props.id}/?
            query={
                id,
                category,
                price,
                currency,
                prop_type,
                location{
                    region,
                    country
                },
                rating,
                payment_terms,
                unit_of_payment_terms,
                amenities,
                services,
                potentials,
                pictures{
                    id,
                    is_main,
                    src
                },
                other_features{
                    id,
                    name,
                    value
                }
            }&format=json`
        )
        .then(res => res.json())
    }

    let [amenities, setAmenities] = useState([]);
    let [services, setServices] = useState([]);
    let [potentials, setPotentials] = useState([]);

    let fetchOptions = () => {
        fetch(`${API_URL}/amenity/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setAmenities(results.results))
        .catch(error => console.log(error))

        fetch(`${API_URL}/service/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setServices(results.results))
        .catch(error => console.log(error))

        fetch(`${API_URL}/potential/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setPotentials(results.results))
        .catch(error => console.log(error))
    }

    let options = {
        amenities: amenities,
        services: services,
        potentials: potentials
    }

    useEffect(fetchOptions, [])

    return (
        <Fetcher action={fetchProperty}
         placeholder={<Loader/>} error={<PageError/>}>{property => {
            return <EditProperty history={props.history} property={property} options={options}/>
        }}</Fetcher>
    );
}

const comp = withRouter(PropertyFetcher);

export { comp as EditProperty }
