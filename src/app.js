require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express(); //instance of express like new application
const PORT = process.env.PORT || 3000;

const connectDB = require("./config/database");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json()); //middleware to parse json request body it parse all the request body to json
app.use(cookieParser()); //middleware to parse cookies from incoming requests
// Import routes
const routes = require("./routes/routes");
app.use("/", routes);

//Database Connection and always connect database before starting the server
connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
