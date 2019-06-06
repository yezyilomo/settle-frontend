import React, { useState } from 'react';
import './Select.css';
import { } from 'react-router-dom';
import { Block, SelectMultiValue } from './';


function Select(props) {
    let values = props.value||[]
    let [options, setOptions] = useState(props.options);
    let [selected, setSelected] = useState(values);

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
        let temp = [...options];

        let optionToAdd = find(temp, selectedValue, selectedName)
        let index = temp.indexOf(optionToAdd);
        if (index > -1) {
            temp.splice(index, 1);
            if(!props.duplicates){
                options = [...temp]
                setOptions(options);
            }
            selected = [...selected, optionToAdd]
            setSelected(selected);
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

    let removeFromSelected = (event) => {
        let selectedName = event.target.getAttribute('data-name');
        let selectedValue = event.target.getAttribute('data-value');
        let temp = [...selected];

        let optionToRemove =  find(temp, selectedValue, selectedName)
        let index = temp.indexOf(optionToRemove);
        if (index > -1) {
            temp.splice(index, 1);
            selected = [...temp]
            setSelected(selected);
            if(!props.duplicates){
                options = [...options, optionToRemove]
                setOptions(options);
            }
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
