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
        scrollY > 500 ?
            <div class="scroll-up d-lg-none" onClick={scrollUp}>
                <span class="icon icon-up-arrow"></span>
            </div> :
            null
    );
}

export {TopScroller}
