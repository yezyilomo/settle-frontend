import React, { } from 'react';
import './PropertyOverview.css';
import { Link } from 'react-router-dom';
import { Rating } from './';

function PropertyOverview(props) {
    let main_img = props.property.pictures.filter((picture) => picture.is_main)
    if (main_img.length < 1) {
        main_img = { is_main: null, src: null, id: null };
    }
    else {
        main_img = main_img[0];
    }

    return (
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 p-2 m-0">
            <div class="property col-12 p-0 m-0">
                <div class="prop-img col-12">
                    <Link to={{pathname: `/property/${props.property.id}`, edit: props.edit}}>
                        <img src={main_img.src} alt="" />
                    </Link>
                </div>
                <div class="prop-info col-12 bg-lightz px-1">
                    <div class="property-type">Available For <span class="bg-info">{props.property.category}</span></div>
                    <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                        &nbsp;{props.property.location.region}, {props.property.location.country}
                    </div>
                    <div class="property-price">
                        {props.property.currency} {props.property.price} per {props.property.unit_of_payment_terms}
                    </div>
                    <div class="property-rating">
                        <span class="rating-label">Rating</span><Rating rating={props.property.rating}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PropertyOverview }
