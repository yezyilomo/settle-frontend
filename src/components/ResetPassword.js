import React, { useState, useEffect } from 'react';
import './ResetPassword.scss';
import { Link } from 'react-router-dom';
import { BASE_API_URL } from '../';
import { Button, Spinner } from 'react-bootstrap';
import { parse } from 'query-string';


function ResetPassword(props) {
    const token = parse(props.location.search).token;
    const [resetPasswordError, setResetPasswordError] = useState('');
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [viewPassword, setViewPassword] = useState(false);

    useEffect(setResetPasswordError, []);

    let showResponse = (response, email) => {
        let msg = "";
        if(response.statusCode === 200 && response.data.status === 'OK'){
            msg = [
                `Password reset is successfully, `,
                `You are all set to use your new password.`
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
        else if(response.statusCode === 404) {
            msg = "You are using invalid or expired token."
            setResetPasswordError(msg)
        }
        else {
            msg = "Couln't finish password reset request at the moment";
            setResetPasswordError(msg)
        }
    }

    let resetPassword = (event) => {
        event.preventDefault();
        setResetPasswordError("");
        setLoading(true);

        let form = event.target
        let password = form.password.value;

        var formdata = new FormData();
        formdata.append("token", token);
        formdata.append("password", password);

        let resetPasswordUrl = `${BASE_API_URL}/reset-password/confirm/`

        fetch(resetPasswordUrl, { method: 'POST', body: formdata })
            .then(res => res.json().then(data => ({statusCode: res.status, data})) )
            .then(res => showResponse(res))
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

    let toggleViewPassword = () => {
        setViewPassword(!viewPassword);
    }

    let getPasswordFieldType = () => {
        if (viewPassword) {
            return "text";
        }
        return "password"
    }

    let getPasswordViewIcon = () => {
        if (viewPassword) {
            return "icon-eye-close";
        }
        return "icon-eye-open";
    }

    return (
        <div class="row p-0 m-0">
            <div class="container-fluid pt-4 pb-5 col-11 col-lg-6 reset-password">
                <center class="header col-12 h4 m-0 p-0 pt-2 text-secondary">Change Password</center>
                <form class="text-secondary mt-3" onSubmit={resetPassword}>
                    <div class="row justify-content-center">
                        <div class="col-10 p-0 m-0 my-2 my-lg-3">
                            <div class="col-12 px-2">
                            <label class="form-check-label col-12 p-0 m-0">New Password</label>
                                <span class={`toggle-view-password icon ${getPasswordViewIcon()}`} onClick={toggleViewPassword} />
                                <input class="form-control" type={getPasswordFieldType()} required  autoComplete="new-password"
                                 name="password" onChange={clearErrors} placeholder="Enter new password" />
                            </div>
                        </div>

                        {resetPasswordError ?
                            <div class="col-10 p-0 m-0 px-2 text-danger text-center mt-2 mt-lg-3">
                                {resetPasswordError}
                            </div> : null
                        }

                        {resetPasswordSuccess ?
                            <div class="col-10 p-0 m-0 px-2 text-success text-center mt-2 mt-lg-3">
                                {resetPasswordSuccess}
                            </div> : null
                        }

                        <div class="col-10 p-0 m-0 my-2 my-lg-3">
                            <div class="col-12 px-2">
                                <Button className="col-12 my-3" variant="primary" disabled={isLoading} type="submit">
                                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export { ResetPassword }