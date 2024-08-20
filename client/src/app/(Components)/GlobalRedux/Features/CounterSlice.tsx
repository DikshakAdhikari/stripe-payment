import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface CountState {
  value: number;
}


const initialState: CountState = {
  value: 0,
};


const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
  
    increment: (state) => {
      state.value += 1;
    },
   
    decrement: (state) => {
      state.value -= 1;
    },
   
    reset: (state) => {
      state.value = 0;
    },
   
    setCount: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});


export const { increment, decrement, reset, setCount } = countSlice.actions;


export default countSlice.reducer;
