const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 7000;

// middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("COFFEE STORE SERVER is running");
});

app.listen(port, () => {
  console.log(`COFFEE STORE SERVER is running on port: ${port}`);
});
