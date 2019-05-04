import React, {useEffect} from 'react';
import './PropertyOverview.css';
import {Link} from 'react-router-dom';

function PropertyOverview(props) {
    let rate = () => {
        let id = `star${props.property.rating}-${props.property.id}`;
        document.getElementById(id).checked = true;
    };
    useEffect(rate, [props.property.rating])

    return (
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 p-2 m-0">
            <div class="property col-12 p-0 m-0">
                <div class="prop-img col-12 bg-white">
                    <Link to={`property/${props.property.id}`}>
                        <img src={props.property.img} alt="" />
                    </Link>
                </div>
                <div class="prop-info col-12 bg-white px-1">
                    <div class="property-type">For <span class="bg-info">{props.property.category}</span></div>
                    <div class="property-location"> <i class="fa fa-map-marker-alt"></i> {props.property.location}</div>
                    <div class="property-price">
                        {props.property.currency} {props.property.price} per {props.property.unit_of_payment_terms}
                    </div>
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
        </div>
    )
}

export { PropertyOverview }