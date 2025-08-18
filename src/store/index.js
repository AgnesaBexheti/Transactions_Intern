import {configureStore} from '@reduxjs/toolkit';
import uiSlice from './ui-slice';

configureStore({
    reducer: {ui: uiSlice.reducer}});


    export default store;