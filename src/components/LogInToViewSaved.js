import React from 'react';
import {Link} from 'react-router-dom';
import { useGlobalState } from 'state-pool';
import { Button } from 'react-bootstrap';
import lovingItImage from '../images/undraw_loving_it.svg';
import { usePageTransition } from '../hooks';


function LogInToViewSaved(props){
    const animate = usePageTransition()
    const [, ,setShowLogInModal] = useGlobalState("showLogInModal");
    const [, ,setShowSignUpModal] = useGlobalState("showSignUpModal");
    
    const login = (e) => {
        e.preventDefault();
        setShowLogInModal(true);
    }

    const signup = (e) => {
        e.preventDefault();
        setShowSignUpModal(true);
    }

    return (
        <div class={`row p-0 m-0 ${animate()}`}>
            <div class="col-12 p-0 m-0 mt-5 pt-5 pt-md-0 mt-md-4 d-flex justify-content-center">
                <img class="col-12 col-md-6" src={lovingItImage}/>
            </div>
            <div class="col-12 mt-3 text-center">
                <p class="mr-4 h5">Login to your account to be able to save your favourite properties</p>
            </div>
            <div class="col-12 p-0 m-0 px-4 mt-2 mt-sm-4 d-flex justify-content-center">
                <Button className="col-6 col-md-2 my-3 my-md-1 py-2" variant="primary" onClick={login}>
                    Login
                </Button>
            </div>
            <div class="col-12 mt-3 text-center">
                <p class="h6">Don't have an account yet?  
                    <Link onClick={signup}> Signup</Link>
                </p>
            </div>
        </div>
    );
}

export { LogInToViewSaved };