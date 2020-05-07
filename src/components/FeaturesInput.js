import React, { } from 'react';
import './FeaturesInput.css';
import { useLocalState } from 'state-pool';

function FeaturesInput(props) {
    let initialState = props.value||[];
    let [features, updateFeatures] = useLocalState(initialState);

    let addFeature = (event) => {
        updateFeatures(features => {
            features.push({id: null, name: "", value: ""});
        });
        if(props.onChange !== undefined){
            props.onChange(features)
        }
    }

    let deleteFeature = (featureToDelete) => {
        updateFeatures(draftFeatures => {
            return features.filter((feature) => feature !== featureToDelete);
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
        updateFeatures(draftFeatures => {
            let index = features.indexOf(feature);
            draftFeatures[index].value = value;
        });
        if(props.onChange !== undefined){
            props.onChange(features);
        }
    }

    let updateName = (event, feature) => {
        let name = event.target.value;
        updateFeatures(draftFeatures => {
            let index = features.indexOf(feature);
            draftFeatures[index].name = name;
        });
        if(props.onChange !== undefined){
            props.onChange(features)
        }
    }

    return (
        <>
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
        </>
    );
}

export { FeaturesInput }
