import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';
import { useGlobalState } from 'simple-react-state';
import { LogIn, SignUp } from './'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';


function TopBar(props) {
    let [key, setKey] = useState("");
    const [user , updateUser] = useGlobalState("user");

    let updateField = (e) => {
        let value = e.target.value;
        setKey(value);
    }

    let logOut = (event) => {
        var d = new Date();
        d.setTime(d.getTime() - 24*60*60*1000); // in milliseconds
        document.cookie = `auth_token=;path=/;expires=${d.toGMTString()};`;
        document.cookie = `id=;path=/;expires=${d.toGMTString()};`;
        document.cookie = `username=;path=/;expires=${d.toGMTString()};`;
        document.cookie = `email=;path=/;expires=${d.toGMTString()};`;
        updateUser({
            value: {
                isLoggedIn: false,
                authToken: null,
                id: null,
                username: null,
                email: null
            }
        });
    }

    return (
        <Navbar collapseOnSelect="true" className="row py-0 py-lg-2 px-3" expand="lg" bg="white" fixed="top" id="top-navbar">
            <Navbar.Brand className="navbar-brand col-1 col-sm-2 col-md-2 col-lg-3 px-1 py-1">
                <Link className="click-effect col-12 col-sm-4 px-0 px-sm-2 pr-sm-3 py-1" to="/">Settle</Link>
            </Navbar.Brand>
            <form class="search-form form-inline m-0 p-0 py-2 p-lg-0 col-7 col-sm-8 col-md-8 col-lg-5 ">
                <input name="search" onChange={updateField} class="search-input py-0 py-lg-3 form-control m-0 col-12 col-sm-9 col-md-9 col-lg-12"
                    type="search" placeholder="Search location..." aria-label="Search" />
                <Link to={{ pathname: "/search", search: `?q=${key}`}}>
                    <button class="btn m-0 px-sm-3 {/*d-none d-sm-block*/}" >
                        <img class="search-button" src="icons/search.svg" width="21" height="21" alt=""/>
                    </button>
                </Link>
            </form>
            <Navbar.Toggle className="navbar-toggler" aria-controls="basic-navbar-nav">
                <img class="menu-icon" src="icons/menu.svg" width="45" height="45" alt=""/>
            </Navbar.Toggle>
            <Navbar.Collapse className="col-12 col-lg-4 m-0 px-1 px-lg-3" id="basic-navbar-nav">
                <hr class="p-0 m-0 d-lg-none" />
                <Nav className="col-12 p-0 d-flex justify-content-end">
                  <Nav.Link href="#/">Home</Nav.Link>
                  <hr class="p-0 m-0 d-lg-none" />
                  <Nav.Link href="#/">Help</Nav.Link>
                  <hr class="p-0 m-0 d-lg-none" />
                  { !user.isLoggedIn?
                      <>
                        <LogIn/>
                        <hr class="p-0 m-0 d-lg-none" />
                      </>:
                      null
                  }
                  <Nav.Link className="d-lg-none" href="#/filter">Filter</Nav.Link>
                  <hr class="p-0 m-0 d-lg-none" />
                  { !user.isLoggedIn?
                      <>
                        <SignUp/>
                        <hr class="p-0 m-0 d-lg-none" />
                      </>:
                      null
                  }
                  { user.isLoggedIn?
                      <>
                        <Nav.Link href="#upload-property">Create</Nav.Link>
                        <hr class="p-0 m-0 d-lg-none" />
                      </>:
                      null
                  }
                  { user.isLoggedIn?
                      <>
                        <NavDropdown alignRight title="Profile" id="basic-nav-dropdown">
                          <NavDropdown.Item href="#my-properties">My Properties</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#/" onClick={logOut}>
                              Logout
                          </NavDropdown.Item>
                        </NavDropdown>
                        <hr class="p-0 m-0 d-lg-none" />
                      </>:
                      null
                  }
                </Nav>
                <div class="vh-100 vw-100 d-lg-none"></div>
            </Navbar.Collapse>
        </Navbar>
    );
}

export { TopBar };
