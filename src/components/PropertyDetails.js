import React, { useState } from 'react';
import './PropertyDetails.scss';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { GlobalFetcher, Loader, Rating, PageError, Carousel as Slider } from './';
import { API_URL } from '../';
import { Button, Modal } from 'react-bootstrap';
import { useGlobalState } from 'simple-react-state';
import { getPropertyRoute } from '../utils';
import { useRestoreScrollState } from '../hooks';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


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
          <Button className="c-anchor m-0 p-0 mt-2 w-100 text-left" variant="link" onClick={() => setModalShow(true)}>
              {props.modalButton}
          </Button>
    
          <Modal className="info-modal" animation={false} dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <Modal.Header className="modal-header p-2 pt-3 bg-light" closeButton>
                  <Modal.Title>
                   <h4 class="modal-title">{props.header}</h4>
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-body p-0 m-0 pb-5 bg-light">
                  {props.children}
              </Modal.Body>
          </Modal>
        </>
    );
}


function ImagesCarousel(props) {
  let activeImageIndex = props.images.indexOf(props.activeImage);
  const [index, setIndex] = useState(activeImageIndex);
  
  const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: index,
      adaptiveHeight: true,
      afterChange: function (sliderIndex){
          setIndex(sliderIndex)
      }
  };
  return (
      <>
        <Slider {...settings}>
          {props.images.map((image) =>
              <img class="full-img d-block w-100" src={image.src} alt="" />
          )}
        </Slider>
        <div class="corousel-items-counter">{index+1}/{props.images.length}</div>
      </>
  );
}
function ImageDescription(props){
    return (
      <>
        {props.image.description ?
            <div class="text-secondary mt-3 px-1">
                {props.image.description}
            </div>:
            null
        }
      </>
    );
}

function ImagesModalCarousel(props) {
  let activeImageIndex = props.images.indexOf(props.activeImage);
  const [index, setIndex] = useState(activeImageIndex);
  const [modalShow, setModalShow] = useState(false);
  var metaThemeColor = document.querySelector("meta[name=theme-color]");
  if(modalShow){
      metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");  
  }
  else{
      metaThemeColor.setAttribute("content", "white"); 
  }
  const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: index,
      arrows: false,
      adaptiveHeight: true,
      afterChange: function (sliderIndex){
          setIndex(sliderIndex)
      }
  };

  return (
    <>
      <Slider {...settings}>
        {props.images.map((image) =>
            <img class="full-img d-block w-100" src={image.src} alt="" onClick={() => setModalShow(true)}/>
        )}
      </Slider>
      <Modal animation={false} backdropClassName="img-modal-backdrop" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <div class="modal-close" onClick={() => setModalShow(false)}>
            <img src="icons/cancel.svg" width="23" height="23" alt=""/>
        </div>
        <Modal.Body className="p-0 m-0">
            <ImagesCarousel activeImage={props.images[index]} images={props.images}/>
            <ImageDescription image={props.images[index]}/>
        </Modal.Body>
      </Modal>
    </>
  );
}

function MainPropertyImage(props) {
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

          <Modal animation={false} backdropClassName="img-modal-backdrop-md" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <div class="modal-close" onClick={() => setModalShow(false)}>
                  <img src="icons/cancel.svg" width="23" height="23" alt=""/>
              </div>
              <Modal.Body className="p-0 m-0">
                  <ImagesCarousel activeImage={props.activeImage} images={props.images}/>
                  <ImageDescription image={props.activeImage}/>
              </Modal.Body>
          </Modal>
          <Button className="view-photos-btn d-none d-md-block" variant="light" onClick={() => setModalShow(true)}>
              View Photos
          </Button>
        </>
    );
}

function OthersPropertyImages(props) {
    const [modalShow, setModalShow] = useState(false);
    const [activeImage, setActiveImage] = useState(props.images[0])

    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    if(modalShow){
        metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");    
    }
    else{
        metaThemeColor.setAttribute("content", "white"); 
    }

    let getStyle = (index) => {
        let width = 2;
        switch(index){
            case 0: return `0 0 ${width}px ${width}px`;
            case 1: return `0 0 ${width}px ${width}px`;
            case 2: return `0 0 0 ${width}px`;
            case 3: return `0 0 0 ${width}px`;
            default: return `0`;
        }
    }

    let openModal = (image) => {
        setActiveImage(image);
        setModalShow(true);
    }

    return (
        <>
          {props.otherImages.map(image => {
              let imageIndex = props.otherImages.indexOf(image);
              let style = {padding: getStyle(imageIndex)};
              return (
                  <div class="pictures col-6 m-0 p-0">
                      <div class="other-prop-img col-12">
                          <img class="small-img" style={style} src={image.src} alt="" onClick={() => openModal(image)} />
                      </div>
                  </div>
              );
          })}
    
          <Modal animation={false} backdropClassName="img-modal-backdrop-md" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
              <div class="modal-close" onClick={() => setModalShow(false)}>
                  <img src="icons/cancel.svg" width="23" height="23" alt=""/>
              </div>
              <Modal.Body className="p-0 m-0">
                  <ImagesCarousel activeImage={activeImage} images={props.images}/>
                  <ImageDescription image={activeImage}/>
              </Modal.Body>
          </Modal>
        </>
    );
}

