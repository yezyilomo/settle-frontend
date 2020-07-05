import React from 'react';
import './Home.css';
import {
    GenericFilter, PageError, GlowInlineLoader, GlowPageLoader,
    TwoRowsPropertiesGroup, SliderPropertiesGroup, PROPERTIES_QUERY_PARAM
} from './';
import { useRestoreScrollState } from '../hooks';


function Home(props) {
    useRestoreScrollState()
    const proertiesToRentEndpoint = `properties/?${PROPERTIES_QUERY_PARAM}&available_for=rent`
    const propertiesToBuyEndpoint = `properties/?${PROPERTIES_QUERY_PARAM}&available_for=sale`
    const propertiesToSlideEndpoint = `properties/?${PROPERTIES_QUERY_PARAM}&price__lt=800000`

    return (
        <GenericFilter endpoint={proertiesToRentEndpoint} global selection="propertiesToRent"
            placeholder={<GlowPageLoader />} error={<PageError />}>{properties => {
                let footer = `Show all (${properties.count}+)`;
                let footerLink = "/explore/rent-properties/";
                return (
                    <>
                        <div class="p-0 m-0 px-1 px-sm-3 mt-2 mt-md-3">
                            <TwoRowsPropertiesGroup header="Rent a place" properties={properties}
                                footer={footer} footerLink={footerLink} />
                        </div>

                        <GenericFilter endpoint={propertiesToSlideEndpoint} global selection="propertiesToSlide"
                            placeholder={<GlowInlineLoader />} error={<PageError />}>{properties => {
                                return (
                                    <div class="p-0 m-0 mt-4">
                                        <SliderPropertiesGroup header="Amazing Places" properties={properties} />
                                    </div>
                                );
                            }}
                        </GenericFilter>

                        <GenericFilter endpoint={propertiesToBuyEndpoint} global selection="propertiesToBuy"
                            placeholder={<GlowInlineLoader />} error={<PageError />}>{properties => {
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
                    </>
                );
            }}
        </GenericFilter>
    );
}

export { Home }
