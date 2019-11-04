import React, { useState } from 'react';
import './Rating.css';


function App(props) {
  return <Rating rating={props.rating} />
}

function Rating(props) {
    let initialState = {
      rating: props.rating || null,
      temp_rating: null
    }
    let [state, setState] = useState(initialState);

    let rate = (rating) => {
        setState({
          rating: rating,
          temp_rating: rating
        });
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
            onClick={(e)=>rate(i)}
            onMouseOver={(e)=>star_over(i)}
            onMouseOut={(e)=>star_out(i)}>
                <i class="fa fa-star"></i>
           </label>
       );
    }

    return (
        <span className="star-rating">
            {[1,2,3,4,5].map(i=>getStars(i))}
        </span>
    );
}


export { App as Rating }
