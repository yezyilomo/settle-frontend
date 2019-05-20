import React, { useState } from 'react';
import { Block } from './';
import './FeatureForm.css';


function Feature(props) {
    let [isActive, setIsActive] = useState(true);
    let deleteElement = (event) => {
        setIsActive(false);
    }
    return (
        isActive ?
            <div class="col-12 my-2" id={`feature-form-${props.featureID}`}>
                <div class="row">
                    <div class="col-5 px-2">
                        <input type="text" class="form-control" placeholder="Name" />
                    </div>
                    <div class="col-7 px-2">
                        <div class="row">
                            <input type="text" class="form-control col-10 ml-1" placeholder="Value" />
                            <span class="fa fa-trash mt-2 ml-1 ml-lg-3 remove-feature" onClick={deleteElement} />
                        </div>
                    </div>
                </div>
            </div> :
            null
    );
}

function FeatureForm(props) {
    let [features, setFeatures] = useState([]);

    let handleAddFeatureClick = (event) => {
        let count = features.length + 1;
        setFeatures([<Feature featureID={count} />, ...features]);
    }

    return (
        <Block>
            <label class="form-check-label col-12 px-2">
                {props.label}
                <span class="fa fa-plus add-feature" onClick={handleAddFeatureClick} />
            </label>
            {features}
        </Block>
    );
}

export { FeatureForm }
