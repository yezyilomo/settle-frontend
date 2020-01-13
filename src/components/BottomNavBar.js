import React from 'react';
import './BottomNavBar.scss';
import { useHistory } from 'react-router';


function BottomNavBar(props){
    let history = useHistory();
    let homePath = "/";
    let filterPath = "/filter";
    let rentPath = "/rent-property";
    let buyPath = "/buy-property";
    let bookPath = "/book-property";

    let goToHome = (e) => {
        history.push(homePath)
    }
    let goToFilter = (e) => {
        history.push(filterPath)
    }
    let goToRent = (e) => {
        history.push(rentPath)
    }
    let goToBuy = (e) => {
        history.push(buyPath)
    }
    let goToBook = (e) => {
        history.push(bookPath)
    }

    let active = (iconPath) => {
        let currentPath = history.location.pathname;
        if(currentPath === iconPath){
            return ["active-icon", "active-text"];
        }
        return ["", ""]
    }

    return (
        <div class="bottom-nav-bar d-lg-none row fixed-bottom">
            <div class="col text-center btn-ripple" onClick={goToHome}>
                <span class={`icon icon-search ${active(homePath)[0]}`}></span>
                <div class={`icon-label ${active(homePath)[1]}`}>&nbsp;&nbsp;EXPLORE</div>
            </div>
            <div class="col text-center btn-ripple" onClick={goToRent}>
                <span class={`icon icon-house ${active(rentPath)[0]}`}></span>
                <div class={`icon-label ${active(rentPath)[1]}`}>RENT</div>
            </div>
            <div class="col text-center btn-ripple" onClick={goToBuy}>
                <span class={`icon icon-tag ${active(buyPath)[0]}`}></span>
                <div class={`icon-label ${active(buyPath)[1]}`}>BUY</div>
            </div>
            <div class="col text-center btn-ripple" onClick={goToBook}>
                <span class={`icon icon-star ${active(bookPath)[0]}`}></span>
                <div class={`icon-label ${active(bookPath)[1]}`}>BOOK</div>
            </div>
            <div class="col text-center btn-ripple" onClick={goToFilter}>
                <span class={`icon icon-settings ${active(filterPath)[0]}`}></span>
                <div class={`icon-label ${active(filterPath)[1]}`}>FILTER</div>
            </div>
        </div>
    );
}

export {BottomNavBar}
