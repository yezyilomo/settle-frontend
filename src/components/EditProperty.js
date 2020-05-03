import React, { useState } from 'react';
import './EditProperty.scss';
import { useHistory } from 'react-router';
import { Button, Spinner } from 'react-bootstrap';
import {
    FeaturesInput, GlobalFetcher, GlowPageLoader,
    ImageUploader, MultipleImageUploader, PageError
} from './';
import { API_URL } from '../';
import { useLocalState, useGlobalState } from 'simple-react-state';
import { getPropertyRoute } from '../utils';
import { useRestoreScrollState } from '../hooks';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AsyncCreatableSelect from 'react-select/async-creatable';


function EditProperty(props) {
    useRestoreScrollState();
    let history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [editError, setEditError] = useState('');

    let [fields, updateFields] = useLocalState(props.property);
    let [, setProperty] = useGlobalState(`property/${fields.id}`);
    let [user,] = useGlobalState("user");

    let [featuresToDelete,] = useState([]);
    let [imgsToDelete,] = useState([]);
    let [mainImg, setMainImg] = useState([]);
    let [otherImgs, setOtherImgs] = useState([]);

    let formatOptions = (options) => {
        return options.map(option => {return {value: option.id, label: option.name}})
    }

    let [selectionFields, updateSelectionFields] = useLocalState({
        amenities: formatOptions(props.property.amenities),
        services: formatOptions(props.property.services),
        potentials: formatOptions(props.property.potentials)
    })

    let currencies = ["TZS", "USD"];
    let countries = ["Tanzania", "Kenya", "Uganda", "Zambia", "Zanzibar"];

    let createImage = (img) => {
        let postData = new FormData();
        postData.append("property", fields.id)
        postData.append("is_main", Number(img.is_main))
        postData.append("tool_tip", img.tool_tip)
        postData.append("src", img.src, img.src.name)

        let postUrl = `${API_URL}/property-pictures/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`
        }
        return fetch(postUrl, { method: 'POST', body: postData, headers: headers })
            .then(res => res.json().then(data => ({ status: res.status, data: data })))
            .then(obj => obj)
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
    }
    */

    let deleteImage = (imgID) => {
        let postUrl = `${API_URL}/property-pictures/${imgID}/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`
        }
        return fetch(postUrl, { method: 'DELETE', body: "", headers: headers })
    }

    let updateImages = async (prevResponse) => {
        let pictures = [...mainImg, ...otherImgs]
        for (let picture of pictures) {
            if (picture.id === null) {
                await createImage(picture);
            }
            else {
                //updateImage(picture);
            }
        }
        for (let pictureID of imgsToDelete) {
            await deleteImage(pictureID);
        }
    }

    let redirect = (response) => {
        setProperty({
            value: null
        })
        return history.replace(`/${getPropertyRoute(props.type)}/${fields.id}`)
    }

    let formatSelection = selection => {
        let newValue = selectionFields[selection];
        let oldValue = fields[selection];

        let toCreate = newValue.filter(option => option.__isNew__)
        .map(option => {return {name: option.label}})

        let newValueIDS = newValue.filter(option => !option.__isNew__)
        .map(option => option.value)

        let oldValueIDS = oldValue.map(option => option.id)

        let toAdd = newValueIDS.filter(id => !oldValueIDS.includes(id));
        let toDelete = oldValueIDS.filter(id => !newValueIDS.includes(id));
        
        let data = {
            "add": toAdd,
            "create": toCreate,
            "remove": toDelete
        };
        return data;
    }

    let updateProperty = (e) => {
        e.preventDefault();
        setEditError("");
        setLoading(true);
        let form = e.target

        let features = {
            create: [],
            remove: [],
            update: {}
        }

        for (let feature of fields.other_features) {
            if (featuresToDelete.indexOf(feature.id) !== -1) {
                //To delete
                continue
            }
            else if (feature.id === null) {
                let featureValues = { name: feature.name, value: feature.value }
                features.create.push(featureValues)
            }
            else {
                let featureValues = { name: feature.name, value: feature.value }
                features.update[`${feature.id}`] = featureValues
            }
        }
        features.remove = featuresToDelete

        let formData = {
            available_for: form.available_for.value,
            price: form.price.value,
            currency: form.currency.value,
            amenities: formatSelection("amenities"),
            services: formatSelection("services"),
            potentials: formatSelection("potentials"),
            descriptions: fields.descriptions,
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
        fetch(postUrl, { method: 'PUT', body: JSON.stringify(formData), headers: headers })
            .then(res => res.json().then(data => ({ status: res.status, data: data })))
            .then(obj => updateImages(obj))
            .then(obj => redirect(obj))
            .catch(error => {
                // Network error
                setEditError("No network connection, please try again!.");
            })
            .finally(() => {
                // Enable button
                setLoading(false);
            })
    }

    let updateValue = (e) => {
        updateFields({
            field: e.target.getAttribute("data-field"),
            value: e.target.value
        })
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
        if (feature.id !== null) {
            featuresToDelete.push(feature.id);
        }
    }

    let markImgToDelete = (img) => {
        if (img.id !== null) {
            imgsToDelete.push(img.id);
        }
    }

    let getOptions = (url) => {
        return fetch(url)
        .then(res => res.json())
        .then(results => results.results.map(
            amenity => {return {value: amenity.id, label: amenity.name}}
        ))
    }

    let get = (selection) => {
        let getSelection = inputValue => {
            const URL = `${API_URL}/${selection}/?query={id,name}&format=json&name__icontains=${inputValue}`
            return getOptions(URL)
        }
        return getSelection;
    }

    let update = (selection) => {
        let updateSelection = (value) => {
            if(!value){
                value = []
            }
            updateSelectionFields({
                field: selection,
                value: value
            })
        }
        return updateSelection;
    }


    return (
        <form class="property-form text-secondary px-3 px-sm-4 mt-2 mt-sm-3" onSubmit={updateProperty}>
            <div class="row mt-3">
                <div class="col-12 col-md-6">

                    <div class="row p-0 m-0 mb-lg-1">
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
                                        class="form-control" placeholder="Price" required />
                                </div>
                                <div class="col-4 pl-1">
                                    <select class="custom-select" data-field="currency" name="currency" value={fields.currency} onChange={updateValue} required>
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
                            <select class="custom-select" data-field="location.country" name="country" value={fields.location.country} onChange={updateValue}>
                                <option value="" disabled selected>Country</option>
                                {countries.map((country) => <option value={country}>{country}</option>)}
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

                    <div class="my-4">
                        <label class="form-check-label col-12 p-0 m-0">Amenities</label>
                        <div class="row mt-1 mb-3">
                            <div class="col-12">
                            <AsyncCreatableSelect className="react-select-container" isMulti cacheOptions
                            defaultOptions value={selectionFields.amenities}
                            loadOptions={get('amenities')} onChange={update('amenities')}/>
                            </div>
                        </div>

                        <label class="form-check-label col-12 p-0 m-0">Nearby Services</label>
                        <div class="row mt-1 mb-3">
                            <div class="col-12">
                            <AsyncCreatableSelect className="react-select-container" isMulti cacheOptions 
                            defaultOptions value={selectionFields.services}
                            loadOptions={get('services')} onChange={update('services')}/>
                            </div>
                        </div>

                        <label class="form-check-label col-12 p-0 m-0">Potential For</label>
                        <div class="row mt-1 mb-3">
                            <div class="col-12">
                            <AsyncCreatableSelect className="react-select-container" isMulti cacheOptions 
                            defaultOptions value={selectionFields.potentials}
                            loadOptions={get('potentials')} onChange={update('potentials')}/>
                            </div>
                        </div>
                    </div>

                    <div class="row p-0 m-0 my-4">
                        <FeaturesInput label="Add Other Features" onChange={updateFeatures}
                            onDelete={markToDelete} value={fields.other_features} />
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
                                updateFields({
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

                <div class="col-12 col-md-6 mt-4 mt-md-0">
                    <div class="prop-pics-card sticky-top m-0 mb-lg-1">
                        <label class="form-check-label col-12 p-0 m-0 mb-1">Main Picture</label>
                        <ImageUploader name="main_picture" src={fields.pictures.filter(img => img.is_main)}
                            onChange={updateMainImage} onDelete={markImgToDelete} />
                        <hr class="line p-0 m-0 my-3" />

                        <label class="form-check-label col-12 p-0 m-0 my-1">Other Pictures</label>
                        <MultipleImageUploader name="other_pictures" src={fields.pictures.filter(img => !img.is_main)}
                            onChange={updateOtherImages} onDelete={markImgToDelete} />
                    </div>
                </div>
            </div>

            <hr class="line p-0 m-0 my-3" />

            <div class="row p-0 m-0 justify-content-center py-2 mt-4">
                <div class="col-12 mb-2 text-center text-danger">
                    {editError}
                </div>
                <Button className="col-12 col-md-6" variant="primary" disabled={isLoading} type="submit">
                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Save'}
                </Button>
            </div>
        </form>
    )
}

function PropertyFetcher(props){
    let fetchProperty = () => {
        return fetch(`${API_URL}/${getPropertyRoute(props.type)}/${props.id}/`)
        .then(res => res.json())
    }

    return (
        <GlobalFetcher 
         selection={`property/${props.id}`}
         action={fetchProperty}
         placeholder={<GlowPageLoader/>} 
         error={<PageError/>}>
             {property => {
                return <EditProperty property={property} {...props}/>
             }}
         </GlobalFetcher>
    );
}

export { PropertyFetcher as EditProperty }
