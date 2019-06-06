import React, { } from 'react';
import {setGlobal, useGlobal} from 'reactn';
import { Block } from './';
import './FeaturesInput.css';

setGlobal({
    FeaturesInput: []
})

function FeatureInput(props) {
    let [features, setFeatures] = useGlobal("FeaturesInput")
    let deleteFeature = (event) => {
        let newFeatures = features.filter(feature => feature !== props.feature)
        setFeatures(newFeatures)
    }

    let updateValue = (event) => {
        let value = event.target.value;
        props.feature.value = value
        setFeatures(features)
    }

    let updateName = (event) => {
        let name = event.target.value;
        props.feature.name = name
        setFeatures(features)
    }

    return (
            <div class="col-12 my-2">
                <div class="row">
                    <div class="col-5 px-2">
                        <input type="text" name="name" class="form-control" value={props.feature.name} placeholder="Name" onChange={updateName} />
                    </div>
                    <div class="col-7 px-2">
                        <div class="row">
                            <input type="text" name="value" class="form-control col-10 ml-1" value={props.feature.value} placeholder="Value" onChange={updateValue} />
                            <span class="fa fa-trash mt-2 ml-1 ml-lg-3 remove-feature" onClick={deleteFeature} />
                        </div>
                    </div>
                </div>
            </div>
    );
}

function FeaturesInput(props) {
    let [features, setFeatures] = useGlobal("FeaturesInput")

    let addFeature = (event) => {
        setFeatures([{name: "", value: ""}, ...features]);
    }

    return (
        <Block>
            <label class="form-check-label col-12 px-2">
                {props.label}
                <span class="fa fa-plus add-feature" onClick={addFeature} />
            </label>
            {features.map(feature =>
                <FeatureInput feature={feature} />
            )}
        </Block>
    );
}

export { FeaturesInput }
