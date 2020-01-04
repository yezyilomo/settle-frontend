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
                            return <UserProperties type="room"/>
                        }} />
                        <Route exact path="/rooms/:id/" render={({ match }) => {
                            return <PropertyDetails type="room" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/rooms/" render={() => {
                            return <UploadProperty type="room"/>
                        }} />
                        <Route exact path="/edit/rooms/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="room"/>
                        }} />


                        <Route exact path="/houses/" render={() => {
                            return <UserProperties type="house"/>
                        }} />
                        <Route exact path="/houses/:id/" render={({ match }) => {
                            return <PropertyDetails type="house" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/houses/" render={() => {
                            return <UploadProperty type="house"/>
                        }} />
                        <Route exact path="/edit/houses/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="house"/>
                        }} />


                        <Route exact path="/apartments/" render={() => {
                            return <UserProperties type="apartment"/>
                        }} />
                        <Route exact path="/apartments/:id/" render={({ match }) => {
                            return <PropertyDetails type="apartment" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/apartments/" render={() => {
                            return <UploadProperty type="apartment"/>
                        }} />
                        <Route exact path="/edit/apartments/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="apartment"/>
                        }} />


                        <Route exact path="/lands/" render={() => {
                            return <UserProperties type="land"/>
                        }} />
                        <Route exact path="/lands/:id/" render={({ match }) => {
                            return <PropertyDetails type="land" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/lands/" render={() => {
                            return <UploadProperty type="land"/>
                        }} />
                        <Route exact path="/edit/lands/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="land"/>
                        }} />


                        <Route exact path="/frames/" render={() => {
                            return <UserProperties type="frame"/>
                        }} />
                        <Route exact path="/frames/:id/" render={({ match }) => {
                            return <PropertyDetails type="frame" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/frames/" render={() => {
                            return <UploadProperty type="frame"/>
                        }} />
                        <Route exact path="/edit/frames/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="frame"/>
                        }} />


                        <Route exact path="/offices/" render={() => {
                            return <UserProperties type="office"/>
                        }} />
                        <Route exact path="/offices/:id/" render={({ match }) => {
                            return <PropertyDetails type="office" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/offices/" render={() => {
                            return <UploadProperty type="office"/>
                        }} />
                        <Route exact path="/edit/offices/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="office"/>
                        }} />


                        <Route exact path="/halls/" render={() => {
                            return <UserProperties type="hall"/>
                        }} />
                        <Route exact path="/halls/:id/" render={({ match }) => {
                            return <PropertyDetails type="hall" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/halls/" render={() => {
                            return <UploadProperty type="hall"/>
                        }} />
                        <Route exact path="/edit/halls/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="hall"/>
                        }} />


                        <Route exact path="/hostels/" render={() => {
                            return <UserProperties type="hostel"/>
                        }} />
                        <Route exact path="/hostels/:id/" render={({ match }) => {
                            return <PropertyDetails type="hostel" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/hostels/" render={() => {
                            return <UploadProperty type="hostel"/>
                        }} />
                        <Route exact path="/edit/hostels/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="hostel"/>
                        }} />


                        <Route exact path="/properties/" render={() => {
                            return <UserProperties type="generic"/>
                        }} />
                        <Route exact path="/properties/:id/" render={({ match }) => {
                            return <PropertyDetails type="generic" id={match.params.id}/>
                        }} />
                        <Route exact path="/create/properties/" render={() => {
                            return <UploadProperty type="generic"/>
                        }} />
                        <Route exact path="/edit/properties/:id/" render={({ match }) => {
                            return <EditProperty id={match.params.id} type="generic"/>
                        }} />


                        <Route exact path="/ft" component={PropertiesFilter}/>
                        <Route exact path="/filter" render={() => {
                            return <SideBar setting="sidebar-sm px-2 d-relative d-lg-none col-12 pb-4" />
                        }} />
                        <Route exact path="/search/" component={SearchProperties}/>
                        <Route exact path="/group-properties/" component={ShowGroupProperties}/>


                        <Route exact path="/rent-property" render={() => {
                            return <FilterPropertiesByCategory availableFor="rent" header="Properties available for rent"/>;
                        }} />
                        <Route exact path="/buy-property" render={() => {
                            return <FilterPropertiesByCategory availableFor="sale" header="Properties available for sale"/>;
                        }} />
                        <Route exact path="/book-property" render={() => {
                            return <FilterPropertiesByCategory availableFor="book" header="Properties available for booking"/>;
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
