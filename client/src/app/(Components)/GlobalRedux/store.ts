'use client';
import { configureStore } from '@reduxjs/toolkit';
import countReducer from './Features/CounterSlice';
import booksReducer from './Features/BookSlice';


export const store = configureStore({
    reducer: {
      books: booksReducer,
      count: countReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;