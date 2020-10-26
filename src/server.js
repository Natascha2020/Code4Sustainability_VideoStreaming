require("dotenv").config();
require("./dbConfig");

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const videoRoutes = require("./Routes/videoRoutes");

const port = process.env.PORT || 5002;

app.use(cookieParser());
app.use("/videos", videoRoutes);

app.listen(port, () => console.log("Streaming server is running on port " + port));
