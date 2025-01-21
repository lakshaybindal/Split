const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const mainrouter = require("./routes/index");
const router = express.Router();
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());

app.use("/api/v1", mainrouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
