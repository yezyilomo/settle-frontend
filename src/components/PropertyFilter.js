import React, { } from 'react';
import {} from 'react-router-dom';
import {useGlobal} from 'reactn'
import {
    Fetcher, Loader, PropertyGroup, PageError
} from './'
import {API_URL} from '../';


function PropertyFilter(props) {
    let [filters, ] = useGlobal("SideBar")
    let {property_type, category, price__gt, price__lt, location, amenities, currency} = filters
    let amenity_ids = JSON.stringify(amenities.selected.map(amenity => amenity.id))
    let fetchProperties = () => {
        return fetch(`${API_URL}/${property_type}/?
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
        }&category=${category}&price__gt=${price__gt}&price__lt=${price__lt}&currency=${currency||""}&search=${location}&amenities__contains=${amenity_ids}&format=json`
        )
        .then(res => res.json())
    }

    let update = (data, setMetaData, setProperties) => {
        let { next, prev, count, results } = data;
        let metaDataObj = {
            count: count,
            next: next,
            prev: prev
        }
        setMetaData(metaDataObj);
        setProperties(prev => {
            return [...prev, ...results];
        })
    }

    let fetchNew = (metaData, setMetaData, setProperties) => {
        fetch(`${metaData.next}&
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
            }`
        )
        .then(res => res.json())
        .then(data => update(data, setMetaData, setProperties))
        .catch(error => console.log(error))
    }

    return (
        <Fetcher action={fetchProperties}
        placeholder={<Loader/>} error={<PageError/>}>{properties => {
            return (
                <div>
                    <PropertyGroup header={`Filter Results(${properties.count}).. `}properties={properties} onScrollToBottom={fetchNew}/>
                </div>
            );
        }}</Fetcher>
    );
}


export {PropertyFilter}
