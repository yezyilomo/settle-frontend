import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './TopBar.scss';
import { useGlobalState } from 'simple-react-state';
import { LogIn, SignUp } from './'
import { Nav, Navbar, Dropdown } from 'react-bootstrap';


function TopBar(props) {
    const history = useHistory();
    const [key, setKey] = useState("");
    const [user,] = useGlobalState("user");
    const [,updateStore] = useGlobalState();

    let updateField = (e) => {
        let value = e.target.value;
        setKey(value);
    }

    let validateKey = () => {
        if(key){
            return "";
        }
        return 'return false';
    }

    let logOut = (event) => {
        var d = new Date();
        d.setTime(d.getTime() - 24*60*60*1000); // in milliseconds
        document.cookie = `auth_token=;path=/;expires=${d.toGMTString()};`;
        document.cookie = `id=;path=/;expires=${d.toGMTString()};`;
        document.cookie = `username=;path=/;expires=${d.toGMTString()};`;
        document.cookie = `email=;path=/;expires=${d.toGMTString()};`;

        // Clean up store
        updateStore([
            {
                field: "user",
                value: {
                    isLoggedIn: false,
                    authToken: null,
                    id: null,
                    username: null,
                    email: null
                }
            },
            {
                field: "my-profile",
                value: null
            },
            {
                field: "myProperties",
                value: {}
            }
        ])
        history.push("/");
    }

    return (
        <Navbar collapseOnSelect="true" className="row px-0 py-1 py-lg-2 sticky-top bg-white" expand="lg" id="top-navbar">
            <Navbar.Brand className="navbar-brand col-1 col-sm-2 col-md-2 col-lg-3 m-0 p-0 px-1">
                <Link className="click-effect col-12 col-sm-4 m-0 p-0 px-0 px-sm-2 pr-sm-3" to="/">Settle</Link>
            </Navbar.Brand>
            <form class="search-form form-inline m-0 ml-3 ml-lg-0 p-0 p-lg-0 col-7 col-sm-8 col-md-8 col-lg-5 ">
                <input  autocomplete="off" name="search" onChange={updateField} class="search-input m-0 py-0 py-lg-3 form-control m-0 col-12 col-sm-9 col-md-9 col-lg-12"
                    type="search" placeholder="Search location..." aria-label="Search" />
                <Link onClick={validateKey()} to={{ pathname: "/search", search: `?q=${key}`}}>
                    <button class="btn px-sm-3" >
                        <span class="icon icon-search search-button"></span>
                    </button>
                </Link>
            </form>
            <Navbar.Toggle className="navbar-toggler m-0 py-0 px-2" aria-controls="basic-navbar-nav">
                <span class="icon icon-menu"></span>
            </Navbar.Toggle>
            <Navbar.Collapse className="col-12 col-lg-4 m-0 px-1 px-lg-3" id="basic-navbar-nav">
                <hr class="line p-0 m-0 mt-1 d-lg-none" />
                <Nav className="col-12 p-0 d-flex justify-content-end">
                  <Nav.Link href="#/">Home</Nav.Link>
                  <hr class="line p-0 m-0 d-lg-none" />
                  <Nav.Link href="#/">Help</Nav.Link>
                  <hr class="line p-0 m-0 d-lg-none" />
                  { !user.isLoggedIn?
                      <>
                        <LogIn/>
                        <hr class="line p-0 m-0 d-lg-none" />
                      </>:
                      null
                  }
                  <Nav.Link className="d-lg-none" href="#/filter">Filter</Nav.Link>
                  <hr class="line p-0 m-0 d-lg-none" />
                  { !user.isLoggedIn?
                      <>
                        <SignUp/>
                        <hr class="line p-0 m-0 d-lg-none" />
                      </>:
                      null
                  }
                  { user.isLoggedIn?
                      <>
                        <Nav.Link href="#create/properties/">Create</Nav.Link>
                        <hr class="line p-0 m-0 d-lg-none" />
                      </>:
                      null
                  }
                  { user.isLoggedIn?
                      <>
                        <Dropdown alignRight>
                            <Dropdown.Toggle as={Nav.Link}>Profile</Dropdown.Toggle>
                            <Dropdown.Menu className="nav-dropdown-menu bw-0 bw-lg-1">
                                <hr class="line p-0 m-0 d-lg-none" />
                                <Dropdown.Item className="nav-dropdown-item" href="#properties/">My Properties</Dropdown.Item>
                                <hr class="line p-0 m-0" />
                                <Dropdown.Item className="nav-dropdown-item" href="#edit-profile/">Edit Profile</Dropdown.Item>
                                <hr class="line p-0 m-0" />
                                <Dropdown.Item className="nav-dropdown-item" href="#/" onClick={logOut}>
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <hr class="line p-0 m-0 d-lg-none" />
                      </>:
                      null
                  }
                <div class="py-4 d-lg-none"></div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export { TopBar };
