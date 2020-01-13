import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TopBar.scss';
import { useGlobalState } from 'simple-react-state';
import { LogIn, SignUp } from './'
import { Nav, Navbar, Dropdown } from 'react-bootstrap';


function TopBar(props) {
    let [key, setKey] = useState("");
    const [user , updateUser] = useGlobalState("user");

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
            <form class="search-form form-inline m-0 ml-2 ml-lg-0 p-0 py-2 p-lg-0 col-7 col-sm-8 col-md-8 col-lg-5 ">
                <input name="search" onChange={updateField} class="search-input py-0 py-lg-3 form-control m-0 col-12 col-sm-9 col-md-9 col-lg-12"
                    type="search" placeholder="Search location..." aria-label="Search" />
                <Link onClick={validateKey()} to={{ pathname: "/search", search: `?q=${key}`}}>
                    <button class="btn m-0 px-sm-3" >
                        <span class="icon icon-search search-button"></span>
                    </button>
                </Link>
            </form>
            <Navbar.Toggle className="navbar-toggler" aria-controls="basic-navbar-nav">
                <span class="icon icon-menu menu-icon"></span>
            </Navbar.Toggle>
            <Navbar.Collapse className="col-12 col-lg-4 m-0 px-1 px-lg-3" id="basic-navbar-nav">
                <hr class="line p-0 m-0 d-lg-none" />
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
                                <Dropdown.Item className="nav-dropdown-item" href="#/" onClick={logOut}>
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <hr class="line p-0 m-0 d-lg-none" />
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
