const express = require("express");
const path = require("path");
const routes = require("./routes");
const { engine } = require("express-handlebars");

const flash = require("connect-flash");
const app = express();
const port = process.env.PORT || 3000;

const session = require("express-session");
const SESSION_SECRET = "secret"; 
const { User, Schedule } = require("./models");

// use Handlebars template engine, and specify the file extension as.hbs
app.engine("hbs", engine({ extname: ".hbs" }));
// set Handlebars as the template engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages"); // setting success_messages
  res.locals.error_messages = req.flash("error_messages"); // setting error_messages
  next();
});

app.use(routes);
app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`);
});
module.exports = app;