function shortenString(str, to) {
    let long = str.slice(to);
    if (long) {
        return str.slice(0, to) + "...";
    }
    return str;
}

function Badges(props) {
    let maxValue = 7
    let values = []
    if(props.values && props.values.length > 0 ){
        values = props.values.slice(0, maxValue)
    }
    return (
        values.length > 0 ?
            <div class="mb-3">
                <div class="h5">{props.label}</div>
                {values.map((val) => {
                    return (
                        <>
                            <span class="badge badge-secondary mb-1 mr-1">
                                <span id={val} class={`fa fa-${val} badge-close`} />&nbsp;
                                <span class="badge-body">{shortenString(val, 17)}</span>
                            </span>
                        </>
                    );
                })}
                { props.values.length > (maxValue) ?
                    <InfoModal header={props.label} modalButton={`Show all ${props.values.length} ${props.label}`}>
                        {values.map((val) => {
                            return (
                                <div class="px-2 pt-3" style={{"font-size": "1.05em"}}>
                                    {val}
                                    <hr class="line m-0 mt-2 p-0"/>
                                </div>
                            )
                        })}
                    </InfoModal>:
                    null
                }
            <hr class="line d-md-none m-0 mt-2 p-0"/>
            </div> :
            null
    )
}


function Descriptions(props){
    return (
        <div dangerouslySetInnerHTML={{__html: props.value}} />
    );
}


function PropertyDetails(props) {
    useRestoreScrollState()
    let history = useHistory();
    let [user, ] = useGlobalState("user");
    let [,setProperty] = useGlobalState(`property/${props.id}`);

    let fetchProperty = () => {
        return fetch(`${API_URL}/${getPropertyRoute(props.type)}/${props.id}/`)
        .then(res => res.json())
    }

    return (
        <GlobalFetcher action={fetchProperty} selection={`property/${props.id}`}
        placeholder={<Loader/>} error={<PageError/>}>{property => {
            let isAllowedToEdit = user.id == property.owner.id

            let main_img = property.pictures.filter((picture) => picture.is_main)
            if (main_img.length < 1) {
                main_img = { is_main: null, src: null, id: null };
            }
            else {
                main_img = main_img[0];
            }
            let other_imgs = property.pictures.filter((picture) => !picture.is_main).slice(0, 4);

            let redirect = (status) => {
                if(status === 204){
                    setProperty({
                        value: null
                    })
                    return history.replace('/properties/');
                }
                // Report Error
            }

            let deleteProperty = (e) => {
                let postUrl = `${API_URL}/${getPropertyRoute(props.type)}/${property.id}/`;
                let headers = {
                    'Authorization': `Token ${user.authToken}`,
                    'Content-Type': 'application/json'
                }
                fetch(postUrl, {method: 'DELETE', headers: headers})
                .then(res =>  res.status)
                .then(status => redirect(status))
            }
            return (
                <div class="row p-0 m-0">
                    <div class="property-images col-12 p-0 m-0 d-md-none">
                        <ImagesModalCarousel activeImage={main_img} images={property.pictures}/>
                    </div>
                    <div class="property-images-md col-12 p-0 m-0 d-none d-md-flex">
                        <MainPropertyImage activeImage={main_img} images={property.pictures}/>
                        <div class="other-images d-none d-lg-block col-6 p-0 m-0">
                            <div class="row m-0 p-0">
                                <OthersPropertyImages otherImages={other_imgs} images={property.pictures} />
                            </div>
                        </div>
                    </div>

                    {isAllowedToEdit ?
                        <div class="col-12 p-0 m-0">
                            <div class="actions row m-0 p-0">
                                <div class="col text-center py-2">
                                    <b class="delete-property" onClick={deleteProperty}>Delete <span class="fa fa-trash mt-2 ml-1 ml-lg-3 delete-property-icon"/></b>
                                </div>
                                <div class="col text-center py-2">
                                    <Link to={`/edit/${getPropertyRoute(props.type)}/${property.id}`} class="edit-property c-anchor">
                                        <b>Edit <span class="fas fa-edit mt-2 ml-1 ml-lg-3 edit-property-icon"/></b>
                                    </Link>
                                </div>
                            </div>
                            <hr class="line m-0 p-0"/>
                        </div>:
                        null
                    }
                    
                    { props.children ?
                      props.children(property):
                      null
                    }
                </div>)
        }}</GlobalFetcher>
    )
}

