import React, { } from 'react';
import { Link, Route, MemoryRouter } from 'react-router-dom';
import './SignUp.css';
import { Block } from './';


function About(props) {
    return (
        <Block>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">ABOUT</div>
            </div>
            <form class="signup-form text-secondary">
                <div class="row justify-content-center mt-1">

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="user" class="form-control" placeholder="First Name" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="user" class="form-control" placeholder="Last Name" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="email" name="user" class="form-control" placeholder="Email" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <Link to="/account">
                                <input type="submit" class="col-12 btn btn-info mt-3" value="Next" />
                            </Link>
                        </div>
                    </div>

                </div>
            </form>
        </Block>
    );
}

function Account(props) {
    return (
        <Block>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">ACCOUNT</div>
            </div>
            <form class="signup-form text-secondary">
                <div class="row justify-content-center mt-1">

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <div class="row justify-content-center">
                                <img class="prof-picture" src="icons/user.svg" width="100" height="100" alt=""/>
                            </div>
                            <div class="row justify-content-center">Upload a profile picture</div>
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="user" class="form-control" placeholder="Choose a username" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="password" name="pass" class="form-control" placeholder="Choose a password" />
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
                                <Link to="/finish">
                                    <input type="submit" class="col-12 btn btn-info mt-3" value="Next" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </Block>
    );
}

function Finish(props) {
    return (
        <Block>
            <div class="row progress-tab m-0 p-0">
                <div class="col text-center text-secondary">FINISH</div>
            </div>
            <form class="signup-form text-secondary">
                <div class="row justify-content-center mt-1">

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="user" class="form-control" placeholder="Country" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="user" class="form-control" placeholder="City" />
                        </div>
                    </div>

                    <div class="col-10 p-0 m-0 my-2 my-lg-3">
                        <div class="col-12 px-2">
                            <input type="text" name="user" class="form-control" placeholder="Street" />
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
                                <Link to="/finish">
                                    <input type="submit" class="col-12 btn btn-info mt-3" value="Finish" />
                                </Link>
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
