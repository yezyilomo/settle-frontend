function setErrorClass(query = "input, select, textarea") {
    const inputs = document.querySelectorAll(query);

    inputs.forEach(input => {
        input.addEventListener(
            "invalid",
            event => {
                input.classList.add("error");
            },
            false
        );
    });
}

let propertyTypes = {
    "generic": "properties",
    "room": "rooms",
    "house": "houses",
    "apartment": "apartments",
    "hostel": "hostels",
    "office": "offices",
    "hall": "halls",
    "land": "lands",
    "frame": "frames"
}

function getPropertyRoute(propertyType){
    return propertyTypes[propertyType]
}

function getPropertyType(propertyRoute){
    let propertyRoutes = {}
    for(let route in propertyTypes){
        let key = propertyTypes[route]
        propertyRoutes[key] = route
    }
    return propertyRoutes[propertyRoute]
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function onScrollToBottom(handleScrollToBottom, y = 1) {
    let scrollToBottomEventHandler = () => {
        let scrollTop = (
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop || 0
        );

        let distanceFromBottom = (
            document.documentElement.offsetHeight -
            (window.innerHeight + scrollTop)
        )

        if (distanceFromBottom < y && distanceFromBottom > -1) {
            handleScrollToBottom();
        }
    };

    return scrollToBottomEventHandler
}

export {
    setErrorClass, getCookie, onScrollToBottom, getPropertyRoute, getPropertyType
}
