require("dotenv").config();
require("./dbConfig");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const app = express();

const videoRoutes = require("./Routes/videoRoutes");

const port = process.env.PORT || 5002;

// Ensuring cors is working - TO ADD: Whitelist for ports
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE, HEAD",
    allowHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    exposedHeaders: "Content-Range,X-Content-Range",
    preflightContinue: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(fileUpload());
app.use("/videos", videoRoutes);

app.listen(port, () => console.log("Streaming server is running on port " + port));
