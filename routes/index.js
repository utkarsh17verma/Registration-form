var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const path = require("path"); 
const multer = require("multer");

//Create Connection
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'register'
})

//Connect to database
    db.connect( function(err) {
      if(err) throw err;
      console.log('Connected..');
    });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST registration form */
var storage = multer.diskStorage({ 
  destination: function (req, file, cb) { 
      cb(null, "./public/images") 
  }, 
  filename: function (req, file, cb) { 
    cb(null, file.fieldname + "-" + Date.now()+".jpg") 
  } 
}) 
     
// Define the maximum size for uploading 
// picture i.e. 1 MB. it is optional 
const maxSize = 1 * 1000 * 1000; 
  
var upload = multer({  
  storage: storage, 
  limits: { fileSize: maxSize }, 
  fileFilter: function (req, file, cb){ 
  
      // Set the filetypes, it is optional 
      var filetypes = /jpeg|jpg|png/; 
      var mimetype = filetypes.test(file.mimetype); 

      var extname = filetypes.test(path.extname( 
                  file.originalname).toLowerCase()); 
      
      if (mimetype && extname) { 
          return cb(null, true); 
      } 
    
      cb("Error: File upload only supports the "
              + "following filetypes - " + filetypes); 
    }  

// mypic is the name of file attribute 
}).single("mypic");

router.post('/submit', function(req, res, next) {

    //Upload image
    upload(req,res,function(err) { 
  
      if(err) {
          res.send(err) 
      } 
      else {  
        var datetime = new Date();
        let post = {
          id: 'Null',
          name: '' + req.body.name + '',
          email: '' + req.body.email + '',
          username: '' + req.body.username + '',
          imagename: ''+req.file.filename+'',
          password: '' + req.body.password + '',
          registeredat: datetime,
          about: '' + req.body.about + ''
        };
        let sql = 'INSERT INTO user SET ?';
        db.query(sql, post, (err, result) => {
            if (err) throw err;
            res.send("Registered Successfully");
          });
      } 
  }); 
  
});

/* Check username */
router.post('/checkusername', (req, res, next) => {
  var sql = "SELECT username FROM user WHERE username = '" + req.body.uname + "'";
  db.query(sql, (err, user) => {
  if (err) throw err;
  else {
   if (user.length > 0)
    res.send(false);
   else
    res.send(true);
  }
 });
});



module.exports = router;
