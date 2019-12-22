import React, { useEffect } from 'react';
import './Home.css';
import {
    Fetcher, PropertyGroup, PageError, GlowInlineLoader, Loader
} from './';
import {PropertySlider} from "./PropertyGroup";
import { API_URL } from '../';


/*
function Overview(props) {
    let main_img = props.property.pictures.filter((picture) => picture.is_main)
    if (main_img.length < 1) {
        main_img = { is_main: null, src: null, id: null };
    }
    else {
        main_img = main_img[0];
    }

    return (
        <div>There there</div>
    )
}


function Group(props) {
    let { next, prev, count, results } = props.properties;

    let [properties, setProperties] = useState(results);


    return (
        <div class="horizontal-property-container col-12 m-2">
            {properties.map(property =>
                <Overview property={property} edit={props.edit} />
            )}
        </div>
    )
}
*/


function Home(props) {
    let fetchPropertiesToRent = () => {
        return fetch(`${API_URL}/property/?
           query={
            id,
            category,
            price,
            pictures{
                src,
                is_main
            },
            currency,
            location,
            rating,
            payment_terms,
            unit_of_payment_terms
            }&category=rent&format=json`
        )
        .then(res => res.json())
    }

    let fetchPropertiesToBuy = () => {
        return fetch(`${API_URL}/property/?
           query={
            id,
            category,
            price,
            pictures{
                src,
                is_main
            },
            currency,
            location,
            rating,
            payment_terms,
            unit_of_payment_terms
            }&category=sale&format=json`
        )
        .then(res => res.json())
    }

    let fetchPropertiesToSlide = () => {
        return fetch(`${API_URL}/property/?
           query={
            id,
            category,
            price,
            pictures{
                src,
                is_main
            },
            currency,
            location,
            rating,
            payment_terms,
            unit_of_payment_terms
            }&format=json&price__lt=800000`
        )
        .then(res => res.json())
    }

    return (
        <>
          <Fetcher action={fetchPropertiesToRent}
           placeholder={<Loader/>} error={<PageError/>}>{properties => {
              return (
                  <>
                    <div class="mt-3 mt-md-4 px-1 px-md-2">
                        <PropertyGroup header="Rent a place" properties={properties} />
                    </div>

                    <Fetcher action={fetchPropertiesToSlide}
                     placeholder={<GlowInlineLoader/>} error={<PageError/>}>{properties => {
                        return (
                            <div class="p-0 m-0 mt-2 mt-md-3">
                                  <PropertySlider header="Amazing Places" properties={properties}/>
                            </div>
                        );
                    }}</Fetcher>
          
                    <Fetcher action={fetchPropertiesToBuy}
                     placeholder={<GlowInlineLoader/>} error={<PageError/>}>{properties => {
                        return (
                            <div class="px-1 px-md-2">
                                <PropertyGroup header="Buy a place" properties={properties} />
                            </div>
                        );
                    }}</Fetcher>
                  </>
              );
          }}</Fetcher>
        </>
    );
}

export {Home}
