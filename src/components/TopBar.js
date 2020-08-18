import React, { useState, useRef } from 'react';
import navbarBrandImage from '../images/navbar-brand.png';
import { Link, useHistory } from 'react-router-dom';
import './TopBar.scss';
import { queryCache } from 'react-query';
import { useGlobalState } from 'state-pool';
import { LogIn, SignUp, InfoModal } from './'
import { Nav, Navbar, Dropdown } from 'react-bootstrap';
import {
    propertyTypes, getPropertyRoute, deleteUserInfoFromCookies,
    clearStore, capitalizeFirst
} from '../utils';

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox, ComboboxInput, ComboboxPopover,
    ComboboxList, ComboboxOption,
} from "@reach/combobox";
import { useLoadScript } from "@react-google-maps/api";


const libraries = ["places"];

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
            <Nav.Link href="#" onClick={() => setModalShow(true)}>
                <span class="d-lg-none icon icon-add mr-2"/>Create
            </Nav.Link>
            <InfoModal header="Select Property Type" modalShow={modalShow} setModalShow={setModalShow}>
                <ul class="m-0 p-0">
                    {property_types.map((val) => {
                        return (
                            <>
                                <li class="p-0 m-0">
                                    <Link class="d-block m-0 p-0 px-2 pb-2 pt-3 create-property-link" to={`/create/${getPropertyRoute(val)}`} onClick={() => setModalShow(false)}>
                                        {capitalizeFirst(val)}
                                    </Link>
                                </li>
                                <hr class="line m-0 p-0" />
                            </>
                        )
                    })}
                </ul>
            </InfoModal>
        </>
    );
}


function Search(props) {
    const history = useHistory();
    const searchInput = useRef(null);
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {
                lat: () => 0,
                lng: () => 0
            },
            radius: 100 * 1000,
        },
    });

    const searchByKey = (e) => {
        clearSuggestions();
        searchInput.current.blur();
        e.preventDefault();
        if (!value) {
            // Nothing to search
            return;
        }
        history.push(`/search/?q=${value}`);
    }

    const searchByLatLng = (location) => {
        searchInput.current.blur();
        history.push(`/search/?lng=${location.lng}&lat=${location.lat}`);
    }

    const handleSelect = async (address) => {
        setValue(address, false);  // Don't make API call
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            searchByLatLng({lat, lng});
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    const handleInputChange = (e) => {
        if (props.simple) {
            setValue(e.target.value, false);  // Don't make API call
        }
        else {
            setValue(e.target.value);  // Make API call
        }
    };

    return (
        <form onSubmit={searchByKey} class="search-form form-inline m-0 ml-3 ml-lg-0 p-0 p-lg-0 col-7 col-sm-8 col-md-8 col-lg-5 ">
            <div class="back-button" >
                <span class="icon icon-up-arrow"></span>
            </div>
            <Combobox onSelect={handleSelect} className="search-box-container col-12 p-0 m-0 col-sm-9 col-md-9 col-lg-12">
                <ComboboxInput value={value} disabled={props.simple || !ready} onChange={handleInputChange} autoComplete="off"
                    name="search" type="search" placeholder="Search location..."
                    className="search-input col-12" ref={searchInput}/>

                {status === "OK" && data ?
                    <ComboboxPopover className="search-suggestions-box">
                        <ComboboxList>
                            {data.map(({ id, description }) => (
                                <ComboboxOption key={id} value={description} />
                            ))}
                        </ComboboxList>
                    </ComboboxPopover> : null
                }
            </Combobox>
            <button type="submit" class="btn d-none d-md-block search-button" >
                <span class="icon icon-search"></span>
            </button>
            <div class="btn  d-md-none search-button" >
                <span class="icon icon-search"></span>
            </div>
        </form>
    );
}

function SimpleSearch(props){
    return <Search {...props} simple/>
}

function AdvancedSearch(props){
    return <Search {...props}/>
}

function TopBar(props) {
    const history = useHistory();
    const [user,] = useGlobalState("user");
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    let logOut = (event) => {
        deleteUserInfoFromCookies([
            "auth_token", "id", "username", "email",
            "phone", "full_name", "profile_picture"
        ])

        queryCache.invalidateQueries((query) => true);
        clearStore()
        history.push("/");
    }

    return (
        <Navbar collapseOnSelect="true" className="row px-0 py-1 py-lg-2 sticky-top bg-white" expand="lg" id="top-navbar">
            <Navbar.Brand className="navbar-brand col-1 col-sm-2 col-md-2 col-lg-3 m-0 p-0 px-1">
                <Link className="col-12 col-sm-4 m-0 p-0 px-0 px-sm-2 pr-sm-3" to="/">
                    <img src={navbarBrandImage} alt="Settle" />
                </Link>
            </Navbar.Brand>
                { isLoaded ?
                    <AdvancedSearch />:
                    <SimpleSearch />
                }
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
            <Navbar.Collapse className="row collapsible-menu col-lg-4 m-0 px-0 px-lg-3" id="basic-navbar-nav">
                <Nav className="col-9 col-lg-12 p-0 m-0 nav-menu">
                    <Nav.Link href="#/"><span class="d-lg-none icon icon-house mr-2"/>Home</Nav.Link>
                    <hr class="line p-0 m-0 d-lg-none" />
                    <Nav.Link href="#/my-fav-properties"><span class="d-lg-none icon icon-heart mr-2"/>Saved</Nav.Link>
                    <hr class="line p-0 m-0 d-lg-none" />
                    {!user.isLoggedIn ?
                        <>
                            <LogIn />
                            <hr class="line p-0 m-0 d-lg-none" />
                        </> :
                        null
                    }
                    <Nav.Link className="d-lg-none" href="#/filter">
                        <span style={{transform: "rotate(90deg)"}} class="d-lg-none icon icon-settings mr-2"/>Filter
                    </Nav.Link>
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
                                    <span class="d-lg-none"><span class="d-lg-none icon icon-user mr-2"/>Profile</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="nav-dropdown-menu p-0 m-0 bw-0 bw-lg-1">
                                    <hr class="line p-0 m-0 d-lg-none" />
                                    <Dropdown.Item className="nav-dropdown-item" href="#properties/">My Properties</Dropdown.Item>
                                    <hr class="line p-0 m-0" />
                                    <Dropdown.Item className="nav-dropdown-item" href="#edit-profile/">My Profile</Dropdown.Item>
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
                <Navbar.Toggle className="overlay col-3 d-lg-none p-0 m-0" aria-controls="basic-navbar-nav"/>
            </Navbar.Collapse>
        </Navbar>
    );
}

export { TopBar };
