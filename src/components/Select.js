import React, { useEffect } from 'react';
import './Select.css';
import { } from 'react-router-dom';
import { Block, SelectMultiValue } from './';
import { useLocalState } from '../hooks';


function Select(props) {
    let values = props.value||[];
    let allOptions = props.options||[];
    let optionValue = props.optionValue || (val => val);
    let optionName = props.optionName || (val => val);
    let placeholder = props.placeholder;


    let find = (list, selectedValue, selectedName) => {
        return list.find(val => (
            optionValue(val) == selectedValue &&
            optionName(val) == selectedName
        ));
    }

    let skipSelected = (item) => {
        return !find(values, optionValue(item), optionName(item));
    }

    let getOptions = () => {
        if(!props.duplicates){
            return allOptions.filter(skipSelected);
        }
        return allOptions;
    }

    let initialUpdates = {
        "add": [],
        "remove": []
    };
    let [updates, updateUpdates] = useLocalState(initialUpdates);
    let [originalValues, ] = useLocalState([...values]);
    let [options, updateOptions] = useLocalState(getOptions());
    let [selected, updateSelected] = useLocalState(values);

    // Trigger sythentic onChange event when updates is changed
    useEffect(() => {
        if(props.onChange){
            let value = {
                "add": updates.add.map(val => val.id),
                "remove": updates.remove.map(val => val.id)
            }
            let target = {
                name: props.name,
                values: value
            }
            props.onChange(target)
        }
    }, [updates]);

    let addToSelected = (selectedValue, selectedName) => {

        let optionToAdd = find(options, selectedValue, selectedName)
        if(!props.duplicates){
            updateOptions({
                action: "remove",
                value: optionToAdd
            })
        }
        updateSelected({
            action: "push",
            value: optionToAdd
        })

        let toAdd = find(originalValues, selectedValue, selectedName);
        if (toAdd === undefined){
            updateUpdates({
                field: "add",
                action: "push",
                value: optionToAdd
            });
        }
        let toClear = find(updates.remove, selectedValue, selectedName);
        if (toClear !== undefined){
            updateUpdates({
                field: "remove",
                action: "remove",
                value: toClear
            });
        }
    }

    let removeFromSelected = (event) => {
        let selectedName = event.target.getAttribute('data-name');
        let selectedValue = event.target.getAttribute('data-value');

        let optionToRemove =  find(selected, selectedValue, selectedName);

        updateOptions({
            action: "push",
            value: optionToRemove
        })

        let toRemove = find(originalValues, selectedValue, selectedName);
        if (toRemove !== undefined){
            updateUpdates({
                field: "remove",
                action: "push",
                value: toRemove
            });
        }
        let toClear = find(updates.add, selectedValue, selectedName);
        if (toClear !== undefined){
            updateUpdates({
                field: "add",
                action: "remove",
                value: toClear
            });
        }

        if(!props.duplicates){
            updateSelected({
                action: "remove",
                value: optionToRemove
            })
        }
    }

    let shorten = (str, to) => {
        let long = str.slice(to);
        if(long){
            return str.slice(0, to) + "...";
        }
        return str;
    }

    return (
        <Block>
            <div>
                {selected.map((val) => {
                    return (
                        <Block>
                        <span class="badge badge-secondary mb-1 mr-1">
                            <span class="badge-body">{shorten(optionName(val), 17)}</span>&nbsp;
                            <span data-value={optionValue(val)} data-name={optionName(val)} class="fa fa-times badge-close"
                                onClick={removeFromSelected}>
                            </span>
                        </span>
                        </Block>
                    );
                })}
            </div>
            <div>
                <SelectMultiValue
                    class="custom-select"
                    options={options}
                    onSelect={addToSelected}
                    optionValue={optionValue}
                    optionName={optionName}
                    placeholder={placeholder}
                />
                <input type="hidden" value={JSON.stringify(selected.map(val=>optionValue(val)))} name={props.name} />
            </div>
        </Block>
    );
}

export {Select}
