import React, {useState} from 'react';
import { PropertyOverview, GlowInlineLoader, Carousel } from './'
import { PropertySliderOverview } from './PropertyOverview';
import './PropertyGroup.css';
import {onScrollToBottom} from '../utils';


function PropertyGroup(props) {
    let { next, prev, count, results } = props.properties;
    let metaDataObj = {
        count: count,
        next: next,
        prev: prev
    }

    let [metaData, setMetaData] = useState(metaDataObj);
    let [properties, setProperties] = useState(results);
    let [loading, setLoading] = useState(false);

    let fetchMore = () => {
        if(props.onScrollToBottom !== undefined && metaData.next !== null){
            setLoading(true);
            props.onScrollToBottom(metaData, setMetaData, setProperties);
        }
        else{
            setLoading(false);
        }
    }

    window.onScrollActions.fetchMore = onScrollToBottom(fetchMore);

    return (
        <div class="property-container row m-0 p-0">
            <h6 class="w-100 ml-2 mb-0 mt-0 font-weight-bold">{props.header}</h6>
            {properties.length === 0?
                <div class="ml-2 mt-5">
                  <div>
                      No results found!..
                  </div>
                </div>:
                null
            }
            {properties.map(property =>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 p-2 m-0">
                    <PropertyOverview property={property} edit={props.edit}/>
                </div>
            )}
            {loading?
                <GlowInlineLoader/>:
                null
            }
        </div>
    )
}


function PropertySlider(props) {
    let { next, prev, count, results } = props.properties;
    let metaDataObj = {
        count: count,
        next: next,
        prev: prev
    }

    let [metaData, setMetaData] = useState(metaDataObj);
    let [properties, setProperties] = useState(results);
    let [loading, setLoading] = useState(false);

    let fetchMore = () => {
        if(props.onScrollToBottom !== undefined && metaData.next !== null){
            setLoading(true);
            props.onScrollToBottom(metaData, setMetaData, setProperties);
        }
        else{
            setLoading(false);
        }
    }

    window.onScrollActions.fetchMore = onScrollToBottom(fetchMore);
    
    let settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 2,
        centerMode: true,
        centerPadding: "50px 0 0 0",
        adaptiveHeight: true,
        swipeToSlide: true,
        adaptiveHeight: true,
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
            <h6 class="w-100 ml-2 pl-1 pl-md-2 mb-2 mt-0 font-weight-bold">{props.header}</h6>
            <Carousel className="col-12 p-0 m-0" {...settings}>
                {properties.map(property =>
                    <div class="pr-2 pr-md-3 slider">
                        <PropertySliderOverview property={property} edit={props.edit}/>
                    </div>
                )}
            </Carousel>
        </div>
    )
}

export { PropertyGroup, PropertySlider };
