const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");

const app = express();
const port = process.env.PORT || 3000;

const { User, Schedule } = require("./models");

// use Handlebars template engine, and specify the file extension as.hbs
app.engine("hbs", engine({ extname: ".hbs" }));
// set Handlebars as the template engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('signin')
})

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`);
});
module.exports = app;
