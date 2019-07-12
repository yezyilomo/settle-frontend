import React, { } from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import {setGlobal} from 'reactn';
import './SignUp.css';
import { Block } from './';
import { useGlobalState, useLocalState } from '../hooks';
import {API_URL} from '../';

let signupGlobalStates = {
    first_name: "", last_name: "", email: "",
    profile_pic: "", username: "", password: "",
    country: "", city: "", street: ""
}

setGlobal({
    SignUp: signupGlobalStates
})

function About(props) {
    let [form, updateForm] = useGlobalState("SignUp");
    let handleValueChange = (e) => {
        updateForm({field: e.target.name, value: e.target.value});
    }
    let isFormValid = () => {
        if(
            form.first_name.length > 0 &&
            form.last_name.length > 0 &&
            form.email.length > 0 &&
            /\S+@\S+\.\S+/.test(form.email)
        ){
            return true
        }
        return false
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        if(isFormValid()){
            props.history.push("/account");
        }
        else{
            // Report errors
        }

    }

    return (
        <Block>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">ABOUT</div>
            </div>
            <form class="signup-form text-secondary" onSubmit={handleSubmit}>
                <div class="row justify-content-center mt-1">
                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="first_name" value={form.first_name}
                            onChange={handleValueChange} class="form-control" placeholder="First Name" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="last_name" value={form.last_name}
                            onChange={handleValueChange}class="form-control" placeholder="Last Name" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="email" name="email" value={form.email}
                            onChange={handleValueChange} class="form-control" placeholder="Email" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="submit" class="col-12 btn btn-info mt-3" value="Next" />
                        </div>
                    </div>

                </div>
            </form>
        </Block>
    );
}

function Account(props) {
    let [form, updateForm] = useGlobalState("SignUp");
    let handleValueChange = (e) => {
        updateForm({field: e.target.name, value: e.target.value});
    }

    let isFormValid = () => {
        if(
            form.username.length > 0 &&
            form.password.length > 6
        ){
            return true
        }
        return false
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        if(isFormValid()){
            props.history.push("/finish");
        }
        else{
            // Report errors
        }

    }

    return (
        <Block>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">ACCOUNT</div>
            </div>
            <form class="signup-form text-secondary" onSubmit={handleSubmit}>
                <div class="row justify-content-center mt-1">

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <div class="row justify-content-center">
                                <img class="prof-picture" src="icons/form.svg" width="100" height="100" alt=""/>
                            </div>
                            <div class="row justify-content-center">Upload a profile picture</div>
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="username" value={form.username}
                            onChange={handleValueChange} class="form-control" placeholder="Choose a username" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="password" name="password" value={form.password}
                            onChange={handleValueChange} class="form-control" placeholder="Choose a password" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="row px-2">
                            <div class="col-5">
                                <input type="button" class="col-12 btn btn-info mt-3" value="Back" onClick={
                                    (event) => {
                                        props.history.goBack();
                                    }
                                } />
                            </div>
                            <div class="col-2"></div>
                            <div class="col-5">
                                <input type="submit" class="col-12 btn btn-info mt-3" value="Next" />
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </Block>
    );
}

function Finish(props) {
    let [form, updateForm] = useGlobalState("SignUp");
    let [, updateUser] = useGlobalState("User");
    let [errors, updateErrors] = useLocalState({});

    let handleValueChange = (e) => {
        updateForm({field: e.target.name, value: e.target.value});
    }

    let isFormValid = () => {
        if(
            form.country.length > 0 &&
            form.city.length > 0 &&
            form.street.length > 0
        ){
            return true
        }
        return false
    }


    let handleSubmit = (e) => {
        e.preventDefault();
        if(isFormValid()){
            submit(e)
        }
        else{
            // Report errors
        }
    }

    let updateLogin = (response) => {
        let authToken = response.token;
        if (authToken !== undefined){
            var d = new Date();
            d.setTime(d.getTime() + 30*24*60*60*1000); // in milliseconds
            document.cookie = `auth_token=${authToken};path=/;expires=${d.toGMTString()};SameSite=Lax;`;
            document.cookie = `id=${response.id};path=/;expires=${d.toGMTString()};SameSite=Lax;`;
            document.cookie = `username=${response.username};path=/;expires=${d.toGMTString()};SameSite=Lax;`;
            document.cookie = `email=${response.email};path=/;expires=${d.toGMTString()};SameSite=Lax;`;
            updateUser([
                {field: "isLoggedIn", value: true},
                {field: "authToken", value: authToken},
                {field: "id", value: response.id},
                {field: "username", value: response.username},
                {field: "email", value: response.email}
            ]);
            window.location = "/";
        }
        else{
            // Report Errors
        }
    }

    let login = (response) => {
        if(response.status !== 201){
            updateErrors({action: "assign", field: "signupError", value: "Signup Failed"});
            return
        }
        let username = form.username;
        let password = form.password;
        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("password", password);
        let loginUrl = `${API_URL}/token-auth/`
        fetch(loginUrl, {method: 'POST', body: formdata})
        .then(res => res.json())
        .then(results => updateLogin(results))
        .catch(error => console.log(error));
    }

    let submit = (e) => {
        e.preventDefault();
        var formdata = new FormData();
        formdata.append("first_name", form.first_name);
        formdata.append("last_name", form.last_name);
        formdata.append("email", form.email);
        formdata.append("username", form.username);
        formdata.append("password", form.password);

        let loginUrl = `${API_URL}/users/`
        fetch(loginUrl, {method: 'POST', body: formdata})
        .then(res => login(res))
        .catch(error => console.log(error));
    }

    return (
        <Block>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">FINISH</div>
            </div>
            <form class="signup-form text-secondary" onClick={handleSubmit}>
                <div class="row justify-content-center mt-1">

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="country" value={form.country}
                            onChange={handleValueChange} class="form-control" placeholder="Country" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="city" value={form.city}
                            onChange={handleValueChange} class="form-control" placeholder="City" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="street" value={form.street}
                            onChange={handleValueChange} class="form-control" placeholder="Street" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="text-danger text-center">
                            {errors.signupError}
                        </div>
                        <div class="row px-2">
                            <div class="col-5">
                                <input type="button" class="col-12 btn btn-info mt-3" value="Back" onClick={
                                    (event) => {
                                        props.history.goBack();
                                    }
                                } />
                            </div>
                            <div class="col-2"></div>
                            <div class="col-5">
                                <input type="submit" class="col-12 btn btn-info mt-3" value="Finish" />
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </Block>
    );
}

function SignUp(props) {
    return (
        <div class="signup-modal modal fade p-0 m-0" id="signup-modal">
            <div class="modal-dialog modal-dialog-centered mx-auto modal-lg" role="document">
                <div class="modal-content border-0">
                    <button class="modal-close close" data-dismiss="modal" aria-label="Close">
                        <img src="icons/cancel.svg" width="20" height="20" alt=""/>
                    </button>
                    <div class="modal-body p-0 m-0 border-0 py-4">
                        <div class="container-fluid p-0 m-0">
                            <center class="header col-12 h4 mt-0 text-secondary">Create Free Account</center>
                            <MemoryRouter initialEntries={["/about", "/account", "/finish", { pathname: "/" }]} initialIndex={0}>
                                <Route exact path="/about" component={About} />
                                <Route exact path="/account" component={Account} />
                                <Route exact path="/finish" component={Finish} />
                            </MemoryRouter>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { SignUp };
