import React from 'react';
import { useGlobalState } from 'simple-react-state';
import {
    Fetcher, Loader, PropertyGroup, PageError
} from './'
import { API_URL } from '../';


function UserProperties(props) {
    const [user, ] = useGlobalState("user");
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
        }&owner=${user.id}&format=json`
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
            }&owner=${user.id}`
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
                    <PropertyGroup header="My Properties.." properties={properties} onScrollToBottom={fetchNew} edit/>
                </div>
            );
        }}</Fetcher>
    );
}

export {UserProperties}
