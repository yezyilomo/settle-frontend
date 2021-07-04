import React, { useState } from 'react';
import './PropertyDetails.scss';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import {
    DataFetcher, GlowPageLoader, Rating, ConfirmModal, InfoModal,
    Carousel as Slider, SaveButton, renderPageError, Map,
    PROPERTIES_QUERY_PARAM, renderInlineError, SliderPropertiesGroup,
    GenericFilter, GlowBlockLoader, NotFoundError
} from './';
import { BASE_API_URL } from '../';
import { Button, Modal } from 'react-bootstrap';
import { useGlobalState } from 'state-pool';
import { getPropertyRoute, setTabColorDark, capitalizeFirst, thousandsSeparator } from '../utils';
import { queryCache } from 'react-query';
import { useScrollTop } from '../hooks';

import { formatDistance } from 'date-fns'


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
        afterChange: function (sliderIndex) {
            setIndex(sliderIndex)
        }
    };

    return (
        <>
            <Slider {...settings}>
                {props.images.map((image) =>
                    <div class="lazy-container lazy-load-animation">
                        <img class="full-img d-block w-100" src={image.src} alt="" />
                    </div>
                )}
            </Slider>
            <div class="corousel-items-counter">{index + 1} / {props.images.length}</div>
        </>
    );
}


function ImageDescription(props) {
    return (
        <>
            {props.image.description ?
                <div class="text-secondary mt-3 px-1">
                    {props.image.description}
                </div> :
                null
            }
        </>
    );
}


function ImagesModalCarousel(props) {
    let activeImageIndex = props.images.indexOf(props.activeImage);

    const [index, setIndex] = useState(activeImageIndex);
    const [modalShow, setModalShow] = useState(false);
    setTabColorDark(modalShow);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: index,
        arrows: false,
        adaptiveHeight: true,
        afterChange: function (sliderIndex) {
            setIndex(sliderIndex)
        }
    };

    return (
        <>
            <Slider {...settings}>
                {props.images.map((image) =>
                    <div class="lazy-container lazy-load-animation d-flex">
                        <img class="full-img d-block w-100" src={image.src} alt="" onClick={() => setModalShow(true)} />
                    </div>
                )}
            </Slider>
            <div class="corousel-items-counter-sm">{index + 1} / {props.images.length}</div>
            <Modal animation={false} backdropClassName="img-modal-backdrop" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <div class="modal-close" onClick={() => setModalShow(false)}>
                    <span class="icon icon-close"></span>
                </div>
                <Modal.Body className="p-0 m-0">
                    <ImagesCarousel activeImage={props.images[index]} images={props.images} />
                    <ImageDescription image={props.images[index]} />
                </Modal.Body>
            </Modal>
        </>
    );
}


function MainPropertyImage(props) {
    const [modalShow, setModalShow] = useState(false);
    setTabColorDark(modalShow);

    return (
        <>
            <div class="main-prop-img col-12 col-lg-6 mx-0 px-0">
                <div class="lazy-container lazy-load-animation">
                    <img class="main-img" src={props.activeImage.src} alt="" onClick={() => setModalShow(true)} />
                </div>
            </div>

            <Modal animation={false} backdropClassName="img-modal-backdrop-md" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <div class="modal-close" onClick={() => setModalShow(false)}>
                    <span class="icon icon-close"></span>
                </div>
                <Modal.Body className="p-0 m-0">
                    <ImagesCarousel activeImage={props.activeImage} images={props.images} />
                    <ImageDescription image={props.activeImage} />
                </Modal.Body>
            </Modal>
            <Button className="view-photos-btn d-none d-md-block" variant="light" onClick={() => setModalShow(true)}>
                View all photos
          </Button>
        </>
    );
}


