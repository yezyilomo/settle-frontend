import React, { useState, useEffect } from 'react';
import './UploadProperty.scss';
import { useHistory } from 'react-router';
import { Button, Spinner } from 'react-bootstrap';
import { useGlobalState, useLocalState } from 'state-pool';
import {
    FeaturesInput, ImageUploader, MultipleImageUploader,
    DataFetcher, GlowBlockLoader, Map
} from './';
import { BASE_API_URL } from '../';
import { getPropertyRoute, capitalizeFirst } from '../utils';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AsyncCreatableSelect } from './'
import { queryCache } from 'react-query';
import { useScrollTop } from '../hooks';


let initialFieldsData = {
    amenities: [],
    services: [],
    potentials: [],
    main_picture: [],
    other_pictures: [],
    other_features: [],
    contact: {},
    otherInputs: {},
    location: {
        address: "",
        point: "POINT (0 0)"
    }
}

function UploadProperty(props){
    useScrollTop();
    const history = useHistory();
    const [user, ] = useGlobalState("user");
    const [fields, updateFields] = useLocalState(initialFieldsData);
    const [isLoading, setLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    useEffect(()=>{
        updateFields(fields => {
            // Suggest user contacts
            fields["contact"] = {
                email: user.email,
                phone: user.phone,
                full_name: user.full_name
            }
        })
    }, []);

    const currencies = ["TZS", "USD", "KTSH"];
    const terms = ["Week", "Month", "Year"];

    let postImages = (propertyID, pictures) => {
        // Post Images recusively until they are all done
        if(pictures.length === 0){
            // Invalidate user properties
            queryCache.invalidateQueries(`myProperties.properties`);
            queryCache.invalidateQueries(`myProperties.${getPropertyRoute(props.type)}`);
            // Redirect to created property
            return history.push(`/${getPropertyRoute(props.type)}/${propertyID}`);
        }
        let img = pictures.pop();
        let postData = new FormData();
        postData.append("property", propertyID)
        postData.append("is_main", Number(img.is_main))
        postData.append("tool_tip", img.tool_tip)
        postData.append("src", img.src, img.src.name)

        let postUrl = `${BASE_API_URL}/property-pictures/`;
        let headers = {
            'Authorization': `Token ${user.auth_token}`
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

        let form = e.target;
        let formData = {
            available_for: form.available_for.value,
            price: form.price.value,
            price_rate_unit: form.available_for.value === 'rent'? fields.price_rate_unit: null,
            currency: form.currency.value,
            payment_terms: form.payment_terms.value,
            location: {
                address: fields.location.address,
                point: fields.location.point
            },
            descriptions: fields.descriptions,
            contact: {
                name: fields.contact.full_name,
                email: fields.contact.email,
                phone: fields.contact.phone
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
            },
            ...fields.otherInputs
        }

        let postUrl = `${BASE_API_URL}/${getPropertyRoute(props.type)}/`;
        let headers = {
            'Authorization': `Token ${user.auth_token}`,
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
        updateFields(fields => {
            fields[e.target.name] = e.target.value;
        })
    }

    let updateLocation = (location) => {
        updateFields(fields => {
            fields.location.address = location.address
            fields.location.point = `POINT (${location.point.lng} ${location.point.lat})`
        })
    }

    let updateContact = (e) => {
        updateFields(fields => {
            fields.contact[e.target.name] = e.target.value;
        })
    }

    let updateOtherImages = (value) => {
        updateFields(fields => {
            fields['other_pictures'] = value;
        })
    }

    let updateMainImage = (value) => {
        updateFields(fields => {
            fields['main_picture'] = value;
        })
    }

    let updateFeatures = (features) => {
        updateFields(fields => {
            fields['other_features'] = features;
        })
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
            const URL = `${BASE_API_URL}/${selection}/?query={id,name}&format=json&name__icontains=${inputValue}`
            return getOptions(URL)
        }
        return getSelection;
    }

    let update = (selection) => {
        let updateSelection = (value) => {
            if(!value){
                value = []
            }
            updateFields(fields => {
                fields[selection] = value
            })
        }
        return updateSelection;
    }

    let fetchPropertiesAvailability = () => {
        return fetch(`${BASE_API_URL}/properties-availability/`)
            .then(res => res.json())
    }


    let child;
    if (props.children === undefined) {
        child = {}
    }
    else {
        child = props.children(props.property);
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
                                <DataFetcher
                                    selection={`properties-availability`}
                                    action={fetchPropertiesAvailability}
                                    placeholder={<GlowBlockLoader />}
                                    error={`Couldn't load property availability options.`}>
                                    {response => {
                                        const available_for_options = response.data[props.type];
                                        return available_for_options.map(
                                            (available_for) => <option value={available_for}>
                                                {capitalizeFirst(available_for)}
                                            </option>
                                        )
                                    }}
                                </DataFetcher>
                            </select>
                        </div>
                    </div>

                    <div class="row p-0 m-0 my-4">
                        <label class="form-check-label col-12 p-0 m-0">Pricing</label>
                        <div class="col-12 p-0 m-0 my-1">
                            {fields.available_for === "sale" ?
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
                                </div> :

                                <div class="row">
                                    <div class="col-6 pr-1">
                                        <input type="number" data-field="price" name="price" value={fields.price} onChange={updateValue}
                                            class="form-control" placeholder="Price" required />
                                    </div>
                                    <div class="col-3 px-0">
                                        <select class="custom-select" data-field="currency" name="currency" value={fields.currency} onChange={updateValue} required>
                                            <option value="" disabled selected>Currency</option>
                                            {currencies.map((currency) => <option value={currency}>{currency}</option>)}
                                        </select>
                                    </div>
                                    <div class="col-3 pl-1">
                                        <select class="custom-select" data-field="price_rate_unit" name="price_rate_unit" value={fields.price_rate_unit} onChange={updateValue} required>
                                            <option value="" disabled selected>/Term</option>
                                            {terms.map((term) => <option value={term}>/ {term}</option>)}
                                        </select>
                                    </div>
                                </div>
                            }

                            <div class="row p-0 m-0 mt-2">
                                <label class="form-check-label col-12 p-0 m-0">Payment Terms</label>
                                <div class="col-12 p-0 m-0">
                                    <textarea type="text" data-field="payment_terms" name="payment_terms"
                                        value={fields.payment_terms} onChange={updateValue} rows="2"
                                        class="form-control" placeholder="Example: 6 months in advance." />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="my-3">
                        <label class="form-check-label col-12 p-0 m-0">Location</label>
                        <Map editable search markerDraggable onChangeLocation={updateLocation}
                            location={{
                                address: fields.location.address,
                                point: { lng: fields.location.longitude, lat: fields.location.latitude }
                            }} />
                    </div>

                    {child.otherInputs?
                        child.otherInputs(fields, updateFields): null
                    }

                    <div class="my-4">
                        <label class="form-check-label col-12 p-0 m-0">Amenities</label>
                        <div class="row mt-1 mb-3">
                            <div class="col-12">
                            <AsyncCreatableSelect isMulti cacheOptions defaultOptions 
                            loadOptions={get('amenities')} onChange={update('amenities')}/>
                            </div>
                        </div>

                        <label class="form-check-label col-12 p-0 m-0">Nearby Services</label>
                        <div class="row mt-1 mb-3">
                            <div class="col-12">
                            <AsyncCreatableSelect isMulti cacheOptions defaultOptions 
                            loadOptions={get('services')} onChange={update('services')}/>
                            </div>
                        </div>

                        <label class="form-check-label col-12 p-0 m-0">Potential For</label>
                        <div class="row mt-1 mb-3">
                            <div class="col-12">
                            <AsyncCreatableSelect isMulti cacheOptions defaultOptions 
                            loadOptions={get('potentials')} onChange={update('potentials')}/>
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
                                updateFields(fields => {
                                    fields["descriptions"] = data;
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
                            <input type="text" name="phone" value={fields.contact.phone} onChange={updateContact}
                                class="form-control" placeholder="Phone Number" required />
                        </div>
                        <div class="col-12 my-1">
                            <div class="row">
                                <div class="col m-0 p-0 pr-1">
                                    <input type="text" name="full_name" value={fields.contact.full_name} onChange={updateContact}
                                        class="form-control" placeholder="Name" required />
                                </div>
                                <div class="col m-0 p-0 pl-1">
                                    <input type="text" name="email" value={fields.contact.email} onChange={updateContact}
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
                <Button className="col-12 col-md-6" variant="primary" disabled={isLoading} type="submit">
                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
                </Button>
            </div>
        </form>
    )
}


function UploadRoom(props) {
    return (
        <UploadProperty {...props}>
            {property => ({})}
        </UploadProperty>
    );
}

function UploadHouse(props) {
    return (
        <UploadProperty {...props}>
            {property => ({})}
        </UploadProperty>
    );
}

function UploadApartment(props) {
    return (
        <UploadProperty {...props}>
            {property => ({})}
        </UploadProperty>
    );
}

function UploadHostel(props) {
    return (
        <UploadProperty {...props}>
            {property => ({})}
        </UploadProperty>
    );
}

function UploadOffice(props) {
    return (
        <UploadProperty {...props}>
            {property => ({})}
        </UploadProperty>
    );
}

function UploadLand(props) {
    return (
        <UploadProperty {...props}>
            {property => ({
                otherInputs: function (fields, updateFields) {
                    let updateValue = (e) => {
                        updateFields(fields => {
                            let field = e.target.getAttribute("data-field");
                            let value = e.target.value;
                            fields[field] = value;
                            fields.otherInputs[field] = value;
                        })
                    }

                    let isRegistered = () => {
                        if(fields.is_registered === 'Y'){
                            return true;
                        }
                        return false;
                    }

                    let updateIsRegistered = (e) => {
                        let value = e.target.checked;
                        if (value) {
                            updateFields(fields => {
                                fields['is_registered'] = 'Y'
                                fields.otherInputs['is_registered'] = 'Y'
                            })
                        }
                        else {
                            updateFields(fields => {
                                fields['is_registered'] = 'N'
                                fields.otherInputs['is_registered'] = 'N'
                            })
                        }
                        
                    }

                    return (
                        <>
                            <div class="row p-0 m-0 my-2 my-lg-2">
                                <div class="col m-0 p-0 pr-1">
                                    <label class="form-check-label col-12 p-0 m-0">Length</label>
                                    <div class="col-12 p-0 m-0 my-1">
                                        <input type="text" data-field="length" name="length" value={fields.length} onChange={updateValue}
                                            class="form-control" placeholder="E.g 120 m" />
                                    </div>
                                </div>

                                <div class="col m-0 p-0 pl-1">
                                    <label class="form-check-label col-12 p-0 m-0">Width</label>
                                    <div class="col-12 p-0 m-0 my-1">
                                        <input type="text" data-field="width" name="width" value={fields.width} onChange={updateValue}
                                            class="form-control" placeholder="E.g 45 m" />
                                    </div>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-2 my-lg-1">
                                <label class="form-check-label col-12 p-0 m-0">Area</label>
                                <div class="col-12 p-0 m-0 my-1">
                                    <input type="text" data-field="area" name="area" value={fields.area} onChange={updateValue}
                                        class="form-control" placeholder="E.g 500 square meter" />
                                </div>
                            </div>
                            <div class="row p-0 m-0 my-2 my-lg-2">
                                <label class="form-check-label mt-2" for="is-registered">Is registered</label>
                                <input type="checkbox" class="form-check-input p-0 m-0" id="is-registered" checked={isRegistered()} onChange={updateIsRegistered} />
                            </div>
                        </>
                    );
                }
            })}
        </UploadProperty>
    );
}

function UploadFrame(props) {
    return (
        <UploadProperty {...props}>
            {property => ({})}
        </UploadProperty>
    );
}

export {
    UploadProperty, UploadRoom, UploadHouse, UploadApartment,
    UploadHostel, UploadOffice, UploadLand, UploadFrame
}
