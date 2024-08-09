import express from 'express'
import { createBook, deleteBook, getAllBooks, updatedBook, userBooks } from '../controllers/books.js';
import { verifyToken } from '../middlewares/auth.js';
const router=express.Router();

router.post("/create",verifyToken,createBook);
router.get("/allBooks",getAllBooks);
router.delete('/deleteBook/:id',verifyToken,deleteBook);
router.put('/update/:id',verifyToken,updatedBook);
router.get('/userBook/:id',verifyToken,userBooks);


export default router;