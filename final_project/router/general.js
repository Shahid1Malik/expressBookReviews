const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
//const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found with given ISBN" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase(); // Normalize case
  let matchingBooks = [];

  // Loop through all books
  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 const title = req.params.title.toLowerCase(); // normalize
  let matchingBooks = [];

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      matchingBooks.push({ isbn, ...books[isbn] });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with the given title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }
});


// Task 10: Async - Get all books
public_users.get('/async/books', async (req, res) => {
  try {
    const getBooks = async () => books;
    const result = await getBooks();
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Async - Get book by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await (async () => books[isbn])();

    if (book) return res.status(200).json(book);
    else return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Task 12: Async - Get books by author
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const results = await (async () =>
      Object.keys(books)
        .filter(isbn => books[isbn].author.toLowerCase() === author)
        .map(isbn => ({ isbn, ...books[isbn] }))
    )();

    if (results.length > 0) return res.status(200).json(results);
    else return res.status(404).json({ message: "No books found by this author" });
  } catch (error) {
    return res.status(500).json({ message: "Error occurred" });
  }
});

// Task 13: Async - Get books by title
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const results = await (async () =>
      Object.keys(books)
        .filter(isbn => books[isbn].title.toLowerCase() === title)
        .map(isbn => ({ isbn, ...books[isbn] }))
    )();

    if (results.length > 0) return res.status(200).json(results);
    else return res.status(404).json({ message: "No books found with this title" });
  } catch (error) {
    return res.status(500).json({ message: "Error occurred" });
  }
});

module.exports.general = public_users;
