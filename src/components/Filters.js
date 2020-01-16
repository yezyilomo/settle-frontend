import React from 'react';
import { useGlobalState } from 'simple-react-state';
import {
    LocalFetcher, GlobalFetcher, Loader, PageError,
    PropertyOverview, GenericResourcesGroup
} from '.';
import { API_URL } from '..';
import { useRestoreScrollState } from '../hooks';
import { getPropertyRoute } from '../utils';


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


function PropertiesFilter(props) {
    let [filters, ] = useGlobalState("sideBar");
    let {property_type, available_for, price__gt, price__lt, location, amenities, currency} = filters
    let amenity_ids = JSON.stringify(amenities)
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

    return (
        <GenericFilter endpoint={endpoint} placeholder={<Loader/>} error={<PageError/>}>
            {(properties, fetchMoreProperties) => {
                let header = `Filter results(${properties.count})..`
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


function EndpointPropertiesFilter(props) {
    return (
        <GenericFilter endpoint={props.endpoint} placeholder={<Loader/>} error={<PageError/>}>
            {(properties, fetchMoreProperties) => {
                return (
                    <div class="p-0 m-0 px-1 px-sm-3 mt-2 mt-md-3">
                        <GenericResourcesGroup header={props.header} resources={properties} onScrollToBottom={fetchMoreProperties}>
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


function SearchProperties(props) {
    useRestoreScrollState();
    let location = props.location.search.slice(3)
    let selection = props.location.pathname + props.location.search
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
    }&search=${location}&format=json`

    return (
        <GenericFilter endpoint={endpoint} global selection={selection}
        placeholder={<Loader/>} error={<PageError/>}>
            {(properties, fetchMoreProperties) => {
                let header = `Search results(${properties.count})..`
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


function FilterPropertiesByCategory(props) {
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
    }&available_for=${props.availableFor}&format=json`
    return (
        <GenericFilter endpoint={endpoint} placeholder={<Loader/>} error={<PageError/>}>
            {(properties, fetchMoreProperties) => {
                return (
                    <div class="p-0 m-0 px-1 px-sm-3 mt-2 mt-md-3">
                        <GenericResourcesGroup header={props.header} resources={properties} onScrollToBottom={fetchMoreProperties}>
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


function UserProperties(props) {
    useRestoreScrollState();
    const [user, ] = useGlobalState("user");
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
    }&owner=${user.id}&format=json`

    return (
        <GenericFilter endpoint={endpoint} global selection={`my-${getPropertyRoute(props.type)}`}
        placeholder={<Loader/>} error={<PageError/>}>
            {(properties, fetchMoreProperties) => {
                let header = `My properties(${properties.count})..`
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


function ShowGroupProperties(props) {
    let endpoint = props.location.state.endpoint
    let header = props.location.state.header
    return (
        <>
          {endpoint ?
              <EndpointPropertiesFilter endpoint={endpoint} header={header}/>:
              null
          }
        </>
    );
}


export {
    GenericFilter ,PropertiesFilter, SearchProperties, ShowGroupProperties,
    FilterPropertiesByCategory, UserProperties, EndpointPropertiesFilter
}
