import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useGlobalState } from 'state-pool';
import './LogIn.scss';
import { BASE_API_URL } from '../';
import { Modal, Nav, Button, Spinner } from 'react-bootstrap';
import { setErrorClass, saveUserInfoToCookies, setTabColorDark } from '../utils';


function LogIn(props) {
    const history = useHistory();
    const [, updateUser] = useGlobalState('user');
    const [loginError, setLoginError] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [isLoading, setLoading] = useState(false);

    useEffect(setErrorClass, []);
    setTabColorDark(modalShow);

    let updateLogin = (response) => {
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
            .then(res => updateLogin(res))
            .catch(error => {
                // Network error
                setLoginError("No network connection, please try again!.");
            })
            .finally(() => {
                // Enable button
                setLoading(false);
            })
    }

    return (
        <>
            <Nav.Link href="#" onClick={() => setModalShow(true)}>Login</Nav.Link>

            <Modal animation={false} scrollable={true} className="login-modal" dialogClassName="custom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="" centered>
                <div class="modal-close" onClick={() => setModalShow(false)}>
                    <span class="icon icon-close"></span>
                </div>
                <Modal.Body className="p-0 m-0 modal-body">
                    <div class="container-fluid login py-4">
                        <center class="header col-12 h4 pt-2 text-secondary">Login to Your Account</center>
                        <form class="login-form text-secondary" onSubmit={login}>
                            <div class="row justify-content-center">
                                <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                    <div class="col-12 px-2 floating">
                                        <input type="text" name="username" class="form-control floating__input" placeholder="Username" required />
                                        <label for="username" class="floating__label" data-content="Username"></label>
                                    </div>
                                </div>
                                <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                    <div class="col-12 px-2 floating">
                                        <input type="password" name="password" class="form-control floating__input" placeholder="Password" required />
                                        <label for="password" class="floating__label" data-content="Password"></label>
                                    </div>
                                </div>
                                <div class="text-danger">
                                    {loginError}
                                </div>
                                <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                    <div class="col-12 px-2">
                                        <Button className="col-12 my-3" variant="primary" disabled={isLoading} type="submit">
                                            {isLoading ? <Spinner animation="border" size="sm" /> : 'Login'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export { LogIn }
