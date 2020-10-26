const User = require("../Models/User");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  const id = req.query.currentUser ? req.user.idUser : req.params.id;
  console.log("here", req.query.currentUser);
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
};
