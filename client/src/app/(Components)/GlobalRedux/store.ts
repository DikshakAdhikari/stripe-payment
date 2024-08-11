'use client';

import { configureStore } from '@reduxjs/toolkit';
import countReducer from './Features/CounterSlice';


export const store = configureStore({
    reducer: {
      count: countReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;