import React, {} from 'react';
import './PropertyDetails.css';
import { withRouter, Link } from 'react-router-dom';
import { Block, Fetcher, Loader, Rating, PageError, Menu } from './';
import {API_URL} from '../';
import {useGlobal} from 'reactn';


function InfoModal(props) {
  return (
    <>
      <a href="#myModal" role="button" class="btn btn-primary" data-toggle="modal">Launch modal</a>
      <div class="modal" id="myModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-full" role="document">
          <div class="modal-content">
              { props.header !== undefined?
                  <div class="modal-header">
                    <h5 class="modal-title">{props.header}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <img src="icons/cancel.svg" width="20" height="20" alt="" />
                    </button>
                   </div>:
                   null
              }
            <div class="modal-body p-0">
                {props.children}
            </div>
            { props.footer !== undefined?
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
                </div>:
                null
            }
          </div>
        </div>
      </div>
    </>
  );
}


function ImageModal(props) {
    return (
        <div class="img-modal modal fade p-0 m-0" id={`Modal_${props.id}`}>
            <button class="modal-close close" data-dismiss="modal" aria-label="Close">
                <img src="icons/cancel.svg" width="23" height="23" alt="" />
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
    let other = props.other.filter(img => img.id !== props.id)
    return (
        <Block>
            <div class="row pictures col-6 col-sm-6 col-md-4 col-lg-3 mx-0 p-1">
                <div class="other-prop-img col-12">
                    <img class="small-img" src={props.src} alt="" data-toggle="modal" data-target={`#Modal_${props.id}`} />
                </div>
            </div>
            <ImageModal src={props.src} id={props.id} other={other} />
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
    let [user, ] = useGlobal("User");
    let fetchProperty = () => {
        return fetch(`${API_URL}/property/${props.property}/?
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
                    id,
                    name,
                    value
                }
            }&format=json`
        )
        .then(res => res.json())
    }

    return (
        <Fetcher action={fetchProperty}
        placeholder={<Loader/>} error={<PageError/>}>{property => {

            let main_img = property.pictures.filter((picture) => picture.is_main)
            if (main_img.length < 1) {
                main_img = { is_main: null, src: null, id: null };
            }
            else {
                main_img = main_img[0];
            }
            let other_imgs = property.pictures.filter((picture) => !picture.is_main)

            let redirect = (status) => {
                if(status === 204){
                    props.history.push('/my-properties/');
                    return
                }
                // Report Error
            }

            let deleteProperty = (e) => {
                let postUrl = `${API_URL}/${property.category}/${property.id}/`;
                let headers = {
                    'Authorization': `Token ${user.authToken}`,
                    'Content-Type': 'application/json'
                }
                fetch(postUrl, {method: 'DELETE', headers: headers})
                .then(res =>  res.status)
                .then(status => redirect(status))
                .catch(error => console.log(error));
            }
            return (
                <div class="col-12 px-2 py-1 m-0">
                    {props.edit?
                        <div class="row col-12 p-0 m-0">
                            <div class="actions row col-12 col-lg-6 mb-3 mt-0 my-lg-3 mx-0 px-0">
                                <div class="col text-center py-2">
                                    <Link to={`/edit-property/${property.id}`} class="edit-property">
                                        <b>Edit <span class="fas fa-edit mt-2 ml-1 ml-lg-3 edit-property-icon"/></b>
                                    </Link>
                                </div>
                                <div class="col text-center py-2">
                                    <b class="delete-property">Delete <span class="fa fa-trash mt-2 ml-1 ml-lg-3 delete-property-icon" onClick={deleteProperty}/></b>
                                </div>
                            </div>
                            <div class="col-12 col-lg-6"></div>
                        </div>:
                        null
                    }
                    <div class="property-details row col-12 p-0 m-0">
                        <div class="main-prop-img col-12 col-lg-6 mx-0 px-0">
                            <img class="main-img" src={main_img.src} alt="" data-toggle="modal" data-target={`#Modal_${main_img.id}`} />
                            <ImageModal src={main_img.src} id={main_img.id} other={other_imgs} />
                        </div>
                        <div class="detailed-prop-info col-12 col-sm-6 col-lg-3 px-1 px-sm-0 px-lg-4 mt-3 mt-lg-0">
                            <div class="property-type">Available for <span class="bg-info">{property.category}</span></div>
                            <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                &nbsp;{property.location.region + "," + property.location.country}
                            </div>
                            <div class="property-price">
                                Price: {property.currency} {property.price} per {property.unit_of_payment_terms}
                            </div>
                            <div class="peyment-terms">Payment terms: {property.payment_terms} {property.unit_of_payment_terms}s</div>
                            <div class="property-rating">
                                <span class="rating-label">Rating</span><Rating rating={property.rating}/>
                            </div>
                            <div class="w-100" />
                            {property.other_features.map((feature) => {
                                return <div class="other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                            })}
                        </div>
                        <div class="col-12 col-sm-6 col-lg-3 px-1 px-sm-0 px-lg-4 mt-3 mt-lg-0 text-dark">
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>

                    <div class="row col-12 mb-3 m-0 mt-3 mt-sm-5 p-0 text-dark">
                        <div class="w-100 my-0 h5">Other Images</div>
                        <div class="row mx-0 px-0 mt-1">
                           {other_imgs.map(img =>
                               <PropertyImage src={img.src} id={img.id} other={other_imgs} />
                           )}
                        </div>
                    </div>
                    <InfoModal header="Menu">
                        <nav class="navbar col-12 navbar-light p-0 m-0 d-block d-lg-none">
                            <div class="navbar-collapse m-0 p-0" id="navbarTogglerDemo03">
                                <Menu/>
                            </div>
                        </nav>
                    </InfoModal>
                </div>)
        }}</Fetcher>
    )
}

const comp = withRouter(PropertyDetails);

export { comp as PropertyDetails}
