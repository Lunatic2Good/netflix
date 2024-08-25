const express = require("express");
const movies = require("./movies.json");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use("", require("./routes/movies"));
app.use("/auth", require("./routes/auth"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
