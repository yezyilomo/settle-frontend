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

function setCookie({name, value, expires, path='/', sameSite='Lax'}){
    document.cookie = `${name}=${value};path=${path};expires=${expires};SameSite=${sameSite};`;
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

function saveUserInfoToCookies(userData){
    var d = new Date();
    d.setTime(d.getTime() + 30*24*60*60*1000); // in milliseconds
    for(let infoName in userData){
        setCookie({name: infoName, value: userData[infoName], expires: d.toGMTString()})
    }
}

function getUserInfoFromCookies(cookieNames){
    let userInfo = {}
    cookieNames.forEach(cookieName => { userInfo[cookieName] = getCookie(cookieName)})
    return userInfo;
}

function deleteUserInfoFromCookies(cookieNames){
    var d = new Date();
    d.setTime(d.getTime() - 24 * 60 * 60 * 1000); // in milliseconds
    cookieNames.forEach(cookieName => setCookie({name: cookieName, value: "", expires: d.toGMTString()}))
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

/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {Function} saveImage- Function which receives cropped image and saves
 */
function cropImage(image, crop, saveImage) {
    image.onload = function () {
        const canvas = document.createElement('canvas');

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const sx = crop.x * scaleX;
        const sy = crop.y * scaleY;
        const sw = crop.width * scaleX;
        const sh = crop.height * scaleY;
        const dx = 0;
        const dy = 0;
        const dw = crop.width * scaleX;
        const dh = crop.height * scaleY;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            image,
            sx, sy, sw, sh,  // Source dimensions
            dx, dy, dw, dh  // Destination dimensions
        );

        canvas.toBlob(saveImage, 'image/jpeg', 1);
    }
}

function setTabColorDark(conditionToChangeColor){
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (conditionToChangeColor) {
        metaThemeColor.setAttribute("content", "rgb(14, 14, 14)");
    }
    else {
        metaThemeColor.setAttribute("content", "white");
    }
}

export {
    setErrorClass, setCookie, getCookie, saveUserInfoToCookies, 
    getUserInfoFromCookies, deleteUserInfoFromCookies, onScrollToBottom, 
    propertyTypes, getPropertyRoute, getPropertyType, cropImage, setTabColorDark
}
