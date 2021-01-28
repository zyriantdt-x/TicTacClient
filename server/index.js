const express = require("express");

let app = express();

app.use(express.static("../dist"));

app.get("/*", (req, res, next) => {
    return res.sendFile(__dirname + "/../dist/index.html");
});

app.listen(80);