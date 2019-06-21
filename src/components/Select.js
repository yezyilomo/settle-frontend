import React, { useState } from 'react';
import './Select.css';
import { } from 'react-router-dom';
import { Block, SelectMultiValue } from './';
import { useLocalState } from '../hooks';


function Select(props) {
    let values = props.value||[]
    let [options, updateOptions] = useLocalState(props.options);
    let [selected, updateSelected] = useLocalState(values);

    let optionValue = props.optionValue || (val => val);
    let optionName = props.optionName || (val => val);
    let placeholder = props.placeholder;

    let find = (list, selectedValue, selectedName) => {
        return list.find(val => (
            optionValue(val) == selectedValue &&
            optionName(val) == selectedName
        ));
    }

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
        if(props.onChange){
            let target = {
                name: props.name,
                selected: selected,
                options: options
            }
            props.onChange(target)
        }
    }

    let removeFromSelected = (event) => {
        let selectedName = event.target.getAttribute('data-name');
        let selectedValue = event.target.getAttribute('data-value');

        let optionToRemove =  find(selected, selectedValue, selectedName)

        updateOptions({
            action: "push",
            value: optionToRemove
        })

        if(!props.duplicates){
            updateSelected({
                action: "remove",
                value: optionToRemove
            })
        }

        if(props.onChange){
            let target = {
                name: props.name,
                selected: selected,
                options: options
            }
            props.onChange(target)
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
