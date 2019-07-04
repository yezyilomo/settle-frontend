import { useReducer } from 'react';
import {updateReducer} from '../reducers';

function useLocalState(initialState){
    return useReducer(updateReducer, initialState);
}

export {useLocalState}
