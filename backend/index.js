const express = require("express");
const mainrouter = require("./routes/index");
const router = express.Router();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", mainrouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
