import React, { useState } from 'react';


function scrollUp(event) {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

function TopScroller(props) {
    let [scrollY, setScrollY] = useState(0);
    let setY = () => {
        setScrollY(window.scrollY)
    }
    window.onScrollActions.updateY = setY;

    return (
        scrollY > 800 ?
            <div class="scroll-up click-effect d-lg-none">
                <span class="icon icon-up-arrow" onClick={scrollUp}></span>
            </div> :
            null
    );
}

export {TopScroller}
