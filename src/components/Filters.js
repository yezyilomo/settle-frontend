import React from 'react';
import { useGlobalState } from 'state-pool';
import {
    PaginatedDataFetcher, GlowPageLoader, renderPageError,
    PropertyOverview, GenericResourcesGroup
} from '.';
import { BASE_API_URL } from '../';
import { getPropertyRoute, capitalizeFirst } from '../utils';


function GenericFilter(props) {
    let endpoint = props.endpoint.replace(/[\n ]/g, "");

    const [user,] = useGlobalState("user");

    const headers = {
        "Content-Type": "application/json",
    }

    if (user.isLoggedIn) {
        headers["Authorization"] = `Token ${user.auth_token}`
    }

    const reqHeaders = {
        headers: headers
    }

    let fetchResources = (key, cursor = `${BASE_API_URL}/${endpoint}`) => {
        return fetch(cursor, { ...reqHeaders, ...props.fetchConfig, }).then(res => res.json())
    }

    return (
        <PaginatedDataFetcher
            action={fetchResources}
            placeholder={props.placeholder}
            error={props.error}
            onError={props.onError}
            selection={props.selection}>
            {(response) => {
                return props.children(response);
            }}
        </PaginatedDataFetcher>
    );
}


function EndpointPropertiesFilter(props) {
    return (
        <GenericFilter placeholder={<GlowPageLoader/>} onError={renderPageError} {...props}>
            {(response) => {
                let header = "";
                if (typeof(props.header) == "function"){
                    header = props.header(response.data[0]);
                }
                else{
                    header = props.header;
                }
                return (
                    <div class="p-0 m-0 px-1 px-sm-3 mt-2 mt-md-3">
                        <GenericResourcesGroup
                            viewKey={props.viewKey}
                            header={header}
                            response={response}
                            FetchMoreOnScrollToBottom>
                            {property =>
                                <PropertyOverview property={property} />
                            }
                        </GenericResourcesGroup>
                    </div>
                );
            }}
        </GenericFilter>
    );
}


const PROPERTIES_QUERY_PARAM = `
query={
    id,
    available_for,
    price,
    price_rate_unit,
    type,
    pictures{
        src,
        is_main
    },
    currency,
    location,
    rating,
    is_my_favourite
}&format=json`


function PropertiesFilter(props) {
    const [filters, ] = useGlobalState("sideBar");
    let {property_type, available_for, price__gt, price__lt, location, amenities, currency} = filters;
    let amenity_ids = JSON.stringify(amenities.map(amenity => amenity.value));
    let header = (properties) => `Filter results(${properties.count})..`;
    let viewKey = "propertiesFilterView";
    let endpoint = `${property_type}/?${PROPERTIES_QUERY_PARAM}
    &available_for=${available_for}
    &price__gt=${price__gt}
    &price__lt=${price__lt}
    &currency=${currency||""}
    &search=${location}
    &amenities__contains=${amenity_ids}`

    return <EndpointPropertiesFilter selection={endpoint} viewKey={viewKey} endpoint={endpoint} header={header}/>;
}


function SearchProperties(props) {
    let location = props.location.search.slice(3);
    let selection = props.location.pathname + props.location.search;
    let header = (properties) => `Search results(${properties.count})..`;
    let endpoint = `properties/?${PROPERTIES_QUERY_PARAM}&search=${location}`;
    let viewKey = "searchPropertiesView";

    return <EndpointPropertiesFilter viewKey={viewKey} selection={selection} endpoint={endpoint} header={header}/>;
}


function FilterPropertiesByCategory(props) {
    let endpoint = `properties/?${PROPERTIES_QUERY_PARAM}&available_for=${props.availableFor}`;
    let viewKey = `propertiesAvailableFor${capitalizeFirst(props.availableFor)}ViewKey`;
    return <EndpointPropertiesFilter viewKey={viewKey} endpoint={endpoint} {...props}/>;
}


function UserFavProperties(props) {
    let selection = `my-fav-properties`;
    let header = (properties) => `Saved properties(${properties.count})..`;
    let endpoint = `my-fav-properties/?${PROPERTIES_QUERY_PARAM}`;
    let viewKey = "myFavPropertiesView";

    return <EndpointPropertiesFilter viewKey={viewKey} selection={selection} endpoint={endpoint} header={header}/>;
}


function UserProperties(props) {
    const [user, ] = useGlobalState("user");
    let selection = `myProperties.${getPropertyRoute(props.type)}`;
    let header = (properties) => `My properties(${properties.count})..`;
    let endpoint = `${getPropertyRoute(props.type)}/?${PROPERTIES_QUERY_PARAM}&owner=${user.id}`;
    let viewKey = "userPropertiesView";

    return <EndpointPropertiesFilter viewKey={viewKey} selection={selection} endpoint={endpoint} header={header}/>;
}


function ShowRentProperties(props){
    let header = "Properties available for rent";
    let selection = "explore/rent-properties";
    let endpoint = `properties/?${PROPERTIES_QUERY_PARAM}&available_for=rent`;
    let viewKey = "explore/rent-propertiesView";

    return <EndpointPropertiesFilter viewKey={viewKey} selection={selection} endpoint={endpoint} header={header}/>;
}


function ShowBuyProperties(props){
    let header = "Properties available for sale";
    let selection = "explore/buy-properties";
    let endpoint = `properties/?${PROPERTIES_QUERY_PARAM}&available_for=sale`;
    let viewKey = "explore/buy-propertiesView";

    return <EndpointPropertiesFilter viewKey={viewKey} selection={selection} endpoint={endpoint} header={header}/>;
}


export {
    GenericFilter ,PropertiesFilter, SearchProperties, EndpointPropertiesFilter,
    FilterPropertiesByCategory, UserProperties, ShowRentProperties, ShowBuyProperties,
    UserFavProperties, PROPERTIES_QUERY_PARAM
}
