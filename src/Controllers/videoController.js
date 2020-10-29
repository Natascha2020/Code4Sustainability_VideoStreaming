const User = require("../Models/User");
const fs = require("fs");
const path = require("path");

const videoController = {
  videoStream: async (req, res) => {
    const id = req.query.currentUser ? req.user.idUser : req.params.id;
    console.log(req.user);

    try {
      // better to create an absolute path to a video asset folder
      const result = await User.findById(id);
      const videoPath = path.join(__dirname, "../Videos/", result.video);

      // getting infos about the file
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      // checking if there is a range in the header thus if this is not the first chunk that is requested
      const range = req.headers.range;
      // if it exists we get the enxt range to go and upadte the range
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  videoUpload: async (req, res) => {
    console.log(req.user);
    const id = req.user.idUser;
    // check the integrity of the body
    console.log(id);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    try {
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let videoUpload = req.files.videoUpload;

      let videoName = videoUpload.name;

      // Use the mv() method to place the file somewhere on your server
      await videoUpload.mv(path.join(__dirname, "../Videos/") + videoName);

      // MONGODB SAVE THE PATH TO THE CONSUMMER/PROJECT OWNER
      const video = await User.findByIdAndUpdate(id, { $set: { video: videoName } });

      res.send("File uploaded!");
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
};

module.exports = videoController;
