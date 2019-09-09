import React, { } from 'react';
import {} from 'react-router-dom';
import {
    Fetcher, Loader, PropertyGroup, PageError
} from './'
import {API_URL} from '../';


function SearchProperties(props) {
    let location = props.location.search.slice(3)
    let fetchProperties = () => {
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
        }&search=${location}&format=json`
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
        <Fetcher action={fetchProperties} placeholder={<Loader/>} error={<PageError/>}>
        {properties => {
            return (
                <div>
                    <PropertyGroup header={`Search Results(${properties.count})..`} properties={properties} onScrollToBottom={fetchNew}/>
                </div>
            );
        }}</Fetcher>
    );
}


function FilterProperties(props) {
    let fetchProperties = () => {
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
        }&category=${props.category}&format=json`
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
            }&category=${props.category}`
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
                    <PropertyGroup header={props.header} properties={properties} onScrollToBottom={fetchNew} />
                </div>
            );
        }}</Fetcher>
    );
}

export {SearchProperties, FilterProperties}
