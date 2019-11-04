import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useGlobalState } from 'simple-react-state';
import './LogIn.css';
import {API_URL} from '../';
import {Modal, Nav} from 'react-bootstrap';


function LogIn(props) {
    const [,updateUser] = useGlobalState('user');
    const [loginError, setLoginError] = useState('');
    const [modalShow, setModalShow] = useState(false);
    
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    if(modalShow){
        metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");    
    }
    else{
        metaThemeColor.setAttribute("content", "white"); 
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
            setLoginError("");
            props.history.push("/");
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
        let loginUrl = `${API_URL}/auth/`
        fetch(loginUrl, {method: 'POST', body: formdata})
        .then(response => response.json())
        .then(res => updateLogin(res))
        .catch(error => console.log(error));
    }
  
    return (
        <>
          <Nav.Link onClick={() => setModalShow(true)}>Login</Nav.Link>

          <Modal animation={false} dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <div class="modal-close" onClick={() => setModalShow(false)}>
                  <img src="icons/cancel.svg" width="23" height="23" alt=""/>
              </div>
              <Modal.Body className="p-0 m-0">
                    <div class="container-fluid py-4">
                        <center class="header col-12 h4 pt-2 text-secondary">Login to Your Account</center>
                        <form class="login-form text-secondary" onSubmit={login}>
                            <div class="row justify-content-center">
                                <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                    <div class="col-12 px-2">
                                        <input type="text" name="username" class="form-control" placeholder="Username" required />
                                    </div>
                                </div>
                                <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                    <div class="col-12 px-2">
                                        <input type="password" name="password" class="form-control" placeholder="Password" required />
                                    </div>
                                </div>
                                <div class="text-danger">
                                    {loginError}
                                </div>
                                <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                    <div class="col-12 px-2">
                                        <input type="submit" class="col-12 btn btn-info mt-2 mb-3" value="Submit" />
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

const comp = withRouter(LogIn);

export { comp as LogIn }
