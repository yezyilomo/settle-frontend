import React from 'react';
import './Home.css';
import {
    GenericFilter, PageError, GlowInlineLoader, Loader,
    TwoRowsPropertiesGroup, SliderPropertiesGroup
} from './';
import { useRestoreScrollState } from '../hooks';


function Home(props) {
    useRestoreScrollState()
    let proertiesToRentEndpoint = `properties/?
    query={
        id,
        category,
        price,
        prop_type,
        pictures{
            src,
            is_main
        },
        currency,
        location,
        rating
    }&category=rent&format=json`

    let propertiesToBuyEndpoint = `properties/?
    query={
        id,
        category,
        price,
        prop_type,
        pictures{
            src,
            is_main
        },
        currency,
        location,
        rating
    }&category=sale&format=json`

    let propertiesToSlideEndpoint = `properties/?
    query={
        id,
        category,
        price,
        prop_type,
        pictures{
            src,
            is_main
        },
        currency,
        location,
        rating
    }&format=json&price__lt=800000`

    return (
        <>
          <GenericFilter endpoint={proertiesToRentEndpoint} global selection="propertiesToRent"
            placeholder={<Loader/>} error={<PageError/>}>{properties => {
              let footer = `Show all (${properties.count}+)`;
              return (
                  <>
                    <div class="p-0 m-0 px-1 px-sm-3 mt-2 mt-md-3">
                        <TwoRowsPropertiesGroup endpoint={proertiesToRentEndpoint}
                        header="Rent a place" properties={properties} footer={footer}
                        detailedHeader="Properties available for rent"/>
                    </div>

                    <GenericFilter endpoint={propertiesToSlideEndpoint} global selection="propertiesToSlide"
                    placeholder={<GlowInlineLoader/>} error={<PageError/>}>{properties => {
                        return (
                            <div class="p-0 m-0 mt-4">
                                  <SliderPropertiesGroup endpoint={propertiesToSlideEndpoint} 
                                  header="Amazing Places" properties={properties}/>
                            </div>
                        );
                    }}</GenericFilter>
          
                    <GenericFilter endpoint={propertiesToBuyEndpoint} global selection="propertiesToBuy"
                    placeholder={<GlowInlineLoader/>} error={<PageError/>}>{properties => {
                        let footer = `Show all (${properties.count}+)`;
                        return (
                            <div class="p-0 m-0 px-1 px-sm-3 mt-4">
                                <TwoRowsPropertiesGroup endpoint={propertiesToBuyEndpoint} 
                                header="Buy a place" properties={properties} footer={footer}
                                detailedHeader="Properties available for sale"/>
                            </div>
                        );
                    }}</GenericFilter>
                  </>
              );
          }}</GenericFilter>
        </>
    );
}

export {Home}
