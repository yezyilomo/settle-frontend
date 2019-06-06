import React, { } from 'react';
import { Block } from './';


function SelectMultiValue(props) {
    let optionValue = (option) => {
        if (props.optionValue) {
            return props.optionValue(option);
        }
        return option
    }

    let optionName = (option) => {
        if (props.optionName) {
            return props.optionName(option);
        }
        return option;
    }

    let placeholder = () => {
        if (props.placeholder !== undefined) {
            return <option value="" disabled selected>{props.placeholder}</option>
        }
        return null;
    }

    let options = (option) => {
        return (
            <option value={optionValue(option)} data-name={optionName(option)} onClick={handleSelect}>
                {optionName(option)}
            </option>
        );
    };

    let handleSelect = (event) => {
        let selectedValue = event.target.value;
        let selectedName = event.target.getAttribute('data-name');
        props.onSelect(selectedValue, selectedName);
    };

    let resetPlaceholder = (e) => {
        e.target.value = "";
    }
    return (
        <Block>
            <select class={props.class} onChange={resetPlaceholder}>
                {placeholder()}
                {props.options.map(options)}
            </select>
        </Block>
    );
}

export { SelectMultiValue }
