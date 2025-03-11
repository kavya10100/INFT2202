import express from "express";
const app = express();
const port = 3000;

// Updated to reflect a product website
let helloContent = `<!DOCTYPE html><html lang=\"en-us\"><head><title>Product Website</title></head><body><main><h1>Welcome to the Product Website</h1><p>Current time: ${new Date()}</p></main></body></html>`;

app.get("/hello", (req, res) => {
    res.send(helloContent);
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Product website listening on port ${port}!`);
});