const express = require("express");

let app = express();

app.use(express.static("../dist"));

app.get("/*", (req, res, next) => {
    return res.sendFile("../dist/index.html");
});

app.listen(80);