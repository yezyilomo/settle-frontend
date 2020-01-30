import { configureStore } from 'simple-react-state';


const initialState = {}

const store = configureStore({
    initialState: initialState
});

export default store