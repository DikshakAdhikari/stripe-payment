import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Book {
  bookname: string;
  image: string;
  description: string;
  price: number;
  genre: string;
  quantity: number;
  fileId: string;
}


const initialState: Book[] = [];

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    
    addBook: (state, action: PayloadAction<Book>) => {
      state.push(action.payload);
    },
   
    setBooks: (state, action: PayloadAction<Book[]>) => {
      return action.payload;
    },
    
    resetBooks: () => {
      return initialState;
    },
  },
});

// Export actions
export const { addBook, setBooks, resetBooks } = booksSlice.actions;

// Export the reducer
export default booksSlice.reducer;