function OthersPropertyImages(props) {
    const [modalShow, setModalShow] = useState(false);
    const [activeImage, setActiveImage] = useState(props.images[0]);

    setTabColorDark(modalShow);

    let getStyle = (index) => {
        let width = 2;
        switch (index) {
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
                let style = { padding: getStyle(imageIndex) };
                return (
                    <div class="pictures col-6 m-0 p-0">
                        <div class="other-prop-img col-12">
                            <div class="lazy-container lazy-load-animation">
                                <img class="small-img" style={style} src={image.src} alt="" onClick={() => openModal(image)} />
                            </div>
                        </div>
                    </div>
                );
            })}

            <Modal animation={false} backdropClassName="img-modal-backdrop-md" dialogClassName="cusom-modal-dialog" show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <div class="modal-close" onClick={() => setModalShow(false)}>
                    <span class="icon icon-close"></span>
                </div>
                <Modal.Body className="p-0 m-0">
                    <ImagesCarousel activeImage={activeImage} images={props.images} />
                    <ImageDescription image={activeImage} />
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
    const [modalShow, setModalShow] = useState(false);

    let maxValue = 15;
    let values = [];
    if (props.values && props.values.length > 0) {
        values = props.values.slice(0, maxValue);
    }

    values = values.sort(function(a, b){return a.length - b.length})

    return (
        values.length > 0 ?
            <div class="mb-4">
                <div class="h5 m-0 p-0 mb-1">{props.label}</div>
                <div class="col-12 p-0 m-0 badges-container">
                    {values.map((val) => {
                        return (
                            <>
                                <span class="badge mb-1 mr-1">
                                    <span id={val} class={`fa fa-${val} badge-close`} />
                                    <span class="badge-body">{shortenString(val, 17)}</span>
                                </span>
                            </>
                        );
                    })}
                </div>
                {props.values.length > (maxValue) ?
                    <>
                        <Button className="text-decoration-none m-0 p-0 mt-1 w-100 text-left" variant="link" onClick={() => setModalShow(true)}>
                            {`Show all ${props.values.length} ${props.label.toLowerCase()}`}
                        </Button>
                        <InfoModal positionBottom header={props.label} modalShow={modalShow} setModalShow={setModalShow}>

                            <ul class="m-0 p-0">
                                {props.values.map((val) => {
                                    return (
                                        <>
                                            <li class="m-0 p-0">
                                                <div class="m-0 px-2 pb-2 pt-3">{val}</div>
                                            </li>
                                            <hr class="line m-0 p-0" />
                                        </>
                                    )
                                })}
                            </ul>
                        </InfoModal>
                    </> :
                    null
                }
                <hr class="line d-md-none m-0 mt-1 p-0" />
            </div> :
            null
    )
}


function Descriptions(props) {
    if(props.value){
        return <div class="mb-4" dangerouslySetInnerHTML={{ __html: props.value }} />;
    }
    return null;
}


