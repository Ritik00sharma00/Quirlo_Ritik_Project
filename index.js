const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./Backend/routes/submit");
const app = express();
const mongoos_ = require("mongoose");

mongoos_
  .connect("mongodb://localhost:27017/Qurilo_Solutions")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());
app.use(cors());

app.use("/submit", userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
