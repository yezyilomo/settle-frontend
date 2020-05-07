import { getCookie } from '../utils';
import { store } from 'state-pool'


const initialState = {}


function initializeStore(){
    store.init(initialState);

    let isLoggedIn = false;
    let authToken = getCookie("auth_token");
    let id = getCookie("id");
    let username = getCookie("usernamen");
    let email = getCookie("email");
    let phone = getCookie("phone");
    let full_name = getCookie("full_name");
    
    if (authToken !== null) {
        isLoggedIn = true;
    }
    
    
    // Set user state
    store.setState(
        "user",
        {
            isLoggedIn: isLoggedIn,
            authToken: authToken,
            id: id,
            email: email,
            username: username,
            phone: phone,
            full_name: full_name
        }
    )
    
    
    // Sidebar state
    store.setState(
        "sideBar",
        {
            price__lt: "",
            price__gt: "",
            currency: "",
            location: "",
            available_for: "",
            property_type: "",
            amenities: []
        }
    )
    
    
    // Signup state
    store.setState(
        "signUp",
        {
            full_name: "",
            email: "",
            profile_pic: null,
            username: "",
            password: ""
        }
    )
    
    
    // My properties filter
    store.setState(
        "myProperties",
        {}
    )
}

export {initializeStore};