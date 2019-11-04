import React from 'react';
import './BottomNavBar.css';
import { withRouter } from 'react-router-dom';


function BottomNavBar(props){
    let homePath = "/";
    let filterPath = "/filter";
    let rentPath = "/rent-property";
    let buyPath = "/buy-property";
    let bookPath = "/book-property";

    let goToHome = (e) => {
        props.history.push(homePath)
    }
    let goToFilter = (e) => {
        props.history.push(filterPath)
    }
    let goToRent = (e) => {
        props.history.push(rentPath)
    }
    let goToBuy = (e) => {
        props.history.push(buyPath)
    }
    let goToBook = (e) => {
        props.history.push(bookPath)
    }

    let active = (iconPath) => {
        let currentPath = props.history.location.pathname;
        if(currentPath === iconPath){
            return ["_neg", "active-text"];
        }
        return ["", ""]
    }

    return (
        <div class="bottom-nav-bar d-lg-none row fixed-bottom">
            <div class="col text-center btn-ripple" onClick={goToHome}>
                <img src={`icons/magnifying-glass${active(homePath)[0]}.svg`} width="24" height="24" alt=""/>
                <div class={`icon-label ${active(homePath)[1]}`}>&nbsp;&nbsp;&nbsp;EXPLORE</div>
            </div>
            <div class="col text-center btn-ripple" onClick={goToRent}>
                <img src={`icons/house${active(rentPath)[0]}.svg`} width="24" height="24" alt=""/>
                <div class={`icon-label ${active(rentPath)[1]}`}>RENT</div>
            </div>
            <div class="col text-center btn-ripple" onClick={goToBuy}>
                <img src={`icons/tag${active(buyPath)[0]}.svg`} width="24" height="24" alt=""/>
                <div class={`icon-label ${active(buyPath)[1]}`}>&nbsp;&nbsp;BUY</div>
            </div>
            <div class="col text-center btn-ripple" onClick={goToBook}>
                <img src={`icons/star${active(bookPath)[0]}.svg`} width="24" height="24" alt=""/>
                <div class={`icon-label ${active(bookPath)[1]}`}>&nbsp;BOOK</div>
            </div>
            <div class="col text-center btn-ripple" onClick={goToFilter}>
                <img src={`icons/settings${active(filterPath)[0]}.svg`} width="24" height="24" alt=""/>
                <div class={`icon-label ${active(filterPath)[1]}`}>FILTER</div>
            </div>
        </div>
    );
}

let comp = withRouter(BottomNavBar);

export {comp as BottomNavBar}
