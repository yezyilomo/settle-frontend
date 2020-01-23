import React, { } from 'react';
import './PropertyOverview.css';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'simple-react-state';
import { Rating } from './';
import { getPropertyRoute } from '../utils';


function PropertyOverview(props) {
    /*
    const [property, updateProperty] = useGlobalState(`property/${props.property.id}`)
    if(!property){
        updateProperty({value: props.property});
    }
    */
    let main_img = props.property.pictures.filter((picture) => picture.is_main)
    if (main_img.length < 1) {
        main_img = { is_main: null, src: null, id: null };
    }
    else {
        main_img = main_img[0];
    }

    return (
        <div class="prop-overview row p-0 m-0">
            <div class="prop-img col-12 p-0 m-0">
                <Link className="lazy-container lazy-load-animation" to={{pathname: `/${getPropertyRoute(props.property.type)}/${props.property.id}`}}>
                    <img src={main_img.src} alt="" />
                </Link>
            </div>
            <div class="prop-info col-12 px-1">
                <div class="prop-type">Available for <span class="bg-info">{props.property.available_for}</span></div>
                <div class="prop-location"> <i class="fa fa-map-marker-alt"></i>
                    &nbsp;{props.property.location.region}, {props.property.location.country}
                </div>
                <div class="prop-price">
                    {props.property.currency} {props.property.price} / Month
                </div>
                <div class="prop-rating">
                    <Rating rating={props.property.rating}/>(4.6)
                </div>
            </div>
        </div>
    );
}

function PropertySliderOverview(props) {
    let main_img = props.property.pictures.filter((picture) => picture.is_main)
    if (main_img.length < 1) {
        main_img = { is_main: null, src: null, id: null };
    }
    else {
        main_img = main_img[0];
    }

    return (
        <div class="prop-slider-overview row p-0 m-0">
            <div class="prop-img col-12 p-0 m-0">
                <Link className="lazy-container lazy-load-animation" to={{pathname: `/${getPropertyRoute(props.property.type)}/${props.property.id}`}}>
                    <img src={main_img.src} alt="" />
                </Link>
            </div>
            <div class="prop-info col-12 px-1">
                <div class="prop-type">
                    Available for <span class="bg-info">{props.property.available_for}</span>
                </div>
                <div class="prop-price">
                    {props.property.currency} {props.property.price} / Month
                </div>
                <div class="prop-rating">
                    <Rating rating={props.property.rating}/>({props.property.rating})
                </div>
            </div>
        </div>
    );
}

export { PropertyOverview, PropertySliderOverview }