function Contact(props){
    let contact = props.value;
    return (
        <>
            <div class="h5 p-0 m-0 mt-3">Contact</div>
            <hr class="line m-0 p-0 mt-1 mb-2"/>
            <div class="other-feature"><b>Name:</b> {contact.name}</div>
            <div class="other-feature"><b>Phone:</b> {contact.phone}</div>
            <div class="other-feature"><b>Email:</b> {contact.email}</div>
        </>
    );
}

function RoomDetails(props){
    return (
        <PropertyDetails type="room" id={props.id}>
            {property => 
                <div class="col-12 p-0 m-0">
                    <div class="row p-0 m-0 px-3 px-sm-4 mt-2 mt-md-4 pt-md-2 text-dark">
                        <div class="detailed-prop-info col-12 col-md-5 p-0 m-0 pl-md-2 order-1 order-md-2">
                            <div class="prop-info-card sticky-top bw-0 bw-md-1 py-1 px-md-3 py-md-2">
                                <div class="property-type">Available for <span class="bg-info">{property.available_for}</span></div>
                                <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                    &nbsp;{property.location.region + "," + property.location.country}
                                </div>
                                <div class="property-price">
                                    Price: {property.currency} {property.price} / {property.price_payment_terms_unit}
                                </div>
                                <div class="peyment-terms">Payment terms: {property.payment_terms} {property.payment_terms_unit}s</div>
                                <div class="property-rating">
                                    <span class="rating-label">Rating</span><Rating rating={property.rating}/>
                                </div>
                                {property.other_features.map((feature) => {
                                    return <div class="other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                                })}
                                <Contact value={property.contact}/>
                            </div>
                            <hr class="line d-md-none m-0 p-0"/>
                        </div>
                        
                        <div class="col-12 col-md-7 p-0 m-0 mt-3 mt-sm-0 pr-md-2 text-dark order-2 order-md-1">
                            <Descriptions value={property.descriptions}/>
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>
                </div>
            }
        </PropertyDetails>
    );
}

function HouseDetails(props){
    return (
        <PropertyDetails type="house" id={props.id}>
            {property => 
                <div class="col-12 p-0 m-0">
                    <div class="row p-0 m-0 px-3 px-sm-4 mt-2 mt-md-4 pt-md-2 text-dark">
                        <div class="detailed-prop-info col-12 col-md-5 p-0 m-0 pl-md-2 order-1 order-md-2">
                            <div class="prop-info-card sticky-top bw-0 bw-md-1 py-1 px-md-3 py-md-2">
                                <div class="property-type">Available for <span class="bg-info">{property.available_for}</span></div>
                                <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                    &nbsp;{property.location.region + "," + property.location.country}
                                </div>
                                <div class="property-price">
                                    Price: {property.currency} {property.price} / {property.unit_of_payment_terms}
                                </div>
                                <div class="peyment-terms">Payment terms: {property.payment_terms} {property.unit_of_payment_terms}s</div>
                                <div class="property-rating">
                                    <span class="rating-label">Rating</span><Rating rating={property.rating}/>
                                </div>
                                {property.other_features.map((feature) => {
                                    return <div class="other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                                })}
                                <Contact value={property.contact}/>
                            </div>
                            <hr class="line d-md-none m-0 p-0"/>
                        </div>
                        
                        <div class="col-12 col-md-7 p-0 m-0 mt-3 mt-sm-0 pr-md-2 text-dark order-2 order-md-1">
                            <Descriptions value={property.descriptions}/>
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>
                </div>
            }
        </PropertyDetails>
    );
}

function ApartmentDetails(props){
    return (
        <PropertyDetails type="apartment" id={props.id}>
            {property => 
                <div class="col-12 p-0 m-0">
                    <div class="row p-0 m-0 px-3 px-sm-4 mt-2 mt-md-4 pt-md-2 text-dark">
                        <div class="detailed-prop-info col-12 col-md-5 p-0 m-0 pl-md-2 order-1 order-md-2">
                            <div class="prop-info-card sticky-top bw-0 bw-md-1 py-1 px-md-3 py-md-2">
                                <div class="property-type">Available for <span class="bg-info">{property.available_for}</span></div>
                                <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                    &nbsp;{property.location.region + "," + property.location.country}
                                </div>
                                <div class="property-price">
                                    Price: {property.currency} {property.price} / {property.unit_of_payment_terms}
                                </div>
                                <div class="peyment-terms">Payment terms: {property.payment_terms} {property.unit_of_payment_terms}s</div>
                                <div class="property-rating">
                                    <span class="rating-label">Rating</span><Rating rating={property.rating}/>
                                </div>
                                {property.other_features.map((feature) => {
                                    return <div class="other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                                })}
                                <Contact value={property.contact}/>
                            </div>
                            <hr class="line d-md-none m-0 p-0"/>
                        </div>
                        
                        <div class="col-12 col-md-7 p-0 m-0 mt-3 mt-sm-0 pr-md-2 text-dark order-2 order-md-1">
                            <Descriptions value={property.descriptions}/>
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>
                </div>
            }
        </PropertyDetails>
    );
}

function HostelDetails(props){
    return (
        <PropertyDetails type="hostel" id={props.id}>
            {property => 
                <div class="col-12 p-0 m-0">
                    <div class="row p-0 m-0 px-3 px-sm-4 mt-2 mt-md-4 pt-md-2 text-dark">
                        <div class="detailed-prop-info col-12 col-md-5 p-0 m-0 pl-md-2 order-1 order-md-2">
                            <div class="prop-info-card sticky-top bw-0 bw-md-1 py-1 px-md-3 py-md-2">
                                <div class="property-type">Available for <span class="bg-info">{property.available_for}</span></div>
                                <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                    &nbsp;{property.location.region + "," + property.location.country}
                                </div>
                                <div class="property-price">
                                    Price: {property.currency} {property.price} / {property.unit_of_payment_terms}
                                </div>
                                <div class="peyment-terms">Payment terms: {property.payment_terms} {property.unit_of_payment_terms}s</div>
                                <div class="property-rating">
                                    <span class="rating-label">Rating</span><Rating rating={property.rating}/>
                                </div>
                                {property.other_features.map((feature) => {
                                    return <div class="other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                                })}
                                <Contact value={property.contact}/>
                            </div>
                            <hr class="line d-md-none m-0 p-0"/>
                        </div>
                        
                        <div class="col-12 col-md-7 p-0 m-0 mt-3 mt-sm-0 pr-md-2 text-dark order-2 order-md-1">
                            <Descriptions value={property.descriptions}/>
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>
                </div>
            }
        </PropertyDetails>
    );
}

function OfficeDetails(props){
    return (
        <PropertyDetails type="office" id={props.id}>
            {property => 
                <div class="col-12 p-0 m-0">
                    <div class="row p-0 m-0 px-3 px-sm-4 mt-2 mt-md-4 pt-md-2 text-dark">
                        <div class="detailed-prop-info col-12 col-md-5 p-0 m-0 pl-md-2 order-1 order-md-2">
                            <div class="prop-info-card sticky-top bw-0 bw-md-1 py-1 px-md-3 py-md-2">
                                <div class="property-type">Available for <span class="bg-info">{property.available_for}</span></div>
                                <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                    &nbsp;{property.location.region + "," + property.location.country}
                                </div>
                                <div class="property-price">
                                    Price: {property.currency} {property.price} / {property.unit_of_payment_terms}
                                </div>
                                <div class="peyment-terms">Payment terms: {property.payment_terms} {property.unit_of_payment_terms}s</div>
                                <div class="property-rating">
                                    <span class="rating-label">Rating</span><Rating rating={property.rating}/>
                                </div>
                                {property.other_features.map((feature) => {
                                    return <div class="other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                                })}
                                <Contact value={property.contact}/>
                            </div>
                            <hr class="line d-md-none m-0 p-0"/>
                        </div>
                        
                        <div class="col-12 col-md-7 p-0 m-0 mt-3 mt-sm-0 pr-md-2 text-dark order-2 order-md-1">
                            <Descriptions value={property.descriptions}/>
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>
                </div>
            }
        </PropertyDetails>
    );
}

function HallDetails(props){
    return (
        <PropertyDetails type="hall" id={props.id}>
            {property => 
                <div class="col-12 p-0 m-0">
                    <div class="row p-0 m-0 px-3 px-sm-4 mt-2 mt-md-4 pt-md-2 text-dark">
                        <div class="detailed-prop-info col-12 col-md-5 p-0 m-0 pl-md-2 order-1 order-md-2">
                            <div class="prop-info-card sticky-top bw-0 bw-md-1 py-1 px-md-3 py-md-2">
                                <div class="property-type">Available for <span class="bg-info">{property.available_for}</span></div>
                                <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                    &nbsp;{property.location.region + "," + property.location.country}
                                </div>
                                <div class="property-price">
                                    Price: {property.currency} {property.price} / {property.unit_of_payment_terms}
                                </div>
                                <div class="peyment-terms">Payment terms: {property.payment_terms} {property.unit_of_payment_terms}s</div>
                                <div class="property-rating">
                                    <span class="rating-label">Rating</span><Rating rating={property.rating}/>
                                </div>
                                {property.other_features.map((feature) => {
                                    return <div class="other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                                })}
                                <Contact value={property.contact}/>
                            </div>
                            <hr class="line d-md-none m-0 p-0"/>
                        </div>
                        
                        <div class="col-12 col-md-7 p-0 m-0 mt-3 mt-sm-0 pr-md-2 text-dark order-2 order-md-1">
                            <Descriptions value={property.descriptions}/>
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>
                </div>
            }
        </PropertyDetails>
    );
}

function LandDetails(props){
    return (
        <PropertyDetails type="land" id={props.id}>
            {property => 
                <div class="col-12 p-0 m-0">
                    <div class="row p-0 m-0 px-3 px-sm-4 mt-2 mt-md-4 pt-md-2 text-dark">
                        <div class="detailed-prop-info col-12 col-md-5 p-0 m-0 pl-md-2 order-1 order-md-2">
                            <div class="prop-info-card sticky-top bw-0 bw-md-1 py-1 px-md-3 py-md-2">
                                <div class="property-type">Available for <span class="bg-info">{property.available_for}</span></div>
                                <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                    &nbsp;{property.location.region + "," + property.location.country}
                                </div>
                                <div class="property-price">
                                    Price: {property.currency} {property.price} / {property.unit_of_payment_terms}
                                </div>
                                <div class="peyment-terms">Payment terms: {property.payment_terms} {property.unit_of_payment_terms}s</div>
                                <div class="property-rating">
                                    <span class="rating-label">Rating</span><Rating rating={property.rating}/>
                                </div>
                                {property.other_features.map((feature) => {
                                    return <div class="other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                                })}
                                <Contact value={property.contact}/>
                            </div>
                            <hr class="line d-md-none m-0 p-0"/>
                        </div>
                        
                        <div class="col-12 col-md-7 p-0 m-0 mt-3 mt-sm-0 pr-md-2 text-dark order-2 order-md-1">
                            <Descriptions value={property.descriptions}/>
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>
                </div>
            }
        </PropertyDetails>
    );
}

function FrameDetails(props){
    return (
        <PropertyDetails type="frame" id={props.id}>
            {property => 
                <div class="col-12 p-0 m-0">
                    <div class="row p-0 m-0 px-3 px-sm-4 mt-2 mt-md-4 pt-md-2 text-dark">
                        <div class="detailed-prop-info col-12 col-md-5 p-0 m-0 pl-md-2 order-1 order-md-2">
                            <div class="prop-info-card sticky-top bw-0 bw-md-1 py-1 px-md-3 py-md-2">
                                <div class="property-type">Available for <span class="bg-info">{property.available_for}</span></div>
                                <div class="property-location"> <i class="fa fa-map-marker-alt"></i>
                                    &nbsp;{property.location.region + "," + property.location.country}
                                </div>
                                <div class="property-price">
                                    Price: {property.currency} {property.price} / {property.unit_of_payment_terms}
                                </div>
                                <div class="peyment-terms">Payment terms: {property.payment_terms} {property.unit_of_payment_terms}s</div>
                                <div class="property-rating">
                                    <span class="rating-label">Rating</span><Rating rating={property.rating}/>
                                </div>
                                {property.other_features.map((feature) => {
                                    return <div class="other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                                })}
                                <Contact value={property.contact}/>
                            </div>
                            <hr class="line d-md-none m-0 p-0"/>
                        </div>
                        
                        <div class="col-12 col-md-7 p-0 m-0 mt-3 mt-sm-0 pr-md-2 text-dark order-2 order-md-1">
                            <Descriptions value={property.descriptions}/>
                            <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                            <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                            <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                        </div>
                    </div>
                </div>
            }
        </PropertyDetails>
    );
}

export {
    PropertyDetails, RoomDetails, HouseDetails, ApartmentDetails, 
    HostelDetails, OfficeDetails, HallDetails, LandDetails, FrameDetails
}
