import React, { } from 'react';
import { Block } from './';


function SelectMultiValue(props){
    let optionValue = (option) => {
        if(props.optionValue){
            return props.optionValue(option);
        }
        else{
            return option
        }
    }

    let optionName = (option) => {
        if(props.optionName){
            return props.optionName(option);
        }
        else{
            return option;
        }
    }

    let options = (option) => {
        return (
            <option value={optionValue(option)}>{optionName(option)}</option>
        );
    };

    let handleValueChange = (event) => {
        props.onSelect(event.target.value);
        event.target.value = "";
    };
    return (
        <Block>
            <select class={props.class} name="selected_value" onChange={handleValueChange}>
                {
                    props.placeholder !== undefined?
                    <option value="" disabled selected>{props.placeholder}</option>:
                    null
                }
                {props.options.map(options)}
            </select>
        </Block>
    );
}

export {SelectMultiValue}