function PropertyDetails(props) {
    useScrollTop();
    const history = useHistory();
    const [user,] = useGlobalState("user");
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    const headers = {
        "Content-Type": "application/json",
    }

    if (user.isLoggedIn) {
        headers["Authorization"] = `Token ${user.auth_token}`
    }

    let fetchProperty = () => {
        return fetch(`${BASE_API_URL}/${getPropertyRoute(props.type)}/${props.id}/`, {headers: headers})
        .then(res => res.json().then(data => ({statusCode: res.status, data})))
        
    }

    return (
        <DataFetcher action={fetchProperty} selection={`property/${props.id}`}
            placeholder={<GlowPageLoader />} onError={renderPageError}>{response => {
                if(response.data.statusCode === 404){
                    return <NotFoundError />
                }
                const property = response.data.data;
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
                    if (status === 204) {
                        // Invalidate user properties
                        queryCache.invalidateQueries(`myProperties.properties`);
                        queryCache.invalidateQueries(`myProperties.${getPropertyRoute(props.type)}`);
                        return history.replace('/properties/');
                    }
                    // Report Error
                }

                let deleteProperty = (e) => {
                    let postUrl = `${BASE_API_URL}/${getPropertyRoute(props.type)}/${property.id}/`;
                    let headers = {
                        'Authorization': `Token ${user.auth_token}`,
                        'Content-Type': 'application/json'
                    }
                    fetch(postUrl, { method: 'DELETE', headers: headers })
                        .then(res => res.status)
                        .then(status => redirect(status))
                }

                const confirmDeletionOptions = [
                    { label: "Yes", onClick: deleteProperty, variant: "danger" },
                    { label: "Cancel", onClick: function (e) { setDeleteModalShow(false) }, variant: "secondary" }
                ]
                const confirmDeletionText = "Are you sure you want to delete this property permanently?."

                let child;
                if (props.children === undefined){
                    child = {}
                }
                else{
                    child = props.children(property);
                }

                const scrollToMap = (e) => {
                    document.getElementById('location-on-map').scrollIntoView({behavior: "smooth"}); 
                }


                return (
                    <div class="row p-0 m-0 property-details">
                        <div class="property-images col-12 p-0 m-0 d-md-none">
                            <ImagesModalCarousel activeImage={main_img} images={property.pictures} />
                            <span class="save">
                                <SaveButton property={property} />
                            </span>
                        </div>

                        <div class="property-images-md col-12 p-0 m-0 d-none d-md-flex">
                            <MainPropertyImage activeImage={main_img} images={property.pictures} />
                            <div class="other-images d-none d-lg-block col-6 p-0 m-0">
                                <div class="row m-0 p-0">
                                    <OthersPropertyImages otherImages={other_imgs} images={property.pictures} />
                                </div>
                            </div>
                            <span class="save">
                                <SaveButton property={property} />
                            </span>
                        </div>

                        {isAllowedToEdit ?
                            <div class="col-12 p-0 m-0">
                                <div class="actions row m-0 p-0">
                                    <div class="col text-center py-2 p-0 m-0">
                                        <ConfirmModal size="md" modalShow={deleteModalShow} setModalShow={setDeleteModalShow} options={confirmDeletionOptions} text={confirmDeletionText} />
                                        <Link class="delete-property text-decoration-none" onClick={() => { setDeleteModalShow(true) }}>
                                            <b><span class="fa fa-trash mt-2 mr-1 mr-lg-3 delete-property-icon" /> Delete</b>
                                        </Link>
                                    </div>
                                    <div class="col text-center py-2 p-0 m-0">
                                        <Link to={`/edit/${getPropertyRoute(props.type)}/${property.id}`} class="edit-property text-decoration-none">
                                            <b><span class="fas fa-edit mt-2 mr-1 mr-lg-3 edit-property-icon" /> Edit</b>
                                        </Link>
                                    </div>
                                </div>
                                <hr class="line m-0 p-0" />
                            </div> :
                            null
                        }

                        <div class="col-12 p-0 m-0">
                            <div class="row p-0 m-0 px-3 px-sm-4 mt-1 mt-md-4 pt-md-2 text-dark">
                                <div class="detailed-prop-info col-12 col-md-5 p-0 m-0 pl-md-2 order-1 order-md-2">
                                    <div class="prop-info-card sticky-top bw-0 bw-md-1 py-1 px-md-3 py-md-3">
                                        <div class="row">
                                            <div class="col-7">
                                                <div class="property-type">{capitalizeFirst(property.type)}  available for <span class="bg-primary text-light">{property.available_for}</span></div>
                                                <div class="property-location mt-2"> <i class="fa fa-map-marker-alt"></i>
                                                &nbsp;{property.location.address}
                                                </div>
                                                <div class="property-price mt-2">
                                                    {child.price}
                                                </div>
                                            </div>

                                            <div class="col text-right">
                                                <div class="property-post-time">
                                                    <i class="fa fa-clock"></i> {capitalizeFirst(formatDistance(new Date(property.post_date), new Date()))}
                                                </div>
                                                <div class="property-rating p-0 m-0 mt-1">
                                                    <div class="summary">
                                                        <span class="score">{property.total_rating_score}</span>
                                                        <span class="reviews-count">
                                                            ({property.raters_count} Review{property.raters_count === 1? "": "s"})
                                                        </span>
                                                    </div>
                                                    <Rating property={property} />
                                                </div>
                                                <div class="scroll-to-map mt-3">
                                                    <Link onClick={scrollToMap}>
                                                        <span class="icon icon-map-location"></span> View on map
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {property.payment_terms ?
                                            <>
                                                <hr class="line m-0 p-0 mt-1 mb-1" />
                                                <div class="peyment-terms">
                                                    Payment terms: {property.payment_terms}
                                                </div>
                                            </> :
                                            null
                                        }

                                        <hr class="line m-0 p-0 my-2" />

                                        <div class="row">
                                            {child.otherFeatures}
                                            {property.other_features.map((feature) => {
                                                return <div class="col-6 other-feature"><b>{feature.name}:</b> {feature.value}</div>;
                                            })}
                                        </div>

                                        {child.otherFeatures || property.other_features.length > 0 ?
                                            <hr class="line m-0 p-0 mt-2 mb-4" />: null
                                        }
                                        
                                        <Contact property={property} />
                                        <hr class="line d-lg-none m-0 p-0 mt-3 mb-2" />
                                    </div>
                                </div>

                                <div class="col-12 col-md-7 p-0 m-0 mt-3 mt-sm-0 pr-md-2 text-dark order-2 order-md-1">
                                    <Descriptions value={property.descriptions} />
                                    <Badges values={property.amenities.map((amenity) => amenity.name)} label="Amenities" />
                                    <Badges values={property.services.map((service) => service.name)} label="Nearby Services" />
                                    <Badges values={property.potentials.map((potential) => potential.name)} label="Potential For" />
                                </div>
                            </div>
                            
                            <div id="location-on-map" class="row p-0 m-0 px-3 px-sm-4 mt-md-4">
                                <div class="col-12 p-0 m-0 h5">Location</div>
                                <div class="col-12 p-0 m-0">
                                    {property.location.address}
                                </div>
                                <div class="col-12 map p-0 m-0">
                                    <Map location={{
                                        address: property.location.address,
                                        point: { lng: property.location.longitude, lat: property.location.latitude }
                                    }} />
                                </div>
                            </div>
                            <div class="p-0 m-0 mt-4">
                                <NearbyProperties except={property.id} point={{ lng: property.location.longitude, lat: property.location.latitude }}/>
                            </div>
                        </div>
                    </div>)
            }}</DataFetcher>
    )
}


