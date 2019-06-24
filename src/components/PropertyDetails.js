import React, {} from 'react';
import './PropertyDetails.css';
import { } from 'react-router-dom';
import { Block, Fetcher, Loader } from './';
import {API_URL} from '../';

function ImageModal(props) {
    return (
        <div class="img-modal modal fade p-0 m-0" id={`Modal_${props.id}`}>
            <button class="modal-close close" data-dismiss="modal" aria-label="Close">
                <img src="icons/cancel.svg" width="20" height="20" alt="" />
            </button>
            <div class="modal-dialog modal-dialog-centered mx-auto modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-body p-0 m-0 border-0">

                        <div id={`carouselExampleControls${props.id}`} class="carousel slide" data-ride="carousel" data-interval="false">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img class="full-img d-block w-100" src={props.src} alt="" />
                                </div>
                                {props.other.map((picture) => {
                                    return (
                                        <div class="carousel-item">
                                            <img class="full-img d-block w-100" src={picture.src} alt="" />
                                        </div>
                                    );
                                })}
                            </div>
                            <a class="carousel-control-prev d-none d-sm-flex" href={`#carouselExampleControls${props.id}`}
                                role="button" data-slide="prev">
                                <img src="icons/back.svg" width="20" height="20" alt="" />
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control-next d-none d-sm-flex" href={`#carouselExampleControls${props.id}`}
                                role="button" data-slide="next">
                                <img src="icons/next.svg" width="20" height="20" alt="" />
                                <span class="sr-only">Next</span>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function PropertyImage(props) {
    return (
        <Block>
            <div class="row pictures col-6 col-sm-6 col-md-4 col-lg-3 p-1 p-sm-2 m-0">
                <div class="other-prop-img col-12">
                    <img class="small-img" src={props.src} alt="" data-toggle="modal" data-target={`#Modal_${props.id}`} />
                </div>
            </div>
            <ImageModal src={props.src} id={props.id} other={props.other} />
        </Block>
    )
}

function shorten(str, to) {
    let long = str.slice(to);
    if (long) {
        return str.slice(0, to) + "...";
    }
    return str;
}

function Badges(props) {
    return (
        props.values && props.values.length > 0 ?
            <div class="mb-3">
                <div class="h5">{props.label}</div>
                {props.values.map((val) => {
                    return (
                        <Block>
                            <span class="badge badge-secondary mb-1 mr-1">
                                <span id={val} class={`fa fa-${val} badge-close`} />&nbsp;
                                <span class="badge-body">{shorten(val, 17)}</span>
                            </span>
                        </Block>
                    );
                })}
            </div> :
            null
    )
}

function PropertyDetails(props) {

    let fetchProperty = () => {
        return fetch(`${API_URL}/room/${props.property}/?
            query={
                id,
                category,
                price,
                currency,
                location{
                    region,
                    country
                },
                rating,
                payment_terms,
                unit_of_payment_terms,
                amenities,
                services,
                potentials,
                pictures{
                    id,
                    is_main,
                    src
                },
                other_features{
                    feature{
                        name
                    },
                    value
                }
            }&format=json`
        )
        .then(res => res.json())
        .then(results => results)
        .catch(error => console.log(error))
    }

    return (
        <Fetcher action={fetchProperty} placeholder={Loader()}>{property => {

            let main_img = property.pictures.filter((picture) => picture.is_main)
            if (main_img.length < 1) {
                main_img = { is_main: null, src: null, id: null };
            }
            else {
                main_img = main_img[0];
            }
            let other_imgs = property.pictures.filter((picture) => !picture.is_main)

            return (
                <div class="col-12 p-2 m-0">
                    <div class="property-details row col-12 p-0 m-0">
                        <div class="main-prop-img col-12 col-lg-6">
                            <img class="main-img" src={main_img.src} alt="" data-toggle="modal" data-target={`#Modal_${main_img.id}`} />
                            <ImageModal src={main_img.src} id={main_img.id} other={other_imgs} />
                        </div>
                        <div class="detailed-prop-info col-12 col-sm-6 col-lg-3 px-1 px-sm-0 px-lg-4 mt-3 mt-lg-0">
                            <div class="property-type">Available for <span class="bg-info">{property.category}</span></div>
                            <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                {property.location.region + "," + property.location.country}
                            </div>
                            <div class="property-price">
                                Price: {property.currency} {property.price} per {property.unit_of_payment_terms}
                            </div>
                            <div class="peyment-terms">Payment terms: {property.payment_terms} {property.unit_of_payment_terms}s</div>
                            <div class="starrating d-flex justify-center flex-row-reverse m-0 p-0">
                                <input type="radio" id={`star5-${property.id}`} name={`rating${property.id}`} value="5" />
                                <label for={`star5-${property.id}`} title="5 star"><i class="fa fa-star"></i></label>
                                <input type="radio" id={`star4-${property.id}`} name={`rating${property.id}`} value="4" />
                                <label for={`star4-${property.id}`} title="4 star"><i class="fa fa-star"></i></label>
                                <input type="radio" id={`star3-${property.id}`} name={`rating${property.id}`} value="3" />
                                <label for={`star3-${property.id}`} title="3 star"><i class="fa fa-star"></i></label>
                                <input type="radio" id={`star2-${property.id}`} name={`rating${property.id}`} value="2" />
                                <label for={`star2-${property.id}`} title="2 star"><i class="fa fa-star"></i></label>
                                <input type="radio" id={`star1-${property.id}`} name={`rating${property.id}`} value="1" />
                                <label for={`star1-${property.id}`} title="1 star"><i class="fa fa-star"></i></label>
                                <span>Rating:</span>
                            </div>
                            <div class="w-100" />
                            {property.other_features.map((feature) => {
                                return <div class="other-feature"><b>{feature.feature.name}:</b> {feature.value}</div>;
                            })}
                        </div>
                        <div class="col-12 col-sm-6 col-lg-3 px-1 px-sm-0 px-lg-4 mt-3 mt-lg-0 text-dark">
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>

                    <div class="row col-12 mb-3 m-0 mt-3 mt-sm-5 p-0 text-dark">
                        <div class="w-100 ml-1 ml-sm-2 mb-0 mt-0 h5">Other Images</div>
                        {other_imgs.map(img =>
                            <PropertyImage src={img.src} id={img.id} other={other_imgs} />
                        )}
                    </div>
                </div>)
        }}</Fetcher>
    )
}

export { PropertyDetails }
