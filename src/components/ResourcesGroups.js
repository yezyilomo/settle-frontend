import React from 'react';
import './ResourcesGroups.scss';
import { parse } from 'query-string';
import { Link, useHistory } from 'react-router-dom';
import { PropertyOverview, GlowBlockLoader, GlowInlineLoader, Carousel } from '.'
import { PropertySliderOverview } from './PropertyOverview';
import { onScrollToBottom } from '../utils';
import { useRestoreScrollState, usePageTransition } from '../hooks';
import { useGlobalState } from 'state-pool';


function GenericResourcesGroup(props) {
    const animate = usePageTransition()
    useRestoreScrollState();
    const [view, , setView] = useGlobalState(props.viewKey, { default: 'grid' });

    let fetchMoreResources = () => {
        if (props.response.canFetchMore) {
            props.response.fetchMore()
        }
    }

    const getView = () => {
        if (view === 'list') {
            return "col-12 col-sm-6"
        }
        return "col-6 col-sm-6"
    }

    const showListView = (e) => {
        setView("list");
    }

    const showGridView = (e) => {
        setView("grid");
    }

    if (props.FetchMoreOnScrollToBottom) {
        window.onScrollActions.fetchMoreResources = onScrollToBottom(fetchMoreResources, 200);
    }

    return (
        <div class={`row m-0 p-0 ${animate()}`}>
            {view === "list" ?
                <span class="view-icon d-sm-none fas fa-th-large" onClick={showGridView}></span>:
                <span class="view-icon d-sm-none fas fa-list-ul" onClick={showListView}></span>
            }
            <div class="group-header col-12 p-0 m-0 px-1 px-sm-2">{props.header}</div>
            {props.response.data[0].length === 0 ?
                <div class="ml-2 mt-5">
                    <div>
                        No results found!..
                  </div>
                </div> :
                null
            }
            {props.response.data.map((resourcesGroup, i) =>
                <React.Fragment key={i}>
                    {resourcesGroup.results.map(resource =>
                        <div class={`${getView()} col-md-4 col-lg-3 m-0 p-0 my-2 px-1 px-sm-2`}>
                            {props.children(resource)}
                        </div>
                    )}
                </React.Fragment>
            )}

            <div class="col-12 py-2" />

            {props.response.isFetchingMore ?
                <div class="col-12 m-0 p-0" style={{ position: 'relative', bottom: '25px' }}>
                    <GlowBlockLoader />
                </div> :
                null
            }
        </div>
    )
}


function PropertiesGroup(props) {
    return (
        <GenericResourcesGroup
            viewKey={props.viewKey}
            header={props.header}
            response={props.response}
            FetchMoreOnScrollToBottom={props.FetchMoreOnScrollToBottom}>
            {property =>
                <PropertyOverview property={property} />
            }
        </GenericResourcesGroup>
    )
}


function SliderPropertiesGroup(props) {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 1,
        centerMode: true,
        centerPadding: "50px 0 0 0",
        adaptiveHeight: false,
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

    let fetchMoreResources = () => {
        if (props.response.canFetchMore) {
            props.response.fetchMore()
        }
    }

    let count = props.response.data[0].count;
    if (count == 0) {
        return null;
    }

    let properties = [];
    
    props.response.data.forEach(group => {
        properties = [...properties, ...group.results]
    });

    return (
        <div class="property-container row m-0 p-0">
            <div class={`group-header col-12 p-0 m-0 px-${props.pl || 2} px-sm-4`}>{props.header}</div>
            <Carousel className="col-12 p-0 m-0 mt-2 slider" {...settings}>
                {properties.map(property =>
                    <div class={`m-0 p-0 pl-${props.pl || 2}  pl-sm-0 ml-sm-4 pr-sm-3`}>
                        <PropertySliderOverview property={property} />
                    </div>
                )}

                {props.response.canFetchMore && !props.response.isFetchingMore ?
                    <div>
                        <div class="load-more-button" onClick={fetchMoreResources}>
                            <span class="icon icon-next"></span>
                        </div>
                    </div> :
                    null
                }

                {props.response.isFetchingMore ?
                    <div>
                        <div class="loading-more">
                            <GlowInlineLoader />
                        </div>
                    </div> :
                    null
                }
            </Carousel>
        </div>
    )
}


function TwoRowsPropertiesGroup(props) {
    let properties = props.properties.results;
    if (properties.length == 0) {
        return null;
    }
    return (
        <div class="property-container row m-0 p-0       d-4 d-sm-4 d-md-6 d-lg-8">
            <div class="group-header col-12 m-0 p-0 px-1 px-sm-2">{props.header}</div>
            {properties.slice(0, 8).map((property, index) =>
                <div class={`col-6 col-md-4 col-lg-3 m-0 p-0 my-2 px-1 px-sm-2   d-none-${index + 1}`}>
                    <PropertyOverview property={property} />
                </div>
            )}
            
            {props.footer ?
                <div class="group-footer col-12 m-0 p-0 px-1 px-sm-2 mt-2">
                    <div class="row p-0 m-0">
                        <Link to={props.footerLink} class="show-all-btn btn-ripple text-decoration-none col-12 text-center d-md-none py-2 bw-1">
                            {props.footer}
                        </Link>

                        <Link to={props.footerLink} class="show-all-btn-md text-decoration-none d-none d-md-inline bw-1 bw-md-0">
                            {props.footer}
                        </Link>
                    </div>
                </div> :
                null
            }
        </div>
    )
}


export { GenericResourcesGroup, PropertiesGroup, SliderPropertiesGroup, TwoRowsPropertiesGroup };
