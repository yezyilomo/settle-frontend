import React, { } from 'react';
import './BottomNavBar.css';
import { withRouter } from 'react-router-dom';
import { useGlobalState } from '../hooks';

function BottomNavBar(props){
    let [topBarStates, ] = useGlobalState("TopBar");
    let search = (e) => {
        topBarStates.searchElement.current.focus();
    }

    let filterPath = "/filter";
    let rentPath = "/rent-property";
    let buyPath = "/buy-property";
    let bookPath = "/book-property";
    let searchPath = "/search";

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
            return "_neg";
        }
        return ""
    }

    let setActive = (e) => {
        alert('Hello')
    }

    return (
        <div class="bottom-nav-bar d-md-none row fixed-bottom">
            <div class="col text-center">
                <img src={`icons/house${active(rentPath)}.svg`} width="25" height="25" alt="" onClick={goToRent}/>
            </div>
            <div class="col text-center">
                <img src={`icons/tag${active(buyPath)}.svg`} width="25" height="25" alt="" onClick={goToBuy}/>
            </div>
            <div class="col text-center">
                <img src={`icons/book${active(bookPath)}.svg`} width="25" height="25" alt="" onClick={goToBook}/>
            </div>
            <div class="col text-center">
                <img src={`icons/settings${active(filterPath)}.svg`} width="25" height="25" alt="" onClick={goToFilter}/>
            </div>
            <div class="col text-center">
                <img src={`icons/magnifying-glass${active(searchPath)}.svg`} width="25" height="25" alt="" onClick={search}/>
            </div>
        </div>
    );
}

let comp = withRouter(BottomNavBar);

export {comp as BottomNavBar}
