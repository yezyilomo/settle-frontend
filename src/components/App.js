import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import {
    SideBar, TopBar, PropertyDetails, UploadProperty,
    EditProperty, PropertyFilter, UserProperties, 
    SearchProperties, Home, BottomNavBar, FilterProperties, 
    TopScroller, PageNotFound
} from './';


function App(props) {

    return (
        <div class="container-fluid">
            <TopBar/>
            <div class="row contents">
                <SideBar setting="sidebar-lg sticky-top d-none d-lg-block col-12 col-lg-2 pt-3" />

                <div class="contents-body col-12 col-lg-10 p-0 m-0 mb-5 pb-5">
                    <Switch>
                        <Route exact path="/filter" render={() => {
                            return <SideBar setting="sidebar-sm px-2 d-relative d-lg-none col-12 pb-4" />
                        }} />

                        <Route exact path="/" render={() => {
                            return <Home/>;
                        }} />

                        <Route exact path="/ft" component={PropertyFilter}/>

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
