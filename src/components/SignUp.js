import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Route, MemoryRouter } from 'react-router-dom';
import './SignUp.scss';
import { useGlobalState } from 'simple-react-state';
import { API_URL } from '../';
import { Modal, Nav, Button, Spinner } from 'react-bootstrap';
import { setErrorClass } from '../utils';
import store from '../store';


store.setState({
    field: "signUp",
    value: {
        first_name: "", 
        last_name: "", 
        email: "",
        profile_pic: "", 
        username: "", 
        password: "",
        country: "", 
        city: "", 
        street: ""
    }
})

function About(props) {
    let [form, updateForm] = useGlobalState("signUp");

    useEffect(setErrorClass, []);

    let handleValueChange = (e) => {
        updateForm({
            field: e.target.name, 
            value: e.target.value
        });
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
        <>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">ABOUT</div>
            </div>
            <form class="signup-form text-secondary" onSubmit={handleSubmit}>
                <div class="row justify-content-center mt-1">
                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="text" name="first_name" value={form.first_name} required
                            onChange={handleValueChange} class="form-control floating__input" placeholder="First Name" />
                            <label for="first_name" class="floating__label" data-content="First Name"></label>
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="text" name="last_name" value={form.last_name} required
                            onChange={handleValueChange}class="form-control floating__input" placeholder="Last Name" />
                            <label for="last_name" class="floating__label" data-content="Last Name"></label>
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
    let [form, updateForm] = useGlobalState("signUp");

    useEffect(setErrorClass, []);

    let handleValueChange = (e) => {
        updateForm({
            field: e.target.name, 
            value: e.target.value
        });
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
        <>
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
                                <input type="submit" class="col-12 btn btn-primary my-3" value="Next" />
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </>
    );
}

function Finish(props) {
    let history = useHistory();
    let [form, updateForm] = useGlobalState("signUp");
    let [, updateUser] = useGlobalState("user");
    let [signupError, setSignupError] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(setErrorClass, []);

    let handleValueChange = (e) => {
        updateForm({
            field: e.target.name,
            value: e.target.value
        });
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
            updateUser({
                value: {
                    isLoggedIn: true,
                    authToken: authToken,
                    id: response.id,
                    username: response.username,
                    email: response.email
                }
            });
            history.push("/");
        }
        else{
            // Report Errors
        }
    }

    let buildErrorMessage = (data) => {
        let messages = [];
        for(let key in data){
            messages.push(`${data[key]}`);
        }
        return messages.join(", ");
    }

    let login = (response) => {
        if(response.status !== 200){
            let errorMsg = buildErrorMessage(response.data);
            setSignupError(errorMsg);
        }
        else {
            updateLogin(response.data);
        }
    }

    let submit = (e) => {
        e.preventDefault();
        setSignupError("");
        setLoading(true);
        var formdata = new FormData();
        formdata.append("first_name", form.first_name);
        formdata.append("last_name", form.last_name);
        formdata.append("email", form.email);
        formdata.append("username", form.username);
        formdata.append("password", form.password);

        let registerUrl = `${API_URL}/register/`
        fetch(registerUrl, {method: 'POST', body: formdata})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(res => login(res))
        .catch(error => {
            // Network error
            setSignupError("No network connection, please try again!.");
        })
        .finally(() => {
            // Enable button
            setLoading(false);
        });
    }

    return (
        <>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">FINISH</div>
            </div>
            <div class="text-danger text-center mt-3">
                {signupError}
            </div>
            <form class="signup-form text-secondary" onSubmit={handleSubmit}>
                <div class="row justify-content-center mt-0">

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="text" name="country" value={form.country} required
                            onChange={handleValueChange} class="form-control floating__input" placeholder="Country" />
                            <label for="country" class="floating__label" data-content="Country"></label>
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="text" name="city" value={form.city} required
                            onChange={handleValueChange} class="form-control floating__input" placeholder="City" />
                            <label for="city" class="floating__label" data-content="City"></label>
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2 floating">
                            <input type="text" name="street" value={form.street} required
                            onChange={handleValueChange} class="form-control floating__input" placeholder="Street" />
                            <label for="street" class="floating__label" data-content="Street"></label>
                        </div>
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
                                <Button className="col-12 my-3" variant="info" disabled={isLoading} type="submit">
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
    if(modalShow){
        metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");    
    }
    else{
        metaThemeColor.setAttribute("content", "white"); 
    }
    
    return (
        <>
          <Nav.Link href="#" onClick={() => setModalShow(true)}>Sign up</Nav.Link>
          
          <Modal animation={false} scrollable={true} className="signup-modal" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <div class="modal-close" onClick={() => setModalShow(false)}>
                  <span class="icon icon-close"></span>
              </div>
              <Modal.Body className="p-0 m-0">
                    <div class="container-fluid signup py-4">
                        <center class="header col-12 h4 mt-0 text-secondary">Create Free Account</center>
                        <MemoryRouter initialEntries={["/about", "/account", "/finish", { pathname: "/" }]} initialIndex={0}>
                            <Route exact path="/about" component={About} />
                            <Route exact path="/account" component={Account} />
                            <Route exact path="/finish" component={Finish} />
                        </MemoryRouter>
                    </div>
              </Modal.Body>
          </Modal>
        </>
    );
}

export { SignUp };
