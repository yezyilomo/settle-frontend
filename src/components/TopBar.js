import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';
import { setGlobal } from 'reactn'
import { useGlobalState } from '../hooks';


setGlobal({
    TopBar: {
        searchElement: null
    }
})

function Menu(props){
    let [user, updateUser] = useGlobalState("User");

    let logOut = (event) => {
        var d = new Date();
        d.setTime(d.getTime() - 24*60*60*1000); // in milliseconds
        document.cookie = `auth_token=;path=/;expires=${d.toGMTString()};`;
        document.cookie = `id=;path=/;expires=${d.toGMTString()};`;
        document.cookie = `username=;path=/;expires=${d.toGMTString()};`;
        document.cookie = `email=;path=/;expires=${d.toGMTString()};`;
        updateUser([
            {field: "isLoggedIn", value: false},
            {field: "authToken", value: null},
            {field: "id", value: null},
            {field: "username", value: null},
            {field: "email", value: null}
        ]);
    }

    return (
            <ul class="navbar-nav ml-0 ml-lg-auto">
                <li class="nav-item" data-toggle="collapse" data-target="#navbarTogglerDemo03">
                    <Link class="nav-link" to="/">Home</Link>
                    <hr class="p-0 m-0 d-lg-none" />
                </li>
                <li class="nav-item" data-toggle="collapse" data-target="#navbarTogglerDemo03">
                    <Link class="nav-link" to="/">Help</Link>
                    <hr class="p-0 m-0 d-lg-none" />
                </li>
                { !user.isLoggedIn?
                    <li class="nav-item" data-toggle="collapse" data-target="#navbarTogglerDemo03">
                        <Link class="nav-link" to="" data-toggle="modal" data-target="#login-modal">
                            Login<span class="sr-only">(current)</span>
                        </Link>
                        <hr class="p-0 m-0 d-lg-none" />
                    </li>:
                    null
                }
                <li class="nav-item d-lg-none" data-toggle="collapse" data-target="#navbarTogglerDemo03">
                    <Link class="nav-link" to="/filter">Quick Filter <span class="sr-only">(current)</span></Link>
                    <hr class="p-0 m-0 d-lg-none" />
                </li>
                { !user.isLoggedIn?
                    <li class="nav-item" data-toggle="collapse" data-target="#navbarTogglerDemo03">
                        <Link class="nav-link" to="" data-toggle="modal" data-target="#signup-modal">
                            Sign up<span class="sr-only">(current)</span>
                        </Link>
                        <hr class="p-0 m-0 d-lg-none" />
                    </li>:
                    null
                }
                { user.isLoggedIn?
                    <>
                    <li class="nav-item" data-toggle="collapse" data-target="#navbarTogglerDemo03">
                        <Link class="nav-link" to="/upload-property">Create</Link>
                        <hr class="p-0 m-0 d-lg-none" />
                    </li>
                    <li class="nav-item dropdown pb-0 pb-lg-0">
                        <a class="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Profile
                        </a>
                        <div class="dropdown-menu dropdown-menu-right border-xs-0 border-lg-1 py-0 my-0 mt-lg-3" aria-labelledby="navbarDropdown">
                            <div class="dropdown-divider d-lg-none py-0 my-0"></div>
                            <div data-toggle="collapse" data-target="#navbarTogglerDemo03">
                                <a class="dropdown-item py-2" href="/">Edit Info</a>
                            </div>
                            <div class="dropdown-divider py-0 my-0"></div>
                            <div data-toggle="collapse" data-target="#navbarTogglerDemo03">
                                <a class="dropdown-item py-2" href="/">Manage</a>
                            </div>
                            <div class="dropdown-divider py-0 my-0"></div>
                            <div data-toggle="collapse" data-target="#navbarTogglerDemo03">
                                <Link class="dropdown-item py-2" to="/my-properties">My Properties</Link>
                            </div>
                            <div class="dropdown-divider py-0 my-0"></div>
                            <div data-toggle="collapse" data-target="#navbarTogglerDemo03">
                                <Link class="dropdown-item py-2" to="/" onClick={logOut}>Logout</Link>
                            </div>
                        </div>
                        <div class="dropdown-divider d-lg-none py-0 my-0"></div>
                    </li>
                    </>:
                    null
                }
            </ul>
    );
}

function TopBar(props) {
    let [key, setKey] = useState("");
    const searchElement = useRef(null);
    let [,setTopBarStates] = useGlobalState("TopBar");

    useEffect(()=>{
        // Refer to search element
        setTopBarStates({field: "searchElement", value: searchElement})
    }, [])

    let updateField = (e) => {
        let value = e.target.value;
        setKey(value);
    }

    return (
        <nav class="navbar col-12 fixed-top  navbar-expand-lg navbar-light bg-white p-0 px-1 p-lg-2" id="top-navbar">
            <div class="navbar-brand col-1 col-sm-2 col-md-3 col-lg-3 px-0 py-1">
                <Link class="click-effect col-12 col-sm-4 px-0 px-sm-2 py-2" to="/">Settle</Link>
            </div>

            <form class="search-form form-inline m-0 p-0 py-2 p-lg-0 col-7 col-sm-8 col-md-8 col-lg-6 ">
                <input ref={searchElement} name="search" onChange={updateField} class="search-input py-0 py-lg-3 form-control m-0 col-12 col-sm-9 col-md-9 col-lg-12"
                    type="search" placeholder="Search location..." aria-label="Search" />
                <Link to={{ pathname: "/search", search: `?q=${key}`}}>
                    <button class="btn m-0 px-sm-3 {/*d-none d-sm-block*/}" >
                        <img class="search-button" src="icons/search.svg" width="21" height="21" alt=""/>
                        {/*<i class="fa fa-search search-button " />*/}
                    </button>
                </Link>
            </form>

            <Link to="/menu" class="navbar-toggler" >
                <img class="menu-icon" src="icons/menu.svg" width="40" height="40" alt=""/>
            </Link>

            <div class="d-none d-lg-inline navbar-collapse col-lg-3 m-0 px-0 px-lg-3" id="navbarTogglerDemo03">
                <Menu/>
            </div>
        </nav>
    );
}

export { TopBar, Menu };
