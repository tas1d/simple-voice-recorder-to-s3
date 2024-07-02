const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));

const s3 = new AWS.S3();

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('audio'), (req, res) => {
  const audioFile = req.file;

  const params = {
    Bucket: 's3-demo-bucket-voice-recordings-23192',
    Key: `recording-${Date.now()}.webm`,
    Body: audioFile.buffer,
    ContentType: audioFile.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading to S3:', err);
      res.status(500).send('Error uploading audio');
    } else {
      console.log('Audio uploaded to S3:', data.Location);
      res.status(200).send('Audio uploaded successfully');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});