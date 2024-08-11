import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state type
interface CountState {
  value: number;
}

// Set the initial state
const initialState: CountState = {
  value: 0,
};

// Create the slice
const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    // Increment the count
    increment: (state) => {
      state.value += 1;
    },
    // Decrement the count
    decrement: (state) => {
      state.value -= 1;
    },
    // Reset the count to 0
    reset: (state) => {
      state.value = 0;
    },
    // Set count to a specific value
    setCount: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

// Export actions
export const { increment, decrement, reset, setCount } = countSlice.actions;

// Export the reducer
export default countSlice.reducer;
