import express from "express";
import cors from "cors";
import { exec } from "child_process";

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/create-token", (req, res) => {
  exec("node createToken.js", (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return res.status(500).send(stderr);
    }
    res.send(stdout);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});