import React, { } from 'react';
import { Block } from './';
import './FeaturesInput.css';
import { useLocalState } from 'simple-react-state';

function FeaturesInput(props) {
    let initialState = props.value||[];
    let [features, updateFeatures] = useLocalState(initialState);

    let addFeature = (event) => {
        updateFeatures({
            type: "PUSH",
            value: {id: null, name: "", value: ""}
        });
        if(props.onChange !== undefined){
            props.onChange(features)
        }
    }

    let deleteFeature = (featureToDelete) => {
        updateFeatures({
            type: "FILTER",
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
            <label class="form-check-label col-12 p-0 m-0 mb-1">
                {props.label}
                <span class="fa fa-plus add-feature ml-3" onClick={addFeature} />
            </label>
            {features.map(feature =>
                <div class="col-12 my-2">
                    <div class="row">
                        <div class="col-5 p-0 m-0">
                            <input type="text" name="name" class="form-control" value={feature.name} placeholder="Name" onChange={(e)=>updateName(e, feature)} />
                        </div>
                        <div class="col-6 p-0 m-0 pl-2">
                            <input type="text" name="value" class="form-control" value={feature.value} placeholder="Value" onChange={(e)=>updateValue(e,feature)} />
                        </div>
                        <div class="col-1 p-0 m-0 text-right">
                            <span class="fa fa-trash remove-feature" onClick={(e)=>deleteFeature(feature)} />
                        </div>
                    </div>
                </div>
            )}
        </Block>
    );
}

export { FeaturesInput }
