import React, { useState } from 'react';
import './PropertyDetails.css';
import { withRouter, Link } from 'react-router-dom';
import { Block, Fetcher, Loader, Rating, PageError } from './';
import { API_URL } from '../';
import { Button, Modal, Carousel } from 'react-bootstrap';
import { useGlobalState } from 'simple-react-state';


function InfoModal(props) {
    const [modalShow, setModalShow] = useState(false);
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    if(modalShow){
        metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");    
    }
    else{
        metaThemeColor.setAttribute("content", "white"); 
    }
    
    return (
        <>
          <Button variant="primary" onClick={() => setModalShow(true)}>
            More Features
          </Button>
    
          <Modal scrollable={true} animation={false} backdropClassName="modal-backdrop-" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <Modal.Header className="p-2" closeButton>
                  <Modal.Title>
                   <h5 class="modal-title">{props.header}</h5>
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0 m-0">
                  {props.children}
              </Modal.Body>
          </Modal>
        </>
    );
  }


  function PropertyImagesCarousel(props) {
    let activeImageIndex = props.images.indexOf(props.activeImage);
    const [index, setIndex] = useState(activeImageIndex);
    const [direction, setDirection] = useState(null);
  
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
      setDirection(e.direction);
    };
  
    return (
      <Carousel 
      interval={0} 
      controls={false} 
      indicators={false} 
      activeIndex={index} 
      direction={direction} 
      onSelect={handleSelect}>
        {props.images.map((image) => {
            return (
                <Carousel.Item>
                    <img class="full-img d-block w-100" src={image.src} alt="" />
                </Carousel.Item>
            );
        })}
      </Carousel>
    );
  }

function MainPropertyImagesModal(props) {
    const [modalShow, setModalShow] = useState(false);
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    if(modalShow){
        metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");    
    }
    else{
        metaThemeColor.setAttribute("content", "white"); 
    }

    return (
        <>
          <div class="main-prop-img col-12 col-lg-6 mx-0 px-0">
              <img class="main-img" src={props.activeImage.src} alt="" onClick={() => setModalShow(true)}/>
          </div>

          <Modal animation={false} backdropClassName="img-modal-backdrop" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <div class="modal-close" onClick={() => setModalShow(false)}>
                  <img src="icons/cancel.svg" width="23" height="23" alt=""/>
              </div>
              <Modal.Body className="p-0 m-0">
                  <PropertyImagesCarousel activeImage={props.activeImage} images={props.images}/>
              </Modal.Body>
          </Modal>
        </>
    );
}

function OthersPropertyImagesModal(props) {
    const [modalShow, setModalShow] = useState(false);
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    if(modalShow){
        metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");    
    }
    else{
        metaThemeColor.setAttribute("content", "white"); 
    }
    
    return (
        <>
          <div class="row pictures col-6 col-sm-6 col-md-4 col-lg-3 mx-0 p-1">
                <div class="other-prop-img col-12">
                    <img class="small-img" src={props.activeImage.src} alt="" onClick={() => setModalShow(true)} />
                </div>
          </div>
    
          <Modal animation={false} backdropClassName="img-modal-backdrop" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <div class="modal-close" onClick={() => setModalShow(false)}>
                  <img src="icons/cancel.svg" width="23" height="23" alt=""/>
              </div>
              <Modal.Body className="p-0 m-0">
                  <PropertyImagesCarousel activeImage={props.activeImage} images={props.images}/>
              </Modal.Body>
          </Modal>
        </>
    );
}

function PropertyOtherImages(props) {
    return (
        <Block>
            <OthersPropertyImagesModal activeImage={props.activeImage} images={props.images} />
        </Block>
    )
}

function shortenString(str, to) {
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
                                <span class="badge-body">{shortenString(val, 17)}</span>
                            </span>
                        </Block>
                    );
                })}
            </div> :
            null
    )
}

function PropertyDetails(props) {
    let [user, ] = useGlobalState("user")
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
                    props.history.replace('/my-properties/');
                    return
                }
                // Report Error
            }

            let deleteProperty = (e) => {
                let postUrl = `${API_URL}/property/${property.id}/`;
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
                                    <b class="delete-property" onClick={deleteProperty}>Delete <span class="fa fa-trash mt-2 ml-1 ml-lg-3 delete-property-icon"/></b>
                                </div>
                            </div>
                            <div class="col-12 col-lg-6"></div>
                        </div>:
                        null
                    }
                    <div class="property-details row col-12 p-0 m-0">
                        <MainPropertyImagesModal activeImage={main_img} images={[main_img, ...other_imgs]} />
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
                           {other_imgs.map(image =>
                               <PropertyOtherImages activeImage={image} images={other_imgs} />
                           )}
                        </div>
                    </div>
                    <InfoModal header="Menu">
                        <ul>
                            <li>One</li>
                            <li>Two</li>
                            <li>Three</li>
                            <li>Four</li>
                            <li>Five</li>
                            <li>One</li>
                            <li>Two</li>
                            <li>Three</li>
                            <li>Four</li>
                        </ul>
                    </InfoModal>
                </div>)
        }}</Fetcher>
    )
}

const comp = withRouter(PropertyDetails);

export { comp as PropertyDetails}
