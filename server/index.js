const express = require("express");
const path = require("path");

let app = express();

app.use(express.static(path.resolve(__dirname + "/../dist")));

app.get("/*", (req, res, next) => {
    return res.sendFile(path.resolve(__dirname + "/../dist/index.html"));
});

app.listen(80);