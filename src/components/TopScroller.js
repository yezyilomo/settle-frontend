import React, { useState } from 'react';
import './TopScroller.scss';


function scrollUp(event) {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

function TopScroller(props) {
    const [scrollY, setScrollY] = useState(0);
    
    let setY = () => {
        setScrollY(window.scrollY)
    }
    window.onScrollActions.updateY = setY;

    return (
        scrollY > 800 ?
            <div class="scroll-up d-lg-none">
                <span class="icon icon-up-arrow" onClick={scrollUp}></span>
            </div> :
            null
    );
}

export {TopScroller}
