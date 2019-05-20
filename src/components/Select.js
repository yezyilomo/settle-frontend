import React, { useState } from 'react';
import './Select.css';
import { } from 'react-router-dom';
import { Block, SelectMultiValue } from './';


function Select(props) {
    let values = props.values||[]
    let [options, setOptions] = useState(props.options);
    let [selected, setSelected] = useState(values);

    let optionValue = props.optionValue;
    let optionName = props.optionName;
    let placeholder = props.placeholder;

    let addToSelected = (selectedValue) => {
        let temp = [...options];
        let index = temp.indexOf(selectedValue);
        if (index > -1) {
            temp.splice(index, 1);
            if(!props.duplicates){
                setOptions([...temp]);
            }
            setSelected([...selected, selectedValue]);
        }
    }

    let handleBadgeClick = (event) => {
        let optionToRemove = event.target.id;
        let temp = [...selected];
        let index = temp.indexOf(optionToRemove);
        if (index > -1) {
            temp.splice(index, 1);
            setSelected([...temp]);
            if(!props.duplicates){
                setOptions([...options, optionToRemove]);
            }
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
                            <span class="badge-body">{shorten(val, 17)}</span>&nbsp;
                            <span id={val} class="fa fa-times badge-close"
                                onClick={handleBadgeClick}>
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
            </div>
        </Block>
    );
}

export {Select}
