import React, { useState, useEffect } from 'react';
import './EditProperty.css';
import { useHistory } from 'react-router';
import {
    Select, FeaturesInput, LocalFetcher, Loader,
    ImageUploader, MultipleImageUploader, PageError
} from './';
import {API_URL} from '../';
import { useLocalState, useGlobalState } from 'simple-react-state';
import { getPropertyRoute } from '../utils';


function EditProperty(props){
    let history = useHistory();
    let [fields, updateFields] = useLocalState(props.property);
    let [user, ] = useGlobalState("user");
    let [featuresToDelete, ] = useState([]);
    let [imgsToDelete, ] = useState([]);
    let [mainImg, setMainImg] = useState([]);
    let [otherImgs, setOtherImgs] = useState([]);
    let [selectionFields, updateSelectionFields] = useLocalState({
        amenities: {"add": [], "remove": []},
        service: {"add": [], "remove": []},
        potentials: {"add": [], "remove": []},
    })

    let currencies = ["TZS", "USD"];
    let countries = ["Tanzania", "Kenya", "Uganda", "Zambia", "Zanzibar"];

    let createImage = (img) => {
        let postData = new FormData();
        postData.append("property", fields.id)
        postData.append("is_main", Number(img.is_main))
        postData.append("tool_tip", img.tool_tip)
        postData.append("src", img.src)

        let postUrl = `${API_URL}/pictures/`;
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
        let postUrl = `${API_URL}/pictures/${imgID}/`;
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
        return history.replace(`/${getPropertyRoute(props.type)}/${fields.id}`)
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
            available_for: form.available_for.value,
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

        let postUrl = `${API_URL}/${getPropertyRoute(props.type)}/${fields.id}/?format=json`;
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
        updateSelectionFields({
            field: target.name,
            value: target.values
        });
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
        <div class="custom-container mt-2 mt-sm-3">
            <form class="property-form text-secondary  px-3 px-sm-4" onSubmit={updateProperty}>
                <div class="row">
                    <div class="col-12 col-md-6">

                            <div class="row p-0 m-0 my-0 my-lg-1">
                                <label class="form-check-label col-12 p-0 m-0">Property type</label>
                                <div class="col-12 p-0 m-0 my-1">
                                    <select disabled class="custom-select" data-field="type" name="type">
                                        <option value="" disabled selected>{fields.type}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-2 my-lg-1">
                                <label class="form-check-label col-12 p-0 m-0">Available for</label>
                                <div class="col-12 p-0 m-0 my-1">
                                    <select class="custom-select" data-field="available_for" name="available_for" value={fields.available_for} onChange={updateValue} required>
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
                                            <input type="number" data-field="price" name="price" value={fields.price} onChange={updateValue}
                                                class="form-control" placeholder="Price" required/>
                                        </div>
                                        <div class="col-4 pl-1">
                                            <select class="custom-select" data-field="currency" name="currency" value={fields.currency} onChange={updateValue} required>
                                                <option value="" disabled selected>Currency</option>
                                                {currencies.map((currency)=><option  value={currency}>{currency}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <label class="form-check-label col-12 p-0 m-0">Location</label>
                                <div class="col-12 p-0 m-0 my-1">
                                    <select class="custom-select" data-field="location.country" name="country" value={fields.location.country} onChange={updateValue}>
                                        <option value="" disabled selected>Country</option>
                                        {countries.map((country)=><option value={country}>{country}</option>)}
                                    </select>
                                </div>
                                <div class="col-12 p-0 m-0 my-1">
                                    <div class="row">
                                        <div class="col pr-1">
                                            <input type="text" data-field="location.region" name="region" value={fields.location.region} onChange={updateValue}
                                            class="form-control" placeholder="Region" />
                                        </div>
                                        <div class="col pl-1">
                                            <input type="text" data-field="location.distric" name="distric" value={fields.location.distric} onChange={updateValue}
                                            class="form-control" placeholder="Distric" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 p-0 m-0 my-1">
                                    <div class="row">
                                        <div class="col pr-1">
                                            <input type="text" data-field="location.street1" name="street1" value={fields.location.street1} onChange={updateValue}
                                            class="form-control" placeholder="Street1" />
                                        </div>
                                        <div class="col pl-1">
                                            <input type="text" data-field="location.street2" name="street2" value={fields.location.street2} onChange={updateValue}
                                            class="form-control" placeholder="Street2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-3 my-lg-3">
                                <label class="form-check-label col-12 p-0 m-0">Amenities</label>
                                <div class="col-12 p-0 m-0">
                                    <Select className="custom-select" name="amenities" options={props.options.amenities} onChange={updateSelection}
                                     value={fields.amenities} optionName={optionName} optionValue={optionValue} placeholder="Select Amenity"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-3 my-lg-3">
                                <label class="form-check-label col-12 p-0 m-0">Services</label>
                                <div class="col-12 p-0 m-0">
                                    <Select className="custom-select" name="services" options={props.options.services} onChange={updateSelection}
                                     value={fields.services} optionName={optionName} optionValue={optionValue} placeholder="Select Service"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-3 my-lg-3">
                                <label class="form-check-label col-12 p-0 m-0">Potentials</label>
                                <div class="col-12 p-0 m-0">
                                    <Select className="custom-select" name="potentials" options={props.options.potentials} onChange={updateSelection}
                                      value={fields.potentials} optionName={optionName} optionValue={optionValue} placeholder="Select Potential"/>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <FeaturesInput label="Add Other Features" onChange={updateFeatures}
                                 onDelete={markToDelete} value={fields.other_features}/>
                            </div>

                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-check-label col-12 p-0 m-0 my-1">Main Picture</label>
                        <ImageUploader name="main_picture" src={fields.pictures.filter(img=>img.is_main)}
                            onChange={updateMainImage} onDelete={markImgToDelete}/>
                        <hr class="line p-0 m-0 my-2"/>

                        <label class="form-check-label col-12 p-0 m-0 my-1">Other Pictures</label>
                        <MultipleImageUploader name="other_pictures" src={fields.pictures.filter(img=>!img.is_main)}
                            onChange={updateOtherImages} onDelete={markImgToDelete}/>
                        <hr class="line p-0 m-0 my-2"/>

                        <div class="row p-0 m-0 my-4">
                            <label class="form-check-label col-12 p-0 m-0">Contact</label>
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

                <div class="row p-0 m-0 justify-content-center mt-4">
                    <button type="submit" class="col-12 col-sm-6 btn btn-info">Save</button>
                </div>

            </form>
        </div>
    )
}

function PropertyFetcher(props){
    let fetchProperty = () => {
        return fetch(`${API_URL}/${getPropertyRoute(props.type)}/${props.id}/`)
        .then(res => res.json())
    }

    let [amenities, setAmenities] = useState([]);
    let [services, setServices] = useState([]);
    let [potentials, setPotentials] = useState([]);

    let fetchOptions = () => {
        fetch(`${API_URL}/amenities/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setAmenities(results.results))
        .catch(error => console.log(error))

        fetch(`${API_URL}/services/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setServices(results.results))
        .catch(error => console.log(error))

        fetch(`${API_URL}/potentials/?query={id,name}&format=json`)
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
        <LocalFetcher 
         action={fetchProperty}
         placeholder={<Loader/>} 
         error={<PageError/>}>
             {property => {
                return <EditProperty property={property} options={options} {...props}/>
             }}
         </LocalFetcher>
    );
}

export { PropertyFetcher as EditProperty }
