import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'state-pool';
import './LogIn.scss';
import { BASE_API_URL } from '../';
import { queryCache } from 'react-query';
import { Modal, Nav, Button, Spinner } from 'react-bootstrap';
import { setErrorClass, saveUserInfoToCookies, setTabColorDark, clearStore } from '../utils';


function ResetPassword(props) {
    const [resetPasswordError, setResetPasswordError] = useState('');
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState('');
    const [isLoading, setLoading] = useState(false);

    useEffect(setResetPasswordError, []);

    let showResponse = (response, email) => {
        let msg = "";
        if(response.statusCode === 200 && response.data.status === 'OK'){
            msg = [
                `Account recovery email sent to '${email}', `,
                `If you don’t see this email in your inbox `,
                `within 15 minutes, look for it in your junk mail folder.`
            ]
            setResetPasswordSuccess(msg.join(""))
        }
        else if(response.statusCode === 400) {
            let buildErrorMessage = (data) => {
                let messages = [];
                for (let key in data) {
                    messages.push(`${data[key]}`);
                }
                return messages.join(" ");
            }
            msg = buildErrorMessage(response.data);
            setResetPasswordError(msg)
        }
        else {
            msg = "Couln't send account recovery email at the moment";
            setResetPasswordError(msg)
        }
    }

    let resetPassword = (event) => {
        event.preventDefault();
        setResetPasswordError("");
        setLoading(true);

        let form = event.target
        let email = form.email.value;

        var formdata = new FormData();
        formdata.append("email", email);

        let resetPasswordUrl = `${BASE_API_URL}/reset-password/`

        fetch(resetPasswordUrl, { method: 'POST', body: formdata })
            .then(res => res.json().then(data => ({statusCode: res.status, data})) )
            .then(res => showResponse(res, email))
            .catch(error => {
                // Network error
                setResetPasswordError(
                    "No network connection, please try again!."
                );
            })
            .finally(() => {
                // Enable button
                setLoading(false);
            })
    }

    let clearErrors = () => {
        setResetPasswordError("")
    } 

    return (
        <div class="container-fluid login py-4">
            <center class="header col-12 h5 m-0 p-0 pt-2 text-secondary">Reset Password</center>
            <form class="login-form text-secondary mt-3" onSubmit={resetPassword}>
                <div class="row justify-content-center">
                    <div class="col-10 p-0 m-0 px-2 my-2 my-lg-3">
                        Forgot your account’s password or having trouble logging into your account? <br/>
                        Enter your email address and we’ll send you a recovery link.
                    </div>
                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="text" name="email" class="form-control floating__input"
                                placeholder="" onChange={clearErrors} required />
                            <label for="email" class="floating__label" data-content="Email"></label>
                        </div>
                    </div>

                    {resetPasswordError ?
                        <div class="col-10 p-0 m-0 text-danger text-center mt-2 mt-lg-3">
                            {resetPasswordError}
                        </div> : null
                    }

                    {resetPasswordSuccess ?
                        <div class="col-10 p-0 m-0 text-success text-center mt-2 mt-lg-3">
                            {resetPasswordSuccess}
                        </div> : null
                    }

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <Button className="col-12 my-3" variant="primary" disabled={isLoading} type="submit">
                                {isLoading ? <Spinner animation="border" size="sm" /> : 'Send Recovery Email'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            <div class="col-12 pb-3 text-center">
                <Link onClick={() => props.setResetPassword(false)}>Go back to Login</Link>
            </div>
        </div>
    );
}

function LogIn(props) {
    const history = useHistory();
    const [, updateUser] = useGlobalState('user');
    const [loginError, setLoginError] = useState('');
    const [showLogInModal, ,setShowLogInModal] = useGlobalState("showLogInModal");
    const [showSignUpModal, ,setShowSignUpModal] = useGlobalState("showSignUpModal");
    const [isLoading, setLoading] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);

    useEffect(setErrorClass, []);
    setTabColorDark(showLogInModal || showSignUpModal, "#151515");

    let showResponse = (response) => {
        let auth_token = response.token;
        if (auth_token !== undefined) {
            let profile_picture = "";
            if (response.picture) {
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

            queryCache.invalidateQueries((query) => true);
            clearStore();
            history.push("/");
        }
        else if (response.non_field_errors !== undefined) {
            setLoginError("Invalid credentials, please try again!.");
        }
        else {
            setLoginError("Failed to login, please try again!.");
        }
    }

    let login = (event) => {
        event.preventDefault();
        setLoginError("");
        setLoading(true);

        let form = event.target
        let username = form.username.value;
        let password = form.password.value;

        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("password", password);

        let loginUrl = `${BASE_API_URL}/auth/`

        fetch(loginUrl, { method: 'POST', body: formdata })
            .then(response => response.json())
            .then(res => showResponse(res))
            .catch(error => {
                // Network error
                setLoginError("No network connection, please try again!.");
            })
            .finally(() => {
                // Enable button
                setLoading(false);
            })
    }

    let goToSignUp = (e) => {
        setShowLogInModal(false);
        setShowSignUpModal(true);
    }

    let clearErrors = () => {
        setLoginError("")
    } 

    return (
        <>
            <Nav.Link href="#" onClick={() => setShowLogInModal(true)}><span class="d-lg-none icon icon-enter"/>Login</Nav.Link>

            <Modal animation={false} scrollable={true} className="login-modal" dialogClassName="custom-modal-dialog" show={showLogInModal} onHide={() => setShowLogInModal(false)} size="lg" aria-labelledby="" centered>
                <div class="modal-close" onClick={() => setShowLogInModal(false)}>
                    <span class="icon icon-close"></span>
                </div>
                <Modal.Body className="p-0 m-0 modal-body">
                    { resetPassword? <ResetPassword setResetPassword={setResetPassword}/>:
                    <div class="container-fluid login py-4">
                        <center class="header col-12 h5 m-0 p-0 pt-2 text-secondary">Login to your account</center>
                        <form class="login-form text-secondary mt-3" onSubmit={login}>
                            <div class="row justify-content-center">
                                <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                    <div class="col-12 px-2 floating">
                                        <input type="text" name="username" class="form-control floating__input" 
                                        placeholder="Username" onChange={clearErrors} required />
                                        <label for="username" class="floating__label" data-content="Username"></label>
                                    </div>
                                </div>
                                <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                    <div class="col-12 px-2 floating">
                                        <input type="password" name="password" class="form-control floating__input"
                                        placeholder="Password" required onChange={clearErrors} />
                                        <label for="password" class="floating__label" data-content="Password"></label>
                                    </div>
                                    <div class="forgot-password-btn col-12 text-right">
                                        <span onClick={() => setResetPassword(true)}>Forgot password?</span>
                                    </div>
                                </div>

                                {loginError ?
                                    <div class="col-10 p-0 m-0 text-danger text-center mt-2 mt-lg-3">
                                        {loginError}
                                    </div> : null
                                }

                                <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                    <div class="col-12 px-2">
                                        <Button className="col-12 my-3" variant="primary" disabled={isLoading} type="submit">
                                            {isLoading ? <Spinner animation="border" size="sm" /> : 'Login'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="col-12 pb-3 text-center">
                            Don’t have an account? <Link onClick={goToSignUp}>Sign up</Link>
                        </div>
                    </div>}
                </Modal.Body>
            </Modal>
        </>
    );
}

export { LogIn }
