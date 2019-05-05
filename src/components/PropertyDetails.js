import React, { useEffect } from 'react';
import './PropertyDetails.css';
import { Link } from 'react-router-dom';

function PropertyImage(props) {
    return (
        <div class="row pictures col-6 col-sm-6 col-md-4 col-lg-3 p-1 p-sm-2 m-0">
            <div class="other-prop-img col-12 bg-white">
                <img src={props.src} alt="" />
            </div>
        </div>
    )
}

function PropertyDetails(props) {
    let rate = () => {
        window.scrollTo(0, 0);
        let id = `star${props.property.rating}-${props.property.id}`;
        document.getElementById(id).checked = true;
    };
    useEffect(rate, [props.property.rating])

    return (
        <div class="col-12 p-2 m-0">
            <div class="property row col-12 p-0 m-0">
                <div class="main-prop-img col-12 col-sm-6 bg-white">
                    <img src={props.property.img} alt="" />
                </div>
                <div class="detailed-prop-info col-12 col-sm-6 bg-white px-1 px-sm-4 px-lg-4">
                    <div class="property-type">Available for <span class="bg-info">{props.property.category}</span></div>
                    <div class="property-location"> <i class="fa fa-map-marker-alt"></i> {props.property.location}</div>
                    <div class="property-price">
                        Price: {props.property.currency} {props.property.price} per {props.property.unit_of_payment_terms}
                    </div>
                    <div class="peyment-terms">Payment terms: {props.property.payment_terms} {props.property.unit_of_payment_terms}s</div>
                    <div class="starrating d-flex justify-center flex-row-reverse m-0 p-0">
                        <input type="radio" id={`star5-${props.property.id}`} name={`rating${props.property.id}`} value="5" />
                        <label for={`star5-${props.property.id}`} title="5 star"><i class="fa fa-star"></i></label>
                        <input type="radio" id={`star4-${props.property.id}`} name={`rating${props.property.id}`} value="4" />
                        <label for={`star4-${props.property.id}`} title="4 star"><i class="fa fa-star"></i></label>
                        <input type="radio" id={`star3-${props.property.id}`} name={`rating${props.property.id}`} value="3" />
                        <label for={`star3-${props.property.id}`} title="3 star"><i class="fa fa-star"></i></label>
                        <input type="radio" id={`star2-${props.property.id}`} name={`rating${props.property.id}`} value="2" />
                        <label for={`star2-${props.property.id}`} title="2 star"><i class="fa fa-star"></i></label>
                        <input type="radio" id={`star1-${props.property.id}`} name={`rating${props.property.id}`} value="1" />
                        <label for={`star1-${props.property.id}`} title="1 star"><i class="fa fa-star"></i></label>
                        <span>Rating</span>
                    </div>
                </div>
            </div>

            <div class="row col-12 mb-3 m-0 mt-4 mt-sm-5 p-0">
                <h5 class="w-100 ml-2 mb-0 mt-0">Other Images</h5>
                {props.properties.map(property =>
                    <PropertyImage src={property.img} />
                )}
            </div>
        </div>
    )
}

export { PropertyDetails }