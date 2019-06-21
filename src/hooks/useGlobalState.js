import { useGlobal, useDispatch} from 'reactn';
import {updateReducer} from '../reducers';


function useGlobalState(stateName){
    let [state, ] = useGlobal(stateName);
    let updateState = useDispatch(updateReducer, stateName);
    return [state, updateState];
}

export {useGlobalState}
