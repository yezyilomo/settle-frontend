import { useReducer } from 'react';
import {updateReducer} from '../reducers';

function useLocalState(initialState){
    // [state, updateState]
    return useReducer(updateReducer, initialState);
}


export {useLocalState}
