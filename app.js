if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("./config/config.js")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const express = require("express");
const path = require("path");
const routes = require("./routes");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");

const app = express();
const port = process.env.PORT || 3000;

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
  },
});

// const pool = require("./config/database");

const flash = require("connect-flash");
const passport = require("./config/passport");
const handlebarsHelpers = require("./helpers/handlebars-helpers");
const session = require("express-session");
// Load connect-redis
const RedisStore = require("connect-redis").default;
// Load Redis client
const redisClient = require("./config/redisClient");

const SESSION_SECRET = process.env.SESSION_SECRET;
const { getUser } = require("./helpers/auth-helpers");

app.use(express.static(path.join(__dirname, "public")));
app.use("/upload", express.static(path.join(__dirname, "upload")));
// use Handlebars template engine, and specify the file extension as.hbs
app.engine("hbs", engine({ extname: ".hbs", helpers: handlebarsHelpers }));
// set Handlebars as the template engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(methodOverride("_method"));

app.use(
  session({
    // Use Redis as session store
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  // setting success_messages
  res.locals.success_messages = req.flash("success_messages");
  // setting error_messages
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = getUser(req);
  next();
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Application is shutting down");
  await redisClient.quit();
  await sequelize.close();
  // await pool.end();
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use(routes);
httpServer.listen(port, () => {
  console.info(`Example app listening on port ${port}!`);
});

module.exports = app;
