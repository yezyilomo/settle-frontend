import { configureStore } from 'simple-react-state';
import { getCookie } from '../utils';


let isLoggedIn = false;
let authToken = getCookie("auth_token");
let id = getCookie("id");
let username = getCookie("usernamen");
let email = getCookie("email");

if (authToken !== null) {
    isLoggedIn = true;
}

const preloadedState = {
    user: {
        isLoggedIn: isLoggedIn,
        authToken: authToken,
        id: id,
        email: email,
        username: username
    },

    signUp: {
        first_name: "", 
        last_name: "", 
        email: "",
        profile_pic: "", 
        username: "", 
        password: "",
        country: "", 
        city: "", 
        street: ""
    },
    
    sideBar: {
        price__lt: "",
        price__gt: "",
        location: "",
        amenities: []
    }
}


const store = configureStore({
    preloadedState: preloadedState
});

export default store