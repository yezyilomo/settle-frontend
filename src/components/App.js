import React from 'react';
import './App.css';
import { Route, Switch, useLocation } from 'react-router-dom';
import {
    SideBar, TopBar, PropertyDetails, RoomDetails, HouseDetails,
    ApartmentDetails, HostelDetails, OfficeDetails, LandDetails, 
    FrameDetails, UploadProperty, UploadRoom, UploadHouse, UploadApartment,
    UploadHostel, UploadOffice, UploadLand, UploadFrame, EditProperty,
    EditRoom, EditHouse, EditApartment, EditHostel, EditOffice, EditLand,
    EditFrame, PropertiesFilter, UserProperties, SearchProperties,
    Home, BottomNavBar, TopScroller, PageNotFound, AddToHomeScreen,
    FilterPropertiesByCategory, ShowBuyProperties, ShowRentProperties,
    EditProfile, UserFavProperties
} from './';


function App(props) {
    const location = useLocation();

    return (
        <div class="container-fluid">
            <TopBar />
            <div class="row contents">
                <SideBar setting="sidebar-lg sticky-top d-none d-lg-block col-lg-2 pt-2" />

                <div class="contents-body col-12 col-lg-10 p-0 m-0 mb-5 pb-5">
                    <Switch location={location}>
                        <Route exact path="/" render={({ match }) => {
                            return <Home key={match.path} />;
                        }} />


                        <Route exact path="/rooms/" render={() => {
                            return <UserProperties type="room" />
                        }} />
                        <Route exact path="/rooms/:id/" render={({ match }) => {
                            return <RoomDetails id={match.params.id} />
                        }} />
                        <Route exact path="/create/rooms/" render={() => {
                            return <UploadRoom type="room" />
                        }} />
                        <Route exact path="/edit/rooms/:id/" render={({ match }) => {
                            return <EditRoom id={match.params.id} type="room" />
                        }} />


                        <Route exact path="/houses/" render={() => {
                            return <UserProperties type="house" />
                        }} />
                        <Route exact path="/houses/:id/" render={({ match }) => {
                            return <HouseDetails id={match.params.id} />
                        }} />
                        <Route exact path="/create/houses/" render={() => {
                            return <UploadHouse type="house" />
                        }} />
                        <Route exact path="/edit/houses/:id/" render={({ match }) => {
                            return <EditHouse id={match.params.id} type="house" />
                        }} />


                        <Route exact path="/apartments/" render={() => {
                            return <UserProperties type="apartment" />
                        }} />
                        <Route exact path="/apartments/:id/" render={({ match }) => {
                            return <ApartmentDetails id={match.params.id} />
                        }} />
                        <Route exact path="/create/apartments/" render={() => {
                            return <UploadApartment type="apartment" />
                        }} />
                        <Route exact path="/edit/apartments/:id/" render={({ match }) => {
                            return <EditApartment id={match.params.id} type="apartment" />
                        }} />


                        <Route exact path="/lands/" render={() => {
                            return <UserProperties type="land" />
                        }} />
                        <Route exact path="/lands/:id/" render={({ match }) => {
                            return <LandDetails id={match.params.id} />
                        }} />
                        <Route exact path="/create/lands/" render={() => {
                            return <UploadLand type="land" />
                        }} />
                        <Route exact path="/edit/lands/:id/" render={({ match }) => {
                            return <EditLand id={match.params.id} type="land" />
                        }} />


                        <Route exact path="/frames/" render={() => {
                            return <UserProperties type="frame" />
                        }} />
                        <Route exact path="/frames/:id/" render={({ match }) => {
                            return <FrameDetails id={match.params.id} />
                        }} />
                        <Route exact path="/create/frames/" render={() => {
                            return <UploadFrame type="frame" />
                        }} />
                        <Route exact path="/edit/frames/:id/" render={({ match }) => {
                            return <EditFrame id={match.params.id} type="frame" />
                        }} />


                        <Route exact path="/offices/" render={() => {
                            return <UserProperties type="office" />
                        }} />
                        <Route exact path="/offices/:id/" render={({ match }) => {
                            return <OfficeDetails id={match.params.id} />
                        }} />
                        <Route exact path="/create/offices/" render={() => {
                            return <UploadOffice type="office" />
                        }} />
                        <Route exact path="/edit/offices/:id/" render={({ match }) => {
                            return <EditOffice id={match.params.id} type="office" />
                        }} />


                        <Route exact path="/hostels/" render={() => {
                            return <UserProperties type="hostel" />
                        }} />
                        <Route exact path="/hostels/:id/" render={({ match }) => {
                            return <HostelDetails id={match.params.id} />
                        }} />
                        <Route exact path="/create/hostels/" render={() => {
                            return <UploadHostel type="hostel" />
                        }} />
                        <Route exact path="/edit/hostels/:id/" render={({ match }) => {
                            return <EditHostel id={match.params.id} type="hostel" />
                        }} />


                        <Route exact path="/properties/" render={() => {
                            return <UserProperties type="generic" />
                        }} />
                        <Route exact path="/properties/:id/" render={({ match }) => {
                            return <PropertyDetails key={match.path} type="generic" id={match.params.id} />
                        }} />
                        <Route exact path="/create/properties/" render={({ match }) => {
                            return <UploadProperty key={match.path} type="generic" />
                        }} />
                        <Route exact path="/edit/properties/:id/" render={({ match }) => {
                            return <EditProperty key={match.path} id={match.params.id} type="generic" />
                        }} />


                        <Route exact path="/edit-profile" component={EditProfile} />


                        <Route exact path="/ft" component={PropertiesFilter} />
                        <Route exact path="/filter" render={({ match }) => {
                            return <SideBar key={match.path} setting="sidebar-sm px-2 d-relative d-lg-none col-12 pb-4" />
                        }} />
                        <Route exact path="/search/" component={SearchProperties} />

                        <Route exact path="/explore/rent-properties" component={ShowRentProperties} />
                        <Route exact path="/explore/buy-properties" component={ShowBuyProperties} />

                        <Route exact path="/rent-property" render={({ match }) => {
                            return <FilterPropertiesByCategory key={match.path}  global selection={match.path} 
                                    availableFor="rent" header="Properties available for rent" />;
                        }} />
                        <Route exact path="/buy-property" render={({ match }) => {
                            return <FilterPropertiesByCategory key={match.path}  global selection={match.path} 
                                    availableFor="sale" header="Properties available for sale" />;
                        }} />
                        <Route exact path="/my-fav-properties" render={({ match }) => {
                            return <UserFavProperties key={match.path} />;
                        }} />


                        <Route component={PageNotFound} />
                    </Switch>
                </div>
            </div>

            <BottomNavBar />
            <TopScroller />
            <AddToHomeScreen />
        </div>
    );
}

export { App };
