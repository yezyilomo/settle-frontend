import React, { useState } from 'react';
import './EditProfile.scss';
import { useHistory } from 'react-router';
import { Button, Spinner } from 'react-bootstrap';
import {
    GlobalFetcher, GlowPageLoader, ProfilePictureUploader, PageError
} from './';
import { BASE_API_URL } from '../';
import { useGlobalState, useLocalState } from 'state-pool';
import { useRestoreScrollState } from '../hooks';
import { saveUserInfoToCookies, getUserInfoFromCookies } from '../utils';


function EditProfile(props) {
    useRestoreScrollState();
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [profile, updateProfile] = useLocalState(props.profile);
    const [user,] = useGlobalState("user");
    const [, updateGlobalProfile] = useGlobalState("my-profile");
    const [profilePicture, setProfilePicture] = useState(undefined);

    let createProfilePicture = (img) => {
        let postData = new FormData();
        postData.append("src", img, img.name);

        let postUrl = `${BASE_API_URL}/profile-pictures/`;
        let headers = {
            'Authorization': `Token ${user.auth_token}`
        }
        return fetch(postUrl, { method: 'POST', body: postData, headers: headers })
            .then(res => res.json().then(data => ({ status: res.status, data: data })))
    }

    let deleteProfilePicture = (imgID) => {
        let postUrl = `${BASE_API_URL}/profile-pictures/${imgID}/`;
        let headers = {
            'Authorization': `Token ${user.auth_token}`
        }
        return fetch(postUrl, { method: 'DELETE', body: "", headers: headers })
    }

    let updateProfilePicture = async (prevResponse) => {
        if (profilePicture === undefined){
            // Nothing changed
            return
        }
        if (profilePicture && profile.picture){
            // Profile picture is replaced(delete & create)
            await deleteProfilePicture(profile.picture.id);
            await createProfilePicture(profilePicture);
        }
        else if (profilePicture && !profile.picture){
            // Profile picture is created
            await createProfilePicture(profilePicture);
        }
        else if (!profilePicture && profile.picture){
            // Profile picture is deleted
            await deleteProfilePicture(profile.picture.id);
        }
    }

    let redirect = (response) => {
        // Get fresh profile data
        updateGlobalProfile(draftProfile => null);
        return history.replace(`/edit-profile/`);
    }

    let handleProfileUpdate = (e) => {
        e.preventDefault();
        setEditError("");
        setLoading(true);
        let form = e.target

        let formData = {
            full_name: form.full_name.value,
            email: form.email.value,
            phone: form.phone.value,
            biography: form.biography.value
        }

        let postUrl = `${BASE_API_URL}/users/${user.id}/`;
        let headers = {
            'Authorization': `Token ${user.auth_token}`,
            'Content-Type': 'application/json'
        }
        fetch(postUrl, { method: 'PATCH', body: JSON.stringify(formData), headers: headers })
            .then(res => res.json().then(data => ({ status: res.status, data: data })))
            .then(obj => updateProfilePicture(obj))
            .then(obj => redirect(obj))
            .catch(error => {
                // Network error
                setEditError("No network connection, please try again!.");
            })
            .finally(() => {
                // Enable button
                setLoading(false);
            })
    }

    let updateValue = (e) => {
        updateProfile(profile => {
            let field = e.target.getAttribute("data-field");
            let value = e.target.value;
            profile[field] = value;
        })
    }

    let src = (pictureModel) => {
        if (pictureModel) {
            return pictureModel.src;
        }
        return null;
    }

    return (
        <form class="profile-form text-secondary px-3 px-sm-4 mt-2 mt-sm-4" onSubmit={handleProfileUpdate}>
            <div class="row mt-4 justify-content-end">
                <div class="col-12 col-md-6 pr-md-4 edit-profile order-2 order-md-1">

                    <div class="row p-0 m-0 mb-3">
                        <label class="form-check-label col-12 p-0 m-0">Full Name</label>
                        <div class="col-12 p-0 m-0 my-1">
                            <input type="text" data-field="full_name" name="full_name" placeholder="Full Name"
                            value={profile.full_name} onChange={updateValue} class="form-control"  />
                        </div>
                    </div>

                    <div class="row p-0 m-0 mb-3">
                        <label class="form-check-label col-12 p-0 m-0">Username</label>
                        <div class="col-12 p-0 m-0 my-1">
                            <input disabled type="text" data-field="username" name="username" placeholder="Username"
                            value={profile.username} onChange={updateValue} class="form-control"  />
                        </div>
                    </div>

                    <div class="row p-0 m-0 mb-3">
                        <label class="form-check-label col-12 p-0 m-0">Email</label>
                        <div class="col-12 p-0 m-0 my-1">
                            <input type="email" data-field="email" name="email" placeholder="Email"
                            value={profile.email} onChange={updateValue} class="form-control"  />
                        </div>
                    </div>

                    <div class="row p-0 m-0 mb-3">
                        <label class="form-check-label col-12 p-0 m-0">Phone</label>
                        <div class="col-12 p-0 m-0 my-1">
                            <input type="text" data-field="phone" name="phone" placeholder="Phone Number"
                            value={profile.phone} onChange={updateValue} class="form-control"  />
                        </div>
                    </div>


                    <div class="row p-0 m-0 mt-lg-4">
                        <div class="col-12 mb-2 text-center text-danger">
                            {editError}
                        </div>
                        <Button className="col-12" variant="primary" disabled={isLoading} type="submit">
                            {isLoading ? <Spinner animation="border" size="sm" /> : 'Save'}
                        </Button>
                    </div>

                </div>

                <div class="col-12 col-md-6 order-1 order-md-2">
                    <div class="row p-0 m-0">
                        <div class="col-12 p-0 m-0 text-center edit-profile-picture">
                            <ProfilePictureUploader name="picture" src={src(profile.picture)} onChange={setProfilePicture}/>
                        </div>
                    </div>
                    
                    <div class="row p-0 m-0 mt-4 mb-3">
                        <label class="form-check-label col-12 p-0 m-0">Biography</label>
                        <div class="col-12 p-0 m-0 my-1">
                            <textarea type="text" data-field="biography" name="biography" placeholder=""
                            value={profile.biography} onChange={updateValue} class="form-control" rows="5"/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}


function ProfileFetcher(props){
    const [user, updateUser] = useGlobalState("user");

    let updateUserData = (obj) => {
        // This is for updating user data when the profile is edited
        // It updates both cookies and user global state
        if (obj.response.status === 200){
            obj.data.then(data => {
                let profile_picture = "";
                if (data.picture){
                    profile_picture = data.picture.src
                }
    
                let userInfo = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    full_name: data.full_name,
                    phone: data.phone,
                    profile_picture: profile_picture
                }
                
                saveUserInfoToCookies(userInfo);

                let savedUserInfo = getUserInfoFromCookies([
                    "auth_token", "id", "username", "email",
                    "phone", "full_name", "profile_picture"
                ])
                // Reload user state
                updateUser(draftUser => {
                    return {...user, ...savedUserInfo};
                })
            })
        }
        return obj.data;
    }

    let headers = {
        'Authorization': `Token ${user.auth_token}`,
        'Content-Type': 'application/json'
    }
    
    let fetchProfile = () => {
        return fetch(`${BASE_API_URL}/users/${user.id}/`, { method: 'GET', headers: headers })
        .then(res => { return {response: res, data: res.json()} })
        .then(obj => updateUserData(obj))
    }

    return (
        <GlobalFetcher 
         selection="my-profile"
         action={fetchProfile}
         placeholder={<GlowPageLoader/>} 
         error={<PageError/>}>
             {profile => {
                return <EditProfile profile={profile} {...props}/>
             }}
         </GlobalFetcher>
    );
}

export { ProfileFetcher as EditProfile }
