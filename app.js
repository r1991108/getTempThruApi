const express = require("express");
const app = express();
const ejs = require("ejs");
const https = require("https");

//api key
let myKey = "c6e2fde096a76ee44d57bb485cdfe321";

// k to cel
function ktoC(k) {
  return (k - 273.15).toFixed(2);
}

// middleware
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

// fetch is not aplemented in VScode, using the following ways to solve the problem
app.get("/:city", (req, res) => {
  //   console.log(req.params);
  let { city } = req.params;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`;

  // get request made by node
  https
    .get(url, (response) => {
      console.log("statusCode:", response.statusCode);
      console.log("headers:", response.headers);

      // get datas through API
      response.on("data", (d) => {
        let djs = JSON.parse(d); // convert d from string to JSON type
        // console.log(djs);
        let { temp } = djs.main;
        let newTemp = ktoC(temp);
        res.render("weather.ejs", { djs, newTemp }); // return weather.ejs
      });
    })
    .on("error", (e) => {
      console.log(e);
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
