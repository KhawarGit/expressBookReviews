const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  usernameFilter = users.filter(r => r.username==username);
  return (usernameFilter != []) ? true : false;
}

const authenticatedUser = (username,password)=>{ 
  registeredUser = users.filter(u => ((u.username==username)&&(u.password==password)));
  return (registeredUser != []) ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  username = req.body.username;
  password = req.body.password;
  if(!username || !password){
    res.status(400).send("Either username or password is not provided.");
  } else{
    validationStatus = authenticatedUser(username,password);
    if(validationStatus){
      let accessToken = jwt.sign({
        data: {
          "username" : username,
          "password" : password
        }
      }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
        accessToken
      }
      res.status(200).send("Customer Successfully Logged In.");
    } else{
      res.status(401).send("Either username or password is incorrect, unauthorized.");
    }
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn;
  username = req.query.username; // I have added username in query in the middleware code.
  review = req.query.review;
  if(books[isbn].reviews == []){
    books[isbn].reviews.push({
      "username" : username,
      "review" : review
    });
  } else{
    flag = false;
    for(review of books[isbn].reviews){
      if(review.username == username){
        flag = true;
        break;
      };
    }
    if(flag){
      for(r of books[isbn].reviews){
        if(r.username == username){
          r.review = review;
          break;
        };
      }

    } else{
      books[isbn].reviews.push({
        "username" : username,
        "review" : review
      });
    }
  }
  res.status(200).send(`The review for the book with ISBN ${isbn} is added/updated.`);
});

regd_users.delete("/auth/review/:isbn",(req, res)=>{
  isbnForDelete = req.params.isbn;
  username = req.query.username;
  newReviews = books[isbnForDelete].reviews.filter(r => r.username != r.username);
  books[isbnForDelete].reviews = newReviews;
  res.send(books[isbnForDelete].reviews);
  res.status(200).send(`Review for the book with ISBN ${isbnForDelete} by the user ${username} has been deleted.`);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
