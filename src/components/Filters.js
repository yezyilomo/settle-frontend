import React from 'react';
import { useGlobalState } from 'simple-react-state';
import {
    LocalFetcher, GlobalFetcher, GlowPageLoader, PageError,
    PropertyOverview, GenericResourcesGroup
} from '.';
import { API_URL } from '..';
import { useRestoreScrollState } from '../hooks';
import { getPropertyRoute } from '../utils';
import store from '../store';


function GenericFilter(props) {
    let endpoint = props.endpoint.replace(/[\n ]/g, "");
    let fetchResources = () => {
        return fetch(`${API_URL}/${endpoint}`)
        .then(res => res.json())
    }

    let getMoreResourcesFetcher = (updateResources) => {
        let updateData = (data, currentResources) => {
            data.results = [...currentResources.results, ...data.results];
            updateResources({
                value: data
            })
        }

        let fetchMoreResources = (currentResources) => {
            fetch(currentResources.next)
            .then(res => res.json())
            .then(data => updateData(data, currentResources))
        }
        return fetchMoreResources
    }

    if(props.global){
        return (
            <GlobalFetcher action={fetchResources} placeholder={props.placeholder} 
            error={props.error} selection={props.selection}>
                {(resources, updateResources) => {
                    let fetchMoreResources = getMoreResourcesFetcher(updateResources);
                    return props.children(resources, fetchMoreResources)
                }}
            </GlobalFetcher>
        );
    }
    
    return (
        <LocalFetcher action={fetchResources} placeholder={props.placeholder} error={props.error}>
            {(resources, updateResources) => {
                let fetchMoreResources = getMoreResourcesFetcher(updateResources);
                return props.children(resources, fetchMoreResources)
            }}
        </LocalFetcher>
    );
}


function EndpointPropertiesFilter(props) {
    return (
        <GenericFilter placeholder={<GlowPageLoader/>} error={<PageError/>} {...props}>
            {(properties, fetchMoreProperties) => {
                let header = "";
                if (typeof(props.header) == "function"){
                    header = props.header(properties);
                }
                else{
                    header = props.header;
                }
                return (
                    <div class="p-0 m-0 px-1 px-sm-3 mt-2 mt-md-3">
                        <GenericResourcesGroup header={header} resources={properties} onScrollToBottom={fetchMoreProperties}>
                            {property => 
                                <PropertyOverview property={property}/>
                            }
                        </GenericResourcesGroup>
                    </div>
                );
            }}
        </GenericFilter>
    );
}


function PropertiesFilter(props) {
    useRestoreScrollState();
    let [filters, ] = useGlobalState("sideBar");
    let {property_type, available_for, price__gt, price__lt, location, amenities, currency} = filters;
    let amenity_ids = JSON.stringify(amenities.map(amenity => amenity.value)  );
    let header = (properties) => `Filter results(${properties.count})..`;
    let endpoint = `${property_type}/?
    query={
        id,
        available_for,
        price,
        type,
        pictures{
            src,
            is_main
        },
        currency,
        location,
        rating
    }&available_for=${available_for}&price__gt=${price__gt}&
    price__lt=${price__lt}&currency=${currency||""}&
    search=${location}&amenities__contains=${amenity_ids}&format=json`

    return <EndpointPropertiesFilter endpoint={endpoint} header={header}/>;
}


function SearchProperties(props) {
    useRestoreScrollState();
    let location = props.location.search.slice(3);
    let selection = props.location.pathname + props.location.search;
    let header = (properties) => `Search results(${properties.count})..`;
    let endpoint = `properties/?
    query={
        id,
        available_for,
        price,
        type,
        pictures{
            src,
            is_main
        },
        currency,
        location,
        rating
    }&search=${location}&format=json`;

    return <EndpointPropertiesFilter global selection={selection} endpoint={endpoint} header={header}/>;
}


function FilterPropertiesByCategory(props) {
    useRestoreScrollState();
    let endpoint = `properties/?
    query={
        id,
        available_for,
        price,
        type,
        pictures{
            src,
            is_main
        },
        currency,
        location,
        rating
    }&available_for=${props.availableFor}&format=json`;

    return <EndpointPropertiesFilter endpoint={endpoint} {...props}/>;
}


store.setState({
    field: "myProperties",
    value: {}
})

function UserProperties(props) {
    useRestoreScrollState();
    const [user, ] = useGlobalState("user");
    let selection = `myProperties.${getPropertyRoute(props.type)}`;
    let header = (properties) => `My properties(${properties.count})..`;
    let endpoint = `${getPropertyRoute(props.type)}/?
    query={
        id,
        available_for,
        price,
        type,
        pictures{
            src,
            is_main
        },
        currency,
        location,
        rating
    }&owner=${user.id}&format=json`;

    return <EndpointPropertiesFilter global selection={selection} endpoint={endpoint} header={header}/>;
}


function ShowRentProperties(props){
    useRestoreScrollState();
    let header = "Properties available for rent";
    let selection = "explore/rent-properties";
    let endpoint = `properties/?
    query={
        id,
        available_for,
        price,
        type,
        pictures{
            src,
            is_main
        },
        currency,
        location,
        rating
    }&available_for=rent&format=json`;

    return <EndpointPropertiesFilter global selection={selection} endpoint={endpoint} header={header}/>;
}


function ShowBuyProperties(props){
    useRestoreScrollState();
    let header = "Properties available for sale";
    let selection = "explore/buy-properties";
    let endpoint = `properties/?
    query={
        id,
        available_for,
        price,
        type,
        pictures{
            src,
            is_main
        },
        currency,
        location,
        rating
    }&available_for=sale&format=json`;

    return <EndpointPropertiesFilter global selection={selection} endpoint={endpoint} header={header}/>;
}


export {
    GenericFilter ,PropertiesFilter, SearchProperties, EndpointPropertiesFilter,
    FilterPropertiesByCategory, UserProperties, ShowRentProperties, ShowBuyProperties
}
