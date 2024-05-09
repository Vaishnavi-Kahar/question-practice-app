const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const data = require("./data");

app.use(cors());
app.use(express.json());

app.get("/question", (req, res) => {
  if (data.length > 0) {
    res.status(200).json(data);
  } else {
    res.status(404).send("No questions found");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
