import React from 'react';

import { BASE_API_URL } from '../';
import { useGlobalState } from 'state-pool';


function SaveButton(props){
    const [user,] = useGlobalState("user");
    const [, updateProperty] = useGlobalState(`property/${props.property.id}`, { default: null });
    const postUrl = `${BASE_API_URL}/users/${user.id}/`;
    const headers = {
        'Authorization': `Token ${user.auth_token}`,
        'Content-Type': 'application/json'
    }

    const updateIsSaved = (status, value) => {
        if (status === 200) {
            updateProperty(prop => {prop.data.is_my_favourite = value});
        }
    }

    const addToSaved = (e) => {
        const body = JSON.stringify({"fav_properties": {"add": [props.property.id]}});
        fetch(postUrl, { body: body, method: 'PATCH', headers: headers })
        .then(res => res.status)
        .then(status => updateIsSaved(status, true))
    }

    const removeFromSaved = (e) => {
        const body = JSON.stringify({"fav_properties": {"remove": [props.property.id]}});
        fetch(postUrl, { body: body, method: 'PATCH', headers: headers })
        .then(res => res.status)
        .then(status => updateIsSaved(status, false))
    }

    if (props.property.is_my_favourite){
        return <div class="save-button" onClick={removeFromSaved}><span class='icon icon-heart-solid'></span></div> 
    }
    return <div class="save-button" onClick={addToSaved}><span class='icon icon-heart'></span></div>
}


export {SaveButton};