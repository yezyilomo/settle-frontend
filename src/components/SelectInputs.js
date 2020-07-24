import React from 'react';
import variables from '../variables.scss';
import AsyncCreatableSelect from 'react-select/async-creatable';


const theme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary: variables.primaryColor,
        neutral30: 'rgb(238, 238, 238)',
        primary25: variables.transparentPrimaryColor
    },
})

const styles = {
    input: styles => ({
        ...styles,
        padding: '0 5px',
        margin: 0,
        height: 37
    }),
    control: (styles, state) => ({
        ...styles,
        backgroundColor: 'rgb(250, 250, 250)',
        border: state.isFocused ? 'none' : 'solid 1px rgb(238, 238, 238)'
    }),
    valueContainer: (styles, state) => ({
        ...styles,
        padding: '0 3px',
        margin: 0
    })
}

function CustomAsyncCreatableSelect(props){
    return <AsyncCreatableSelect theme={theme} styles={styles} {...props}/>
}

export {
    CustomAsyncCreatableSelect as AsyncCreatableSelect
}