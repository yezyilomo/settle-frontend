import React, { useEffect, useState } from 'react';
import { } from 'react-router-dom';
import './ProfilePictureUploader.scss';
import { useLocalState } from 'simple-react-state';

function ProfilePictureUploader(props) {
    let pictureState = null;
    if (props.pictureModel) {
        pictureState = {
            src: props.pictureModel.src,
            model: props.pictureModel
        }
    }
    else {
        pictureState = {
            src: null,
            model: null
        }
    }

    let [picture, setPicture] = useState(pictureState);

    // Trigger sythentic onChange event when files is updated
    useEffect(() => {
        if (props.onChange !== undefined) {
            props.onChange(picture.model);
        }
    }, [picture]);

    let addPicture = (e) => {
        let src = URL.createObjectURL(e.target.files[0]);
        setPicture({
            src: src,
            model: {
                id: null,
                src: e.target.files[0]
            }
        });
    }

    let removePicture = (img) => {
        setPicture({
            src: null,
            model: null
        });
    }

    return (
        <>
            <div class="profile-picture-container text-center">
                <input type="file" accept="image/*" name={props.name} id={props.name} class="file-input" onChange={addPicture} />
                {!picture.src ?
                    <label for={props.name} class="file-input-label w-100 h-100">
                        <span class="icon icon-user" />
                    </label>:
                    <img class="profile-picture-preview" src={picture.src} alt="" />
                }
            </div>
            {picture.src ?
                <div class="profile-picture-remove">
                    <i class="fas fa-times profile-picture-remove-icon" onClick={(e) => { removePicture(picture) }}></i>
                </div> :
                <div>Upload Profile Picture</div>
            }
        </>
    );
}


export { ProfilePictureUploader }
