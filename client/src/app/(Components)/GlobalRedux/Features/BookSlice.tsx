import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Book type
interface Book {
  bookname: string;
  image: string;
  description: string;
  price: number;
  genre: string;
  quantity: number;
}

// Define the initial state using that type
const initialState: Book[] = [];

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // Reducer to add a new book
    addBook: (state, action: PayloadAction<Book>) => {
      state.push(action.payload);
    },
    // Reducer to set the entire array of books
    setBooks: (state, action: PayloadAction<Book[]>) => {
      return action.payload;
    },
    // Reducer to reset the array to the initial state
    resetBooks: () => {
      return initialState;
    },
  },
});

// Export actions
export const { addBook, setBooks, resetBooks } = booksSlice.actions;

// Export the reducer
export default booksSlice.reducer;