function NearbyProperties(props) {
    const nearbyPropertiesEndpoint = `
    nearby-properties/?${PROPERTIES_QUERY_PARAM}
    &longitude=${props.point.lng}
    &latitude=${props.point.lat}
    &radius_to_scan=5000
    `
    const viewAllTitle = `View All`;
    const viewAllLink = `/nearby-properties/?lng=${props.point.lng}&lat=${props.point.lat}&radius_to_scan=5000`
    const selection = viewAllLink;

    return (
        <GenericFilter endpoint={nearbyPropertiesEndpoint} global selection={selection}
            placeholder={<GlowBlockLoader />} onError={renderInlineError}>{response => {
                let data = response.data[0];
                // Remove this current property to nearby properties
                data.results = data.results.filter(property => property.id != props.except);

                if (data.results.length < 3) {
                    return null;
                }
                return (
                    <div class="p-0 m-0 mt-4">
                        <SliderPropertiesGroup
                            selection={`nearby/property/${props.except}`} pl={3}
                            header="Nearby Properties"
                            response={response}
                            viewAllLink={viewAllLink}
                            viewAllTitle={viewAllTitle}
                        />
                    </div>
                );
            }}
        </GenericFilter>
    );
}


function Contact(props) {
    const contact = props.property.contact;
    const ownerPicture = props.property.owner.picture;
    return (
        <div class="col-12 p-0 m-0">
            <div class="h5 p-0 m-0 mt-3">Contact Dealer</div>
            <hr class="line m-0 p-0 mt-1 mb-2" />

            <div class="row p-0 m-0">
                <div class="col-10 p-0 m-0">
                    <div class="other-feature"><b>Name:</b> {contact.name}</div>
                    <div class="other-feature my-2"><b>Phone:</b> {contact.phone}</div>
                    <div class="other-feature mt-2"><b>Email:</b> {contact.email}</div>
                </div>
                <div class="col-2 p-0 m-0 mt-1 d-flex justify-content-end">
                    <div class="owner-profile-picture text-center">
                        {!ownerPicture ?
                            <span class="icon icon-user" /> :
                            <img src={ownerPicture.src} alt="" />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}


function price(property) {
    const cash = `${property.currency} ${thousandsSeparator(property.price)}`
    if (property.price_rate_unit) {
        return (
            <span class="price">
                <span class="amount">{cash}</span>
                <span class="forward-slash"> / </span>
                <span class="rate">{property.price_rate_unit}</span>
            </span>
        );
    }
    return (
        <span class="price">
            <span class="amount">{cash}</span>
        </span>
    );
}


function RoomDetails(props) {
    return (
        <PropertyDetails type="room" id={props.id}>
            {property => ({
                price: <div>{price(property)}</div>
            })}
        </PropertyDetails>
    );
}


function HouseDetails(props) {
    return (
        <PropertyDetails type="house" id={props.id}>
            {property => ({
                price: <div>{price(property)}</div>
            })}
        </PropertyDetails>
    );
}


function ApartmentDetails(props) {
    return (
        <PropertyDetails type="apartment" id={props.id}>
            {property => ({
                price: <div>{price(property)}</div>
            })}
        </PropertyDetails>
    );
}


function HostelDetails(props) {
    return (
        <PropertyDetails type="hostel" id={props.id}>
            {property => ({
                price: <div>{price(property)}</div>
            })}
        </PropertyDetails>
    );
}


function OfficeDetails(props) {
    return (
        <PropertyDetails type="office" id={props.id}>
            {property => ({
                price: <div>{price(property)}</div>
            })}
        </PropertyDetails>
    );
}


function isRegistered(registered) {
    if (registered === 'Y') {
        return 'Yes';
    }
    return 'No';
}


function LandDetails(props) {
    return (
        <PropertyDetails type="land" id={props.id}>
            {property => ({
                price: <div>{price(property)}</div>,

                otherFeatures: (
                    <>
                        {property.length !== null ?
                            <div class="property-length">
                                Length: {property.length}
                            </div> : null
                        }

                        {property.width !== null ?
                            <div class="property-width">
                                Width: {property.width}
                            </div> : null
                        }
                        {property.area !== null ?
                            <div class="property-area">
                                Area: {property.area}
                            </div> : null
                        }
                        <div class="property-is-registered">
                            Is Registered: {isRegistered(property.is_registered)}
                        </div>
                    </>
                )
            })}
        </PropertyDetails>
    );
}


function FrameDetails(props) {
    return (
        <PropertyDetails type="frame" id={props.id}>
            {property => ({
                price: <div>{price(property)}</div>
            })}
        </PropertyDetails>
    );
}

export {
    PropertyDetails, RoomDetails, HouseDetails, ApartmentDetails,
    HostelDetails, OfficeDetails, LandDetails, FrameDetails
}