const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// All the promises callbacks code is commented after synchronous code.

public_users.post("/register", (req,res) => {
  username = req.body.username;
  password = req.body.password;
  if(!username || !password){
    res.status(400).json({"message" : "Must Provide username and password."});
  } else{
    checkExisting = users.filter(u => u.username == username);
    if(checkExisting != []){
      res.status(400).json({"message" : "username already exists, kindly provide another."});
    } else {
      users.push({
        "username" : username,
        "password" : password
      });
      
      res.status(200).json({"message" : "Customer Successfully Registered. Now, you can login"});
    }
  }
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Synchronous Code
  res.status(200).json({"books" : books});

  //Promises Code
  // let Promise1 = new Promise((resolve, reject)=>{
  //   resolve({"books":books});
  // })
  // Promise1.then((result) => {
  //   res.status(200).send(result);
  // })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Synchronous Code
  isbn = req.params.isbn;
  requestedBook = books[isbn];
  res.status(200).send(requestedBook);

  
  //Promises Code
  // isbn = req.params.isbn;
  // let Promise2 = new Promise((resolve, reject)=>{
  //   requestedBook = books[isbn];
  //   resolve(requestedBook);
  // })
  // Promise2.then((result)=>{
  //   res.status(200).send(result);
  // })
 });
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Synchronous Code
  author = req.params.author;
  booksByAuthor = [];
  for(key in books){
    if(books[key].author == author){booksByAuthor.push(books[key])}
  }
  res.status(200).json({"booksbyauthor" : booksByAuthor});


  //Promises Code
  // author = req.params.author;
  // let Promise1 = new Promise((resolve, reject)=>{
  //   booksByAuthor = [];
  //   for(key in books){
  //     if(books[key].author == author){booksByAuthor.push(books[key])}
  //   }
  //   resolve(booksByAuthor);
  // })
  // Promise1.then((result)=>{
  //   res.status(200).json({"booksbyauthor" : result});
  // })
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Synchronous Code
  title = req.params.title;
  booksByTitle = [];
  for(key in books){
    if(books[key].title == title){booksByTitle.push(books[key])}
  }
  res.status(200).json({"booksbytitle" : booksByTitle});

  //Promises Code
  // title = req.params.title;
  // let Promise1 = new Promise((resolve, reject)=>{
  //   booksByTitle = [];
  //   for(key in books){
  //     if(books[key].title == title){booksByTitle.push(books[key])}
  //   }
  //   resolve(booksByTitle);
  // })
  // Promise1.then((result)=>{
  //   res.status(200).json({"booksbytitle" : result});
  // })
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbnForReview = req.params.isbn;
  res.status(200).json({"Reviews" : books[isbnForReview].reviews})
});

module.exports.general = public_users;
