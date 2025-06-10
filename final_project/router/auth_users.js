const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Step 1: Check if input is present
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Step 2: Check if username is taken
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // Step 3: Register the new user
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully!" });
});

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials." });
  }

  const accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });


  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;


  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

 
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  
  if (!review) {
    return res.status(400).json({ message: "Review query parameter is required" });
  }

  
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  
  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }


  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Your review has been deleted." });
  } else {
    return res.status(404).json({ message: "You have not posted a review for this book." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
