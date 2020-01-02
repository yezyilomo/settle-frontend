import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { PropertyOverview, GlowInlineLoader, Carousel } from '.'
import { PropertySliderOverview } from './PropertyOverview';
import './ResourcesGroups.scss';
import {onScrollToBottom} from '../utils';


function GenericResourcesGroup(props) {
    let [loading, setLoading] = useState(false);
    let { next, results } = props.resources;

    let fetchMoreResources = () => {
        if(props.onScrollToBottom !== undefined && next !== null){
            setLoading(true);
            props.onScrollToBottom(props.resources);
        }
        else{
            setLoading(false);
        }
    }

    window.onScrollActions.fetchMoreResources = onScrollToBottom(fetchMoreResources);

    return (
        <div class="row m-0 p-0">
            <div class="group-header col-12 p-0 m-0 px-1 px-sm-2">{props.header}</div>
            {results.length === 0?
                <div class="ml-2 mt-5">
                  <div>
                      No results found!..
                  </div>
                </div>:
                null
            }
            {results.map(resource =>
                <div class="col-6 col-sm-6 col-md-4 col-lg-3 m-0 p-0 my-2 px-1 px-sm-2">
                    {props.children(resource)}
                </div>
            )}
            {loading?
                <GlowInlineLoader/>:
                null
            }
        </div>
    )
}


function PropertiesGroup(props) {
    return (
        <GenericResourcesGroup header={props.header} resources={props.properties} onScrollToBottom={props.onScrollToBottom}>
            {property => 
                <PropertyOverview property={property}/>
            }
        </GenericResourcesGroup>
    )
}


function SliderPropertiesGroup(props) {
    let properties = props.properties.results;
    let settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 1,
        centerMode: true,
        centerPadding: "50px 0 0 0",
        adaptiveHeight: true,
        swipeToSlide: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    initialSlide: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    initialSlide: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    initialSlide: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    initialSlide: 0,
                }
            }
        ]
    }

    return (
        <div class="property-container row m-0 p-0">
            <div class="group-header col-12 p-0 m-0 px-2 px-sm-4">{props.header}</div>
            <Carousel className="col-12 p-0 m-0 mt-2" {...settings}>
                {properties.map(property =>
                    <div class="m-0 p-0 pl-2    pl-sm-0   ml-sm-4 pr-sm-3">
                        <PropertySliderOverview property={property}/>
                    </div>
                )}
            </Carousel>
        </div>
    )
}


function TwoRowsPropertiesGroup(props) {
    let properties = props.properties.results;
    return (
        <div class="property-container row m-0 p-0       d-4 d-sm-4 d-md-6 d-lg-8">
            <div class="group-header col-12 m-0 p-0 px-1 px-sm-2">{props.header}</div>
            {properties.slice(0,8).map((property, index) =>
                <div class={`col-6 col-md-4 col-lg-3 m-0 p-0 my-2 px-1 px-sm-2   d-none-${index+1}`}>
                    <PropertyOverview property={property}/>
                </div>
            )}
            {props.footer?
                <div class="group-footer col-12 m-0 p-0 px-1 px-sm-2 mt-2">
                    <div class="row p-0 m-0">
                        <Link class="show-all-btn btn-ripple c-anchor col-12 text-center d-md-none py-2 bw-1" 
                        to={{pathname: "/group-properties/", state: {endpoint: props.endpoint, header: props.detailedHeader}}}>
                            {props.footer}
                        </Link>

                        <Link class="show-all-btn-md c-anchor d-none d-md-inline bw-1 bw-md-0" 
                        to={{pathname: "/group-properties/", state: {endpoint: props.endpoint, header: props.detailedHeader}}}>
                            {props.footer}
                        </Link>
                    </div>
                </div>:
                null
            }
        </div>
    )
}


export { GenericResourcesGroup, PropertiesGroup, SliderPropertiesGroup, TwoRowsPropertiesGroup };
