const express = require("express");
const router = express.Router();

const videoController = require("../Controllers/videoController");
const verifyAuth = require("../Authentication/verifyAuth");

// video stream
router.get("/:id?", verifyAuth, videoController);

module.exports = router;
