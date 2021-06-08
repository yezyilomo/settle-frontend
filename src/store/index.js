import { getUserInfoFromCookies } from '../utils';
import { store } from 'state-pool'


function initializeStore(){
    let userInfo = getUserInfoFromCookies([
        "auth_token", "id", "username", "email",
        "phone", "full_name", "profile_picture"
    ])
    
    if (userInfo.auth_token !== null) {
        userInfo.isLoggedIn = true;
    }
    else {
        userInfo.isLoggedIn = false;
    }
    
    
    // Set user state
    store.setState(
        "user",
        userInfo
    )

    
    // Set showLogInModal
    store.setState(
        "showLogInModal",
        false
    )


    // Set showSignUpModal
    store.setState(
        "showSignUpModal",
        false
    )
    
    
    // Sidebar state
    store.setState(
        "sideBar",
        {
            price__lt: 950000,
            price__gt: 50000,
            currency: "",
            location: {
                address: "",
                point: null
            },
            available_for: "rent",
            property_type: "houses",
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