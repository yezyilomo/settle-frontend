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

    const ripplePositionStyle = {
        left: "34px",
        top: "11px"
      }

    /* Original version
    const ripplePositionStyle = {
        left: coords.x + 10,
        top: coords.y
      }
    */
  
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
    const [user, ] = useGlobalState("user");
    let homePath = "/";
    let filterPath = "/filter";
    let rentPath = "/rent-property";
    let buyPath = "/buy-property";
    let savedPropertiesPath = "/my-fav-properties";

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
    let goToSavedProperties = (e) => {
        history.push(savedPropertiesPath)
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
            {user.isLoggedIn ?
                <div class="col text-center">
                    <RippleButton onClick={goToSavedProperties}>
                        <span class={`icon icon-heart ${active(savedPropertiesPath)[0]}`}></span>
                        <div class={`icon-label ${active(savedPropertiesPath)[1]}`}>SAVED</div>
                    </RippleButton>
                </div> : null
            }

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
