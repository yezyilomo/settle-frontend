import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import { setGlobal, useGlobal} from 'reactn'
import './Home.css';
import {
    PropertyGroup, SideBar, TopBar, PropertyDetails,
    UploadProperty, LogIn, SignUp, Fetcher, Loader,
    EditProperty
} from './'
import {API_URL} from '../';

function getCookie(name){
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let isLoggedIn = false;
let authToken = getCookie("auth_token");

if(authToken !== null){
    isLoggedIn = true;
}

setGlobal({
    User: {isLoggedIn: isLoggedIn, authToken: authToken}
})

function Filter(props) {
    let [filters, ] = useGlobal("SideBar")
    let {property_type, category, price__gt, price__lt, location, amenities, currency} = filters
    let amenity_ids = JSON.stringify(amenities.selected.map(amenity => amenity.id))
    let fetchProperties = () => {
        return fetch(`${API_URL}/${property_type}/?
           query={
            id,
            category,
            price,
            pictures{
                src,
                is_main
            },
            currency,
            location,
            rating,
            payment_terms,
            unit_of_payment_terms
        }&category=${category}&price__gt=${price__gt}&price__lt=${price__lt}&currency=${currency||""}&loc=${location}&amenities__contains=${amenity_ids}&format=json`
        )
        .then(res => res.json())
        .then(res => res.results)
        .catch(error => console.log(error))
    }

    return (
        <Fetcher action={fetchProperties} placeholder={Loader()}>{properties => {
            return (
                <div>
                    <PropertyGroup header="Filter Results.." properties={properties} />
                </div>
            );
        }}</Fetcher>
    );
}


function Search(props) {
    let location = props.location.search.slice(3)
    let fetchProperties = () => {
        return fetch(`${API_URL}/room/?
           query={
            id,
            category,
            price,
            pictures{
                src,
                is_main
            },
            currency,
            location,
            rating,
            payment_terms,
            unit_of_payment_terms
        }&loc=${location}&format=json`
        )
        .then(res => res.json())
        .then(res => res.results)
        .catch(error => console.log(error))
    }

    return (
        <Fetcher action={fetchProperties} placeholder={Loader()}>{properties => {
            return (
                <div>
                    <PropertyGroup header="Search Results.." properties={properties} />
                </div>
            );
        }}</Fetcher>
    );
}


function Feeds(props) {

    let fetchProperties = () => {
        return fetch(`${API_URL}/room/?
           query={
            id,
            category,
            price,
            pictures{
                src,
                is_main
            },
            currency,
            location,
            rating,
            payment_terms,
            unit_of_payment_terms
            }&format=json`
        )
        .then(res => res.json())
        .then(res => res.results)
        .catch(error => console.log(error))
    }

    return (
        <Fetcher action={fetchProperties} placeholder={Loader()}>{properties => {
            return (
                <div>
                    <PropertyGroup header="Rent a place" properties={properties} />
                    <PropertyGroup header="Buy a place" properties={properties} />
                </div>
            );
        }}</Fetcher>
    );
}

function scrollUp(event) {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

function Home(props) {
    let [scrollY, setScrollY] = useState(0);

    window.onscroll = () => {
        //setScrollY(window.scrollY);
    }

    return (
        <div class="container-fluid">
            <TopBar />

            <div class="row contents">
                <LogIn />
                <SignUp />
                <SideBar setting="sidebar-lg sticky-top d-none d-lg-block col-12 col-lg-2 pt-3" />

                <Route exact path="/filter" render={() => {
                    return <SideBar setting="d-relative d-lg-none col-12 bg-white mt-4 pb-4" />
                }} />

                <div class="row contents-body col-12 col-lg-10 px-2 px-sm-3 py-2 py-lg-3 m-0">
                    <Route exact path="/" render={() => {
                        return <Feeds />;
                    }} />

                    <Route exact path="/ft" component={Filter} />

                    <Route exact path="/search/" component={Search}/>

                    <Route exact path="/property/:id" render={({ match }) => {
                        return <PropertyDetails property={match.params.id} />
                    }} />

                    <Route exact path="/upload-property" component={UploadProperty} />
                    <Route exact path="/edit-property/:id" render={({ match }) => {
                        return <EditProperty id={match.params.id} />
                    }} />
                </div>
            </div>

            <div class="footer row bg-light">
                {scrollY > 100  ?
                    <div class="scroll-up click-effect d-lg-none">
                        <img src="icons/up-arrow.svg" onClick={scrollUp} width="30" height="30" alt="" />
                    </div> :
                    null
                }
            </div>

        </div>
    );
}

export { Home };
