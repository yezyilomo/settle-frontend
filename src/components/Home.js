import React from 'react';
import './Home.css';
import {
    GenericFilter, GlowBlockLoader, GlowPageLoader, renderPageError,
    renderInlineError, TwoRowsPropertiesGroup, SliderPropertiesGroup,
    PROPERTIES_QUERY_PARAM
} from './';
import { usePageTransition, useRestoreScrollState, useUserLocation } from '../hooks';


function NearByProperties(props) {
    const { location } = useUserLocation();
    if(location === null){
        return null;
    }

    const nearbyPropertiesEndpoint = `
    nearby-properties/?${PROPERTIES_QUERY_PARAM}
    &longitude=${location.coords.longitude}
    &latitude=${location.coords.latitude}
    &radius_to_scan=5000
    `
    return (
        <GenericFilter endpoint={nearbyPropertiesEndpoint} global selection="userNearbyProperties"
            placeholder={<GlowBlockLoader />} onError={renderInlineError}>{response => {
                let data = response.data[0];
                if (data.results.length < 3) {
                    return null;
                }
                return (
                    <div class="p-0 m-0 mt-4">
                        <SliderPropertiesGroup header="Nearby Properties" response={response} />
                    </div>
                );
            }}
        </GenericFilter>
    );
}


function Home(props) {
    useRestoreScrollState();
    const animate = usePageTransition()

    const proertiesToRentEndpoint = `properties/?${PROPERTIES_QUERY_PARAM}&available_for=rent`
    const propertiesToBuyEndpoint = `properties/?${PROPERTIES_QUERY_PARAM}&available_for=sale`
    const propertiesToSlideEndpoint = `properties/?${PROPERTIES_QUERY_PARAM}&price__lt=800000`

    return (
        <GenericFilter endpoint={proertiesToRentEndpoint} global selection="propertiesToRent"
            placeholder={<GlowPageLoader />} onError={renderPageError}>{response => {
                let properties = response.data[0];
                let footer = `Show all (${properties.count}+)`;
                let footerLink = "/explore/rent-properties/";
                return (
                    <div class={`${animate()}`}>
                        <div class="p-0 m-0 px-1 px-sm-3 mt-2 mt-md-3">
                            <TwoRowsPropertiesGroup header="Rent a place" properties={properties}
                                footer={footer} footerLink={footerLink} />
                        </div>

                        <GenericFilter endpoint={propertiesToSlideEndpoint} global selection="propertiesToSlide"
                            placeholder={<GlowBlockLoader />} onError={renderInlineError}>{response => {
                                return (
                                    <div class="p-0 m-0 mt-4">
                                        <SliderPropertiesGroup header="Amazing Places" response={response} />
                                    </div>
                                );
                            }}
                        </GenericFilter>

                        <GenericFilter endpoint={propertiesToBuyEndpoint} global selection="propertiesToBuy"
                            placeholder={<GlowBlockLoader />} onError={renderInlineError}>{response => {
                                let properties = response.data[0];
                                let footer = `Show all (${properties.count}+)`;
                                let footerLink = "/explore/buy-properties/";
                                return (
                                    <div class="p-0 m-0 px-1 px-sm-3 mt-4">
                                        <TwoRowsPropertiesGroup header="Buy a place" properties={properties}
                                            footer={footer} footerLink={footerLink} />
                                    </div>
                                );
                            }}
                        </GenericFilter>

                        <NearByProperties/>
                    </div>
                );
            }}
        </GenericFilter>
    );
}

export { Home }
