import React, { useState } from 'react';

import { BASE_API_URL } from '../';
import { useMutation, queryCache } from 'react-query';
import { useGlobalState } from 'state-pool';


function SaveButton(props) {
    const [user,] = useGlobalState("user");
    const [isSaved, setIsSaved] = useState(props.property.is_my_favourite);
    const postUrl = `${BASE_API_URL}/users/${user.id}/`;
    const headers = {
        'Authorization': `Token ${user.auth_token}`,
        'Content-Type': 'application/json'
    }

    const responses = {

        onSuccess: (res) => {
            if (res.status === 200) {
                queryCache.invalidateQueries(`property/${props.property.id}`);
                queryCache.invalidateQueries(`my-fav-properties`);
            }
            else {
                setIsSaved(isSaved)
            }
        },

        onError: () => {
            setIsSaved(isSaved);
        }
    }

    const [addToSaved] = useMutation(() => {
        setIsSaved(true);
        const body = JSON.stringify({ "fav_properties": { "add": [props.property.id] } });
        return fetch(postUrl, { body: body, method: 'PATCH', headers: headers })
    }, responses)

    const [removeFromSaved] = useMutation(() => {
        setIsSaved(false);
        const body = JSON.stringify({ "fav_properties": { "remove": [props.property.id] } });
        return fetch(postUrl, { body: body, method: 'PATCH', headers: headers })
    }, responses)

    if (isSaved) {
        return <div class="save-button" onClick={removeFromSaved}><span class='icon icon-heart-solid'></span></div>
    }
    return <div class="save-button" onClick={addToSaved}><span class='icon icon-heart'></span></div>
}


export { SaveButton };