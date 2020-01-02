import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import {
    SideBar, TopBar, PropertyDetails, UploadProperty,
    EditProperty, PropertiesFilter, UserProperties, 
    SearchProperties, Home, BottomNavBar, TopScroller, 
    PageNotFound, ShowGroupProperties, FilterPropertiesByCategory,
} from './';


function App(props) {

    return (
        <div class="container-fluid">
            <TopBar/>
            <div class="row contents">
                <SideBar setting="sidebar-lg sticky-top d-none d-lg-block col-12 col-lg-2 pt-3" />

                <div class="contents-body col-12 col-lg-10 p-0 m-0 mb-5 pb-5">
                    <Switch>
                        <Route exact path="/" render={() => {
                            return <Home/>;
                        }} />


                        <Route exact path="/rooms/" render={() => {
                            return <UserProperties type="rooms"/>
                        }} />
                        <Route exact path="/rooms/:id/" render={({ match }) => {
                            return <PropertyDetails type="rooms" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/rooms/" render={() => {
                            return <UploadProperty type="rooms"/>
                        }} />
                        <Route exact path="/edit/rooms/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="rooms" />
                        }} />


                        <Route exact path="/houses/" render={() => {
                            return <UserProperties type="houses"/>
                        }} />
                        <Route exact path="/houses/:id/" render={({ match }) => {
                            return <PropertyDetails type="houses" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/houses/" render={() => {
                            return <UploadProperty type="houses"/>
                        }} />
                        <Route exact path="/edit/houses/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="houses"/>
                        }} />


                        <Route exact path="/apartments/" render={() => {
                            return <UserProperties type="apartments"/>
                        }} />
                        <Route exact path="/apartments/:id/" render={({ match }) => {
                            return <PropertyDetails type="apartments" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/apartments/" render={() => {
                            return <UploadProperty type="apartments"/>
                        }} />
                        <Route exact path="/edit/apartments/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="apartments"/>
                        }} />


                        <Route exact path="/lands/" render={() => {
                            return <UserProperties type="lands"/>
                        }} />
                        <Route exact path="/lands/:id/" render={({ match }) => {
                            return <PropertyDetails type="lands" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/lands/" render={() => {
                            return <UploadProperty type="lands"/>
                        }} />
                        <Route exact path="/edit/lands/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="lands"/>
                        }} />


                        <Route exact path="/frames/" render={() => {
                            return <UserProperties type="frames"/>
                        }} />
                        <Route exact path="/frames/:id/" render={({ match }) => {
                            return <PropertyDetails type="frames" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/frames/" render={() => {
                            return <UploadProperty type="frames"/>
                        }} />
                        <Route exact path="/edit/frames/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="frames"/>
                        }} />


                        <Route exact path="/offices/" render={() => {
                            return <UserProperties type="offices"/>
                        }} />
                        <Route exact path="/offices/:id/" render={({ match }) => {
                            return <PropertyDetails type="offices" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/offices/" render={() => {
                            return <UploadProperty type="offices"/>
                        }} />
                        <Route exact path="/edit/offices/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="offices"/>
                        }} />


                        <Route exact path="/halls/" render={() => {
                            return <UserProperties type="halls"/>
                        }} />
                        <Route exact path="/halls/:id/" render={({ match }) => {
                            return <PropertyDetails type="halls" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/halls/" render={() => {
                            return <UploadProperty type="halls"/>
                        }} />
                        <Route exact path="/edit/halls/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="halls"/>
                        }} />


                        <Route exact path="/hostels/" render={() => {
                            return <UserProperties type="hostels"/>
                        }} />
                        <Route exact path="/hostels/:id/" render={({ match }) => {
                            return <PropertyDetails type="hostels" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/hostels/" render={() => {
                            return <UploadProperty type="hostels"/>
                        }} />
                        <Route exact path="/edit/hostels/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="hostels"/>
                        }} />


                        <Route exact path="/properties/" render={() => {
                            return <UserProperties type="properties"/>
                        }} />
                        <Route exact path="/properties/:id/" render={({ match }) => {
                            return <PropertyDetails type="properties" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/properties/" render={() => {
                            return <UploadProperty type="properties"/>
                        }} />
                        <Route exact path="/edit/properties/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="properties"/>
                        }} />


                        <Route exact path="/ft" component={PropertiesFilter}/>
                        <Route exact path="/filter" render={() => {
                            return <SideBar setting="sidebar-sm px-2 d-relative d-lg-none col-12 pb-4" />
                        }} />
                        <Route exact path="/search/" component={SearchProperties}/>
                        <Route exact path="/group-properties/" component={ShowGroupProperties}/>


                        <Route exact path="/rent-property" render={() => {
                            return <FilterPropertiesByCategory category="rent" header="Properties available for rent"/>;
                        }} />
                        <Route exact path="/buy-property" render={() => {
                            return <FilterPropertiesByCategory category="sale" header="Properties available for sale"/>;
                        }} />
                        <Route exact path="/book-property" render={() => {
                            return <FilterPropertiesByCategory category="book" header="Properties available for booking"/>;
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
