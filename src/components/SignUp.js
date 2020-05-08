import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Route, MemoryRouter } from 'react-router-dom';
import './SignUp.scss';
import { useGlobalState } from 'state-pool';
import { API_URL } from '../';
import {ProfilePictureUploader} from './'
import { Modal, Nav, Button, Spinner } from 'react-bootstrap';
import { setErrorClass, saveUserInfoToCookies } from '../utils';


function About(props) {
    let [form, updateForm] = useGlobalState("signUp");

    useEffect(setErrorClass, []);

    let handleValueChange = (e) => {
        updateForm(user => {
            let field = e.target.name;
            let value= e.target.value;
            user[field] = value;
        });
    }
    let isFormValid = () => {
        if (
            form.full_name.length > 0 &&
            form.email.length > 0 &&
            /\S+@\S+\.\S+/.test(form.email)
        ) {
            return true
        }
        return false
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid()) {
            props.history.push("/account");
        }
        else {
            // Report errors
        }

    }

    return (
        <>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">ABOUT</div>
            </div>
            <form class="signup-form text-secondary" onSubmit={handleSubmit}>
                <div class="row justify-content-center mt-1">
                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="text" name="full_name" value={form.full_name} required
                                onChange={handleValueChange} class="form-control floating__input" placeholder="Full Name" />
                            <label for="full_name" class="floating__label" data-content="Full Name"></label>
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="email" name="email" value={form.email} required
                                onChange={handleValueChange} class="form-control floating__input" placeholder="Email" />
                            <label for="email" class="floating__label" data-content="Email"></label>
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="submit" class="col-12 btn btn-primary my-3" value="Next" />
                        </div>
                    </div>

                </div>
            </form>
        </>
    );
}

function Account(props) {
    let history = useHistory();
    let [form, updateForm] = useGlobalState("signUp");
    let [, updateUser] = useGlobalState("user");
    let [signupError, setSignupError] = useState("");
    const [isLoading, setLoading] = useState(false);
    
    useEffect(setErrorClass, []);

    let handleValueChange = (e) => {
        updateForm(user => {
            let field = e.target.name;
            let value= e.target.value;
            user[field] = value;
        });
    }

    let setProfilePicture = (img) => {
        updateForm(user => {
            user["profile_pic"] = img
        })
    }

    let profilePicSrc = () => {
        if(form.profile_pic){
            return URL.createObjectURL(form.profile_pic);
        }
        return null;
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid()) {
            submit(e)
        }
        else {
            // Report errors
        }
    }

    let updateLogin = (response) => {
        let auth_token = response.token;
        if (auth_token !== undefined) {
            let profile_picture = null;
            if (response.picture){
                profile_picture = response.picture.src
            }

            let userInfo = {
                auth_token: auth_token,
                id: response.id,
                username: response.username,
                email: response.email,
                full_name: response.full_name,
                phone: response.phone,
                profile_picture: profile_picture
            }

            saveUserInfoToCookies(userInfo);

            updateUser(user => {
                return {
                    isLoggedIn: true,
                    ...userInfo
                }
            });
        }
        else {
            // Report Errors
        }
    }

    let buildErrorMessage = (data) => {
        let messages = [];
        for (let key in data) {
            messages.push(`${data[key]}`);
        }
        return messages.join(", ");
    }

    let login = (response) => {
        if (response.status !== 200) {
            let errorMsg = buildErrorMessage(response.data);
            setSignupError(errorMsg);
        }
        else {
            updateLogin(response.data);
        }
        return response;
    }

    let createProfilePicture = (img, response) => {
        let postData = new FormData();
        postData.append("src", img, img.name);
        let postUrl = `${API_URL}/profile-pictures/`;
        let headers = {
            'Authorization': `Token ${response.data.token}`
        }
        return fetch(postUrl, { method: 'POST', body: postData, headers: headers })
            .then(res => res.json().then(data => ({ status: res.status, data: data })))
            .then(obj => history.push("/"))
    }

    let updateProfilePicture = async (prevResponse) => {
        if(prevResponse.status !== 200){
            return;
        }

        if(form.profile_pic){
            // Profile picture is created
            await createProfilePicture(form.profile_pic, prevResponse);
        }
        else {
            history.push("/")
        }
    }

    let submit = (e) => {
        e.preventDefault();
        setSignupError("");
        setLoading(true);
        var formdata = new FormData();
        formdata.append("full_name", form.full_name);
        formdata.append("email", form.email);
        formdata.append("username", form.username);
        formdata.append("password", form.password);

        let registerUrl = `${API_URL}/register/`
        fetch(registerUrl, { method: 'POST', body: formdata })
            .then(res => res.json().then(data => ({ status: res.status, data: data })))
            .then(res => login(res))
            .then(obj => updateProfilePicture(obj))
            .catch(error => {
                // Network error
                setSignupError("No network connection, please try again!.");
            })
            .finally(() => {
                // Enable button
                setLoading(false);
            });
    }

    let isFormValid = () => {
        if (
            form.username.length > 0 &&
            form.password.length > 6
        ) {
            return true
        }
        return false
    }

    return (
        <>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">ACCOUNT</div>
            </div>
            <form class="signup-form text-secondary" onSubmit={handleSubmit}>
                <div class="row justify-content-center mt-1">

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 text-center upload-profile-pic">
                            <ProfilePictureUploader modalClass="modal-on-modal" name="picture" src={profilePicSrc()} onChange={setProfilePicture}/>
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="text" name="username" value={form.username} required
                                onChange={handleValueChange} class="form-control floating__input" placeholder="Choose a username" />
                            <label for="username" class="floating__label" data-content="Choose a username"></label>
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="password" name="password" value={form.password} required
                                onChange={handleValueChange} class="form-control floating__input" placeholder="Choose a password" />
                            <label for="password" class="floating__label" data-content="Password"></label>
                        </div>
                    </div>

                    <div class="text-danger text-center mt-3">
                        {signupError}
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="row px-2">
                            <div class="col-5">
                                <input type="button" class="col-12 btn btn-primary my-3" value="Back" onClick={
                                    (event) => {
                                        props.history.goBack();
                                    }
                                } />
                            </div>
                            <div class="col-2"></div>
                            <div class="col-5">
                                <Button className="col-12 my-3" variant="primary" disabled={isLoading} type="submit">
                                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Finish'}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </>
    );
}

function SignUp(props) {
    const [modalShow, setModalShow] = useState(false);
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (modalShow) {
        metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");
    }
    else {
        metaThemeColor.setAttribute("content", "white");
    }

    return (
        <>
            <Nav.Link href="#" onClick={() => setModalShow(true)}>Sign up</Nav.Link>

            <Modal animation={false} scrollable={true} className="signup-modal" dialogClassName="custom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <div class="modal-close" onClick={() => setModalShow(false)}>
                    <span class="icon icon-close"></span>
                </div>
                <Modal.Body className="p-0 m-0">
                    <div class="container-fluid signup py-4">
                        <center class="header col-12 h4 mt-0 text-secondary">Create Free Account</center>
                        <MemoryRouter initialEntries={["/about", "/account", { pathname: "/" }]} initialIndex={0}>
                            <Route exact path="/about" component={About} />
                            <Route exact path="/account" component={Account} />
                        </MemoryRouter>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export { SignUp };
