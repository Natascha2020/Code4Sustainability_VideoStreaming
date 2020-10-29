const express = require("express");
const router = express.Router();

const videoController = require("../Controllers/videoController");
const verifyAuth = require("../Authentication/verifyAuth");

// video upload
router.post("/videoUpload", verifyAuth, videoController.videoUpload);

// video stream
router.get("/:id?", verifyAuth, videoController.videoStream);

module.exports = router;
