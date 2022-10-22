const path = require("path")
const express = require("express")
const app = express()
const port = process.env.PORT || 3000

const bookList = [   
  {id: 1, title:"Dragon Ball", author:'Juan F.', inStock: false, price: 23.90},
  {id: 2, title:"Naruto", author:'Juan F.', inStock: true, price: 25.90},
  {id: 3, title:"One Piece", author:'Dante I..', inStock: false, price: 12.90},
  {id: 4, title:"Death Note", author:'Juan F.', inStock: true, price: 90},
  {id: 5, title:"Slayers", author:'Lix T.', inStock: true, price: 33.87},
  {id: 6, title:"Saint Seiya", author:'Leo M.', inStock: true, price: 100},
  {id: 7, title:"Nants", author:'Fritz O', inStock: true, price: 13.99},
  {id: 8, title:"Dean Angel", author:'Fin K.', inStock: true, price: 43.90}
];


// use handlebars for your templating engine
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
 
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}))
 
//redirecting /js path to the local directory
app.use("/js", express.static(__dirname + '/js'));

// ENDPOINTS
app.get("/", (req, res) => {
  res.render("search", {layout: "primary"})
})

app.post("/", (req, res) => {

  // 1. get the "name" keyword from the URL
  let txtSearch = req.body.txtSearch;
  const filterBook = req.body.filterBook;

  // 2. execute the logic to search the array of students for students whose
  // name matches the keyword
  let results = [];
  let isKeywordProvided = true;
  let messageInput = '';
  let titleInput = 'Results';

  if(txtSearch.trim().length == 0){
    isKeywordProvided = false;
    messageInput = 'No search Keyword provided.';
    titleInput = 'Form Error';
  }

  if(filterBook == 'title' && isKeywordProvided){
    for (let i = 0; i < bookList.length; i++) {
        if(bookList[i].title.toLowerCase().indexOf(txtSearch.toLowerCase()) >= 0){    
          results.push(bookList[i])
        }
    }
  }else if(filterBook == 'author' && isKeywordProvided){
    for (let i = 0; i < bookList.length; i++) {
      if(bookList[i].author.toLowerCase().indexOf(txtSearch.toLowerCase()) >= 0){    
        results.push(bookList[i])
      }
    }
  }else if (filterBook == 'allBooks'){
    for (let i = 0; i < bookList.length; i++) {
      results.push(bookList[i])
    }
  }

  if(isKeywordProvided && results.length == 0){
    messageInput = 'No results found.';
    titleInput = 'Ooops!';
  }

  // 4. if results found, output to screen
  res.render("books", {data: results, title: titleInput, message: messageInput, layout:"primary"})
 
})

app.use((req,res) => {
  res.status(404).render("errorPage", {title: '404', message: 'Sorry, this page cannot be found.', layout:"primary"})
})

const startServer = () => {
  console.log(`The server is running on http://localhost:${port}`)
  console.log(`Press CTRL + C to exit`)
}

app.listen(port, startServer)
