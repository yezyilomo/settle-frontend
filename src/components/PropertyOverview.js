import React from 'react';
import './PropertyOverview.scss';
import { Link } from 'react-router-dom';
import { Rating, SaveButton } from './';
import { getPropertyRoute } from '../utils';
import { useGlobalState } from 'state-pool';


function price(property) {
    const cash = `${property.currency} ${property.price}`
    if (property.price_rate_unit) {
        return `${cash} / ${property.price_rate_unit}`;
    }
    return cash;
}

function PropertyOverview(props) {
    const propertyData = {data: props.property, isPartial: true}
    const [property, updateProperty] = useGlobalState(
        `property/${props.property.id}`,
        {
            default: propertyData, 
            selector: prop => prop.data,
            patcher: (prop, value) => {prop.data = value}
        }
    );
    
    let main_img = property.pictures.filter((picture) => picture.is_main)
    if (main_img.length < 1) {
        main_img = { is_main: null, src: null, id: null };
    }
    else {
        main_img = main_img[0];
    }

    return (
        <div class="prop-overview row p-0 m-0">
            <div class="prop-img col-12 p-0 m-0">
                
                <Link className="lazy-container lazy-load-animation" to={{pathname: `/${getPropertyRoute(property.type)}/${property.id}`}}>
                    <img src={main_img.src} alt="" />
                </Link>
                <SaveButton property={property} />
            </div>
            <div class="prop-info col-12 px-1">
                <div class="prop-type">Available for <span class="bg-primary text-light">{property.available_for}</span></div>
                <div class="prop-location"> <i class="fa fa-map-marker-alt"></i>
                    &nbsp;{property.location.region}, {property.location.country}
                </div>
                <div class="prop-price">
                    {price(property)}
                </div>
                <div class="prop-rating">
                    <Rating rating={property.rating}/>(4.6)
                </div>
            </div>
        </div>
    );
}

function PropertySliderOverview(props) {
    const propertyData = {data: props.property, isPartial: true}
    const [property, updateProperty] = useGlobalState(
        `property/${props.property.id}`,
        {
            default: propertyData, 
            selector: prop => prop.data,
            patcher: (prop, value) => {prop.data = value}
        }
    );
    
    let main_img = property.pictures.filter((picture) => picture.is_main)
    if (main_img.length < 1) {
        main_img = { is_main: null, src: null, id: null };
    }
    else {
        main_img = main_img[0];
    }

    return (
        <div class="prop-slider-overview row p-0 m-0">
            <div class="prop-img col-12 p-0 m-0">
                <Link className="lazy-container lazy-load-animation" to={{pathname: `/${getPropertyRoute(property.type)}/${property.id}`}}>
                    <img src={main_img.src} alt="" />
                </Link>
                <SaveButton property={property} />
            </div>
            <div class="prop-info col-12 px-1">
                <div class="prop-type">
                    Available for <span class="bg-primary text-light">{property.available_for}</span>
                </div>
                <div class="prop-price">
                    {price(property)}
                </div>
                <div class="prop-rating">
                    <Rating rating={property.rating}/>({property.rating})
                </div>
            </div>
        </div>
    );
}

export { PropertyOverview, PropertySliderOverview }
