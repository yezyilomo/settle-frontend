import React, { } from 'react';
import './Home.css';
import {
    Fetcher, Loader, PropertyGroup, PageError
} from './';
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


    return (
        <>
        <Fetcher action={fetchPropertiesToRent}
         placeholder={<Loader/>} error={<PageError/>}>{properties => {
            return (
                <>
                    <div>
                        <PropertyGroup header="Rent a place" properties={properties} />
                    </div>

                    <Fetcher action={fetchPropertiesToBuy}
                     placeholder={<Loader/>} error={<PageError/>}>{properties => {
                        return (
                            <div>
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
