import Books from "../models/books.js";
import files from "../models/files.js";
export const createBook = async (req, res) => {
  try {
    const { bookname, image, description, price, genre, file } = req.body;
    const userId = req.clientId;

    const newFile= await files.create({
      file:file
    })
    const savedFile= await newFile.save()

    const newBook = await Books.create({
      bookname,
      image,
      description,
      price,
      userId,
      genre,
      fileId:savedFile._id
    });
   await newBook.save()
    res.json(newBook);
  } catch (error) {
    console.log(error);
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const category = req.query.category;

    if (!category) {
      const books = await Books.find();
      return res.json(books);
    }

    let arr = category.split(",");

    let newArr = arr.map((val) => ({ genre: val.trim() }));

    console.log(newArr); 

    const books = await Books.find({ $or: newArr });

    res.json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Books.findByIdAndDelete(id);

    res.status(200).json({ message: "book deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const updatedBook = async (req, res) => {
  const { id } = req.params;
  try {
    const { bookname, image, description, price } = req.body;
    const updateBook = await Books.findByIdAndUpdate(id, {
      bookname,
      image,
      description,
      price,
    });
    res.json(updateBook);
  } catch (error) {
    console.log(error);
  }
};

export const userBooks = async (req, res) => {
  console.log("ooooo");

  const userId = req.clientId;
  console.log(userId);

  try {
    const singleBook = await Books.find({ userId }).populate("userId"); //populate joins books model with user model using userid
    res.json(singleBook);
  } catch (error) {
    console.log(error);
  }
};
