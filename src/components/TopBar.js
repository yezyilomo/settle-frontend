import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './TopBar.scss';
import { useGlobalState, store } from 'state-pool';
import { LogIn, SignUp, InfoModal } from './'
import { Nav, Navbar, Dropdown } from 'react-bootstrap';
import { propertyTypes, getPropertyRoute, deleteUserInfoFromCookies } from '../utils';
import { initializeStore } from '../store';


function CreateProperty(props) {
    const [modalShow, setModalShow] = useState(false);

    let property_types = [];
    for (let type in propertyTypes) {
        if (type !== "generic") {
            property_types.push(type);
        }
    }

    return (
        <>
            <Nav.Link href="#" onClick={() => setModalShow(true)}>Create</Nav.Link>
            <InfoModal header="Select Property To Create" modalShow={modalShow} setModalShow={setModalShow}>
                {property_types.map((val) => {
                    return (
                        <ul class="m-0 p-0 create-property-list" style={{ "font-size": "1.05em" }}>
                            <li class="p-0 m-0">
                                <Link class="d-block m-0 p-0 px-2 pb-2 pt-3 h5 create-property-link" to={`/create/${getPropertyRoute(val)}`} onClick={() => setModalShow(false)}>
                                    {val.charAt(0).toUpperCase() + val.slice(1)}
                                </Link>
                            </li>
                            <hr class="line m-0 p-0" />
                        </ul>
                    )
                })}
            </InfoModal>
        </>
    );
}

function TopBar(props) {
    const history = useHistory();
    const [key, setKey] = useState("");
    const [user,] = useGlobalState("user");

    let updateField = (e) => {
        let value = e.target.value;
        setKey(value);
    }

    let validateKey = () => {
        if (key) {
            return "";
        }
        return 'return false';
    }

    let logOut = (event) => {
        deleteUserInfoFromCookies([
            "auth_token", "id", "username", "email",
            "phone", "full_name", "profile_picture"
        ])

        // Clean up store
        // Do this before calling ReactDOM.render
        initializeStore();
        store.setState("my-profile", null);
        store.setState("myProperties", {});
        history.push("/");
    }

    return (
        <Navbar collapseOnSelect="true" className="row px-0 py-1 py-lg-2 sticky-top bg-white" expand="lg" id="top-navbar">
            <Navbar.Brand className="navbar-brand col-1 col-sm-2 col-md-2 col-lg-3 m-0 p-0 px-1">
                <Link className="col-12 col-sm-4 m-0 p-0 px-0 px-sm-2 pr-sm-3" to="/">
                    <img src="navbar-brand.png" alt="Settle" />
                </Link>
            </Navbar.Brand>
            <form class="search-form form-inline m-0 ml-3 ml-lg-0 p-0 p-lg-0 col-7 col-sm-8 col-md-8 col-lg-5 ">
                <input autocomplete="off" name="search" onChange={updateField} class="search-input m-0 py-0 py-lg-3 form-control m-0 col-12 col-sm-9 col-md-9 col-lg-12"
                    type="search" placeholder="Search location..." aria-label="Search" />
                <Link onClick={validateKey()} to={{ pathname: "/search", search: `?q=${key}` }}>
                    <button class="btn px-sm-3" >
                        <span class="icon icon-search search-button"></span>
                    </button>
                </Link>
            </form>
            <Navbar.Toggle className="navbar-toggler m-0 py-0 px-2" aria-controls="basic-navbar-nav">
                {user.isLoggedIn ?
                    <div class="navbar-profile-picture text-center">
                        {!user.profile_picture ?
                            <span class="icon icon-user" /> :
                            <img src={user.profile_picture} alt="" />
                        }
                    </div> :
                    <span class="icon icon-menu"></span>
                }
            </Navbar.Toggle>
            <Navbar.Collapse className="col-12 col-lg-4 m-0 px-1 px-lg-3" id="basic-navbar-nav">
                <hr class="line p-0 m-0 mt-1 d-lg-none" />
                <Nav className="col-12 p-0 d-flex justify-content-end">
                    <Nav.Link href="#/">Home</Nav.Link>
                    <hr class="line p-0 m-0 d-lg-none" />
                    {!user.isLoggedIn ?
                        <>
                            <LogIn />
                            <hr class="line p-0 m-0 d-lg-none" />
                        </> :
                        null
                    }
                    <Nav.Link className="d-lg-none" href="#/filter">Filter</Nav.Link>
                    <hr class="line p-0 m-0 d-lg-none" />
                    {!user.isLoggedIn ?
                        <>
                            <SignUp />
                            <hr class="line p-0 m-0 d-lg-none" />
                        </> :
                        null
                    }
                    {user.isLoggedIn ?
                        <>
                            <CreateProperty />
                            <hr class="line p-0 m-0 d-lg-none" />
                        </> :
                        null
                    }
                    {user.isLoggedIn ?
                        <>
                            <Dropdown alignRight>
                                <Dropdown.Toggle as={Nav.Link}>
                                    <span class="d-none d-lg-block" style={{"margin-left": "30px"}}/>
                                    <div class="profile-dropdown navbar-profile-picture text-center d-none d-lg-block">
                                        {!user.profile_picture ?
                                            <span class="icon icon-user" /> :
                                            <img src={user.profile_picture} alt="" />
                                        }
                                    </div>
                                    <span class="d-lg-none">Profile</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="nav-dropdown-menu bw-0 bw-lg-1">
                                    <hr class="line p-0 m-0 d-lg-none" />
                                    <Dropdown.Item className="nav-dropdown-item" href="#properties/">My Properties</Dropdown.Item>
                                    <hr class="line p-0 m-0" />
                                    <Dropdown.Item className="nav-dropdown-item" href="#edit-profile/">Edit My Profile</Dropdown.Item>
                                    <hr class="line p-0 m-0" />
                                    <Dropdown.Item className="nav-dropdown-item" href="#/" onClick={logOut}>
                                        Logout
                                </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <hr class="line p-0 m-0 d-lg-none" />
                        </> :
                        null
                    }
                    <div class="py-4 d-lg-none"></div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export { TopBar };
