import React, { useState } from 'react';
import { } from 'react-router-dom';
import { useGlobalState } from '../hooks';
import './LogIn.css';
import {API_URL} from '../';

function LogIn(props) {
    let [ ,updateUser] = useGlobalState("User");
    let [loginError, setLoginError] = useState('');

    let updateLogin = (response) => {
        let authToken = response.token;
        if (authToken !== undefined){
            var d = new Date();
            d.setTime(d.getTime() + 30*24*60*60*1000); // in milliseconds
            document.cookie = `auth_token=${authToken};path=/;expires=${d.toGMTString()};SameSite=Lax;`;
            updateUser([
                {field: "isLoggedIn", value: true},
                {field: "authToken", value: authToken}
            ]);
            setLoginError("");
            window.location = "/";
        }
        else if(response.non_field_errors !== undefined){
            setLoginError("Invalid credentials, please try again!.");
        }
        else{
            setLoginError("Failed to login, please try again!.");
        }
    }

    let login = (event) => {
        event.preventDefault();
        let form = event.target
        let username = form.username.value;
        let password = form.password.value;
        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("password", password);
        let loginUrl = `${API_URL}/api/token-auth/`
        fetch(loginUrl, {method: 'POST', body: formdata})
        .then(response => response.json())
        .then(res => updateLogin(res))
        .catch(error => console.log(error));
    }
    return (
        <div class="login-modal modal fade p-0 m-0" id="login-modal">
            <div class="modal-dialog modal-dialog-centered mx-auto modal-lg mt-0" role="document">
                <div class="modal-content border-0">
                    <button class="modal-close close" data-dismiss="modal" aria-label="Close">
                        <img src="icons/cancel.svg" width="20" height="20" alt="" />
                    </button>
                    <div class="modal-body p-0 m-0 border-0 py-5">
                        <div class="container-fluid p-0 m-0 px-2">
                            <center class="header col-12 h4 mt-2 text-secondary">Login to Your Account</center>
                            <form class="login-form text-secondary" onSubmit={login}>
                                <div class="row justify-content-center">
                                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                        <div class="col-12 px-2">
                                            <input type="text" name="username" class="form-control" placeholder="Username" />
                                        </div>
                                    </div>

                                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                        <div class="col-12 px-2">
                                            <input type="password" name="password" class="form-control" placeholder="Password" />
                                        </div>
                                    </div>

                                    <div class="text-danger">
                                        {loginError}
                                    </div>

                                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                        <div class="col-12 px-2">
                                            <input type="submit" class="col-12 btn btn-info mt-3" value="Submit" />
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { LogIn };
