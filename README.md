# Simple Voice Recorder To S3

This allows you to record on the client and has a client server with express to handle uploads

## Getting Started Locally
1. `npm install` in both the client and server directories
2. Ensure `aws configure` is up to date with authenticated user and `bucketName` variable in server `index.js` is updated.
- Can also update the SDK to use a defined user and region in `new S3()`
2. In client, run `npm run dev`
3. In server, run `npx nodemon index.js`
4. Go to the client url, most likely `localhost:5173`, when you click stop, it'll upload to your s3.