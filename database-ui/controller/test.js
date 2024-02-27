const express = require("express");
const { getAllPlayers } = require("./players");

const app = express();
const port = 3305;

// Define a route for testing
app.get("/", async (req, res) => {
  try {
    const players = await getAllPlayers();
    res.json(players);
  } catch (error) {
    console.error("Error in getAllPlayers:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});