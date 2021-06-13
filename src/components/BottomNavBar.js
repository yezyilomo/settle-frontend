import React from 'react';
import './BottomNavBar.scss';
import { useHistory } from 'react-router';
import { useGlobalState } from 'state-pool';


function RippleButton({ children, onClick }) {
    const [coords, setCoords] = React.useState({ x: -1, y: -1 });
    const [isRippling, setIsRippling] = React.useState(false);
  
    React.useEffect(
      () => {
        if (coords.x !== -1 && coords.y !== -1) {
          setIsRippling(true);
          setTimeout(() => setIsRippling(false), 1200);
        } else setIsRippling(false);
      },
      [coords]
    );
  
    React.useEffect(
      () => {
        if (!isRippling) setCoords({ x: -1, y: -1 });
      },
      [isRippling]
    );

      /* Original version
    const ripplePositionStyle = {
        left: coords.x + 10,
        top: coords.y
    }
    */

    const ripplePositionStyle = {
      // Don't use this for now
    }
  
    return (
      <div
        className="ripple-button"
        onClick={e => {
          var rect = e.target.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          setCoords({ x, y });
          onClick && onClick(e);
        }}
      >
        {isRippling ? (
          <span
            className="ripple"
            style={ripplePositionStyle}
          />
        ) : (
          ""
        )}
        <span className="content">{children}</span>
      </div>
    );
  }
  

function BottomNavBar(props){
    const history = useHistory();
    const [,,setAnimatePageTransition] = useGlobalState("animatePageTransition");
    let homePath = "/";
    let filterPath = "/filter";
    let rentPath = "/rent-property";
    let buyPath = "/buy-property";
    let savedPropertiesPath = "/my-fav-properties";

    let goTo = (location) => {
        if(location === history.location.pathname){
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
        else {
            setAnimatePageTransition(true);
            history.push(location)
        }
    }

    let goToHome = (e) => {
        goTo(homePath)
    }
    let goToFilter = (e) => {
        goTo(filterPath)
    }
    let goToRent = (e) => {
        goTo(rentPath)
    }
    let goToBuy = (e) => {
        goTo(buyPath)
    }
    let goToSavedProperties = (e) => {
        goTo(savedPropertiesPath)
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
            <div class="col text-center">
                <RippleButton onClick={goToHome}>
                    <span class={`icon icon-search ${active(homePath)[0]}`}></span>
                    <div class={`icon-label ${active(homePath)[1]}`}>&nbsp;&nbsp;EXPLORE</div>
                </RippleButton>
            </div>
            <div class="col text-center">
                <RippleButton onClick={goToRent}>
                    <span class={`icon icon-house ${active(rentPath)[0]}`}></span>
                    <div class={`icon-label ${active(rentPath)[1]}`}>RENT</div>
                </RippleButton>
            </div>
            <div class="col text-center">
                <RippleButton onClick={goToBuy}>
                    <span class={`icon icon-tag ${active(buyPath)[0]}`}></span>
                    <div class={`icon-label ${active(buyPath)[1]}`}>BUY</div>
                </RippleButton>
            </div>

            <div class="col text-center">
                <RippleButton onClick={goToSavedProperties}>
                    <span class={`icon icon-heart ${active(savedPropertiesPath)[0]}`}></span>
                    <div class={`icon-label ${active(savedPropertiesPath)[1]}`}>SAVED</div>
                </RippleButton>
            </div>

            <div class="col text-center">
                <RippleButton onClick={goToFilter}>
                    <span class={`icon icon-settings ${active(filterPath)[0]}`}></span>
                    <div class={`icon-label ${active(filterPath)[1]}`}>FILTER</div>
                </RippleButton>
            </div>
        </div>
    );
}

export {BottomNavBar}
