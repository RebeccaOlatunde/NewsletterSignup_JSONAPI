const express = require("express");
// const request = require("request");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
const { request } = require("http");
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public")) 
//public is a folder for our static files so that all our css and images can go in there.


  app.get("/", function(req, res){
      res.sendFile(__dirname + "/signup.html");
  });

  app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
     
    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/ae2a66002e";
    const options ={
      method: "POST",
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html"); //Signup success reflects html in the success html. 
        } else {
            res.sendFile(__dirname + "/failure.html");//Signup failure reflects html in the failure html. 
        }
        response.on("data", function(data){
        console.log(JSON.parse(data));
      });
   });

    request.write(jsonData);
    request.end();
 });
   
        app.post("/failure", function(req, res){ //If signup is not successful, and on the failure page, the try agin button on the page takes us back to the home route!
        res.redirect("/")
        })

  app.listen(process.env.PORT || 3000, function (){
    console.log("server is running on port 3000")
  });


  
