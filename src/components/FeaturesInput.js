import React, { } from 'react';
import { } from 'reactn';
import { Block } from './';
import './FeaturesInput.css';
import { useLocalState } from '../hooks';

function FeaturesInput(props) {
    let initialState = props.value||[];
    let [features, updateFeatures] = useLocalState(initialState);

    let addFeature = (event) => {
        updateFeatures({
            action: "push",
            value: {id: null, name: "", value: ""}
        });
        if(props.onChange !== undefined){
            props.onChange(features)
        }
    }

    let deleteFeature = (featureToDelete) => {
        updateFeatures({
            action: "filter",
            value: (feature) => feature !== featureToDelete
        })
        if(props.onChange !== undefined){
            props.onChange(features)
        }
        if(props.onDelete !== undefined){
            props.onDelete(featureToDelete)
        }
    }


    let updateValue = (event, feature) => {
        let value = event.target.value;
        feature.value = value;
        updateFeatures({
            value: features
        });
        if(props.onChange !== undefined){
            props.onChange(features)
        }
    }

    let updateName = (event, feature) => {
        let name = event.target.value;
        feature.name = name;
        updateFeatures({
            value: features
        });
        if(props.onChange !== undefined){
            props.onChange(features)
        }
    }

    return (
        <Block>
            <label class="form-check-label col-12 px-2">
                {props.label}
                <span class="fa fa-plus add-feature" onClick={addFeature} />
            </label>
            {features.map(feature =>
                <div class="col-12 my-2">
                    <div class="row">
                        <div class="col-5 px-2">
                            <input type="text" name="name" class="form-control" value={feature.name} placeholder="Name" onChange={(e)=>updateName(e, feature)} />
                        </div>
                        <div class="col-7 px-2">
                            <div class="row">
                                <input type="text" name="value" class="form-control col-10 ml-1" value={feature.value} placeholder="Value" onChange={(e)=>updateValue(e,feature)} />
                                <span class="fa fa-trash mt-2 ml-1 ml-lg-3 remove-feature" onClick={(e)=>deleteFeature(feature)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Block>
    );
}

export { FeaturesInput }
