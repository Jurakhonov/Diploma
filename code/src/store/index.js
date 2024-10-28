// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/products';

const store = configureStore({
    reducer: {
        products: productsReducer,
    },
});

export default store;
