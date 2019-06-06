import React, { } from 'react';
import { } from 'react-router-dom';
import './LogIn.css';


function LogIn(props) {
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
                            <form class="login-form text-secondary">
                                <div class="row justify-content-center">
                                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                        <div class="col-12 px-2">
                                            <input type="text" name="user" class="form-control" placeholder="Username" />
                                        </div>
                                    </div>

                                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                                        <div class="col-12 px-2">
                                            <input type="password" name="pass" class="form-control" placeholder="Password" />
                                        </div>
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
