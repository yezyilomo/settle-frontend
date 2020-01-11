import React from 'react';


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
            <option value={optionValue(option)} data-name={optionName(option)} >
                {optionName(option)}
            </option>
        );
    };


    let handleSelection = (e) => {
        let selectedOption = e.target.options[e.target.selectedIndex];
        let selectedValue = selectedOption.value;
        let selectedName = selectedOption.getAttribute('data-name');
        props.onSelect(selectedValue, selectedName);

        // Reset Placeholder
        e.target.value = "";
    }
    
    return (
        <>
            <select class={props.className} onChange={handleSelection}>
                {placeholder()}
                {props.options.map(options)}
            </select>
        </>
    );
}

export { SelectMultiValue }
