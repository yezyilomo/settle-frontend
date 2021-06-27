import React, { useState } from 'react';
import './Rating.scss';

import { BASE_API_URL } from '../';
import { useMutation, queryCache } from 'react-query';
import { useGlobalState } from 'state-pool';


function Rating(props) {
    let initialState = {
        rating: props.property.total_rating_score || null,
        temp_rating: null
    }
    const [state, setState] = useState(initialState);
    const [animateClass, setAnimateClass] = useState("");

    const [user,] = useGlobalState("user");
    const [, ,setShowLogInModal] = useGlobalState("showLogInModal");
    const postUrl = `${BASE_API_URL}/property-ratings/`;
    const patchUrl = `${BASE_API_URL}/property-ratings/${props.property.my_rating}/`;
    const headers = {
        'Authorization': `Token ${user.auth_token}`,
        'Content-Type': 'application/json'
    }

    const responses = {

        onSuccess: (res) => {
            if (res.status === 200 || res.status === 201) {
                queryCache.invalidateQueries(`property/${props.property.id}`);
            }
            else {
                //setIsSaved(isSaved)
            }
        },

        onError: () => {
            //setIsSaved(isSaved);
        }
    }

    const [addRating] = useMutation((score) => {
        const body = JSON.stringify({ "property": props.property.id, "score": score });
        return fetch(postUrl, { body: body, method: 'POST', headers: headers })
    }, responses)

    const [editRating] = useMutation((score) => {
        const body = JSON.stringify({ "property": props.property.id, "score": score });
        return fetch(patchUrl, { body: body, method: 'PATCH', headers: headers })
    }, responses)


    let rate = (rating) => {
        if(!user.isLoggedIn) {
            setShowLogInModal(true);
            return;
        }
        else {
            setAnimateClass("animate-click");
            setState({
                rating: rating,
                temp_rating: rating
            });
        }

        if(props.property.my_rating){
            editRating(rating);
        }
        else {
            addRating(rating);
        }
    }

    let star_over = (rating) => {
        state.temp_rating = state.rating;
        state.rating = rating;

        setState({
            rating: state.rating,
            temp_rating: state.temp_rating
        });
    }

    let star_out = () => {
        state.rating = state.temp_rating;
        setState({ rating: state.rating });
    }

    let getStars = (i) => {
        let cls = 'star-rating__star';
        if (state.rating >= i && state.rating != null) {
            cls += ' is-selected';
        }
        return (
            <label className={cls}
                onClick={(e) => rate(i)}
                onMouseOver={(e) => star_over(i)}
                onMouseOut={(e) => star_out(i)}
                onAnimationEnd={() => setAnimateClass("")}>
                <i class="fa fa-star"></i>
            </label>
        );
    }

    return (
        <span className={`star-rating ${animateClass}`}>
            {[1, 2, 3, 4, 5].map(i => getStars(i))}
        </span>
    );
}

export { Rating }
