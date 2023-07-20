import express from "express";
import ffmpeg from "fluent-ffmpeg";


const app = express();
app.use(express.json()) // use json

app.post("/process-video", (req, res) => {
    // get path of the input video file from the req body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

   if (!inputFilePath || !outputFilePath) {
    res.status(400).send("Bad request: Missing file path.");
   } 

   ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") // converts to 360p
        .on("end", () => {
            res.status(200).send("Video processing finished successfully.");
        }).on("error", (err) => {
            console.log(`An error occurred: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`)
        })
        .save(outputFilePath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Video processing service listening at http://localhost:${PORT}`);
});