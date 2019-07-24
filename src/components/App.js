import React, { } from 'react';
import { Route, Switch } from 'react-router-dom';
import { setGlobal } from 'reactn'
import './App.css';
import {getCookie} from '../utils';
import {
    SideBar, TopBar, PropertyDetails, UploadProperty,
    LogIn, SignUp, EditProperty, PropertyFilter,
    UserProperties, SearchProperties, Home, BottomNavBar,
    FilterProperties, TopScroller, PageNotFound, Menu
} from './'


let isLoggedIn = false;
let authToken = getCookie("auth_token");
let id= getCookie("id");
let username = getCookie("usernamen");
let email = getCookie("email");

if(authToken !== null){
    isLoggedIn = true;
}

setGlobal({
    User: {
        isLoggedIn: isLoggedIn,
        authToken: authToken,
        id: id,
        email: email,
        username: username
    }
})

function App(props) {

    return (
        <div class="container-fluid">
            <TopBar />

            <div class="row contents">
                <LogIn />
                <SignUp />
                <SideBar setting="sidebar-lg sticky-top d-none d-lg-block col-12 col-lg-2 pt-3" />

                <div class="row contents-body col-12 col-lg-10 px-2 px-sm-3 py-2 py-lg-3 m-0 mb-5">
                    <Switch>
                        <Route exact path="/filter" render={() => {
                            return <SideBar setting="sidebar-sm d-relative d-lg-none col-12 pb-4" />
                        }} />

                        <Route exact path="/" render={() => {
                            return <Home />;
                        }} />

                        <Route exact path="/menu" render={()=>{
                            return (
                                <nav class="navbar col-12 navbar-light p-0 m-0 d-block d-lg-none">
                                    <div class="navbar-collapse m-0 p-0" id="navbarTogglerDemo03">
                                        <Menu/>
                                    </div>
                                </nav>
                            )
                        }} />

                        <Route exact path="/ft" component={PropertyFilter} />

                        <Route exact path="/search/" component={SearchProperties}/>

                        <Route exact path="/rent-property" render={() => {
                            return <FilterProperties category="rent" header="Properties Available For Rent"/>;
                        }} />

                        <Route exact path="/buy-property" render={() => {
                            return <FilterProperties category="sale" header="Properties Available For Sale"/>;
                        }} />

                        <Route exact path="/book-property" render={() => {
                            return <FilterProperties category="book" header="Properties Available For Booking"/>;
                        }} />

                        <Route exact path="/property/:id" render={({ match, location }) => {
                            return <PropertyDetails property={match.params.id} edit={location.edit}/>
                        }} />

                        <Route exact path="/upload-property" component={UploadProperty} />
                        <Route exact path="/my-properties" component={UserProperties} />
                        <Route exact path="/edit-property/:id" render={({ match }) => {
                            return <EditProperty id={match.params.id} />
                        }} />
                        <Route component={PageNotFound} />
                    </Switch>
                </div>
            </div>

            <BottomNavBar/>
            <TopScroller/>

        </div>
    );
}

export { App };
