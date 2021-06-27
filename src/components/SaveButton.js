import React, { useState } from 'react';

import { BASE_API_URL } from '../';
import { useMutation, queryCache } from 'react-query';
import { useGlobalState } from 'state-pool';


function SaveButton(props) {
    const [user,] = useGlobalState("user");
    const [isSaved, setIsSaved] = useState(props.property.is_my_favourite);
    const [, ,setShowLogInModal] = useGlobalState("showLogInModal");
    const [, updateNotifications] = useGlobalState("notifications");

    const postUrl = `${BASE_API_URL}/users/${user.id}/`;
    const headers = {
        'Authorization': `Token ${user.auth_token}`,
        'Content-Type': 'application/json'
    }

    const responses = (msg) => ({

        onSuccess: (res) => {
            if (res.status === 200) {
                updateNotifications((notifications) => {
                    notifications.push(msg)
                })
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
    })

    const [addToSaved] = useMutation(() => {
        if(!user.isLoggedIn) {
            setShowLogInModal(true);
            return;
        }
        setIsSaved(true);
        const body = JSON.stringify({ "fav_properties": { "add": [props.property.id] } });
        return fetch(postUrl, { body: body, method: 'PATCH', headers: headers })
    }, responses("Saved.."))

    const [removeFromSaved] = useMutation(() => {
        if(!user.isLoggedIn) {
            setShowLogInModal(true);
            return;
        }
        setIsSaved(false);
        const body = JSON.stringify({ "fav_properties": { "remove": [props.property.id] } });
        return fetch(postUrl, { body: body, method: 'PATCH', headers: headers })
    }, responses("Removed From Saved.."))

    if (isSaved) {
        return <div class="save-button" onClick={removeFromSaved}><span class='icon icon-heart-solid'></span></div>
    }
    return <div class="save-button" onClick={addToSaved}><span class='icon icon-heart'></span></div>
}


export { SaveButton };