const express = require("express");
const app = express();
const { nullOrEmpty, fetchShows } = require("./utils");

app.use(express.json());

let shows = [];

app.get("/get-shows", async (req, res) => {
  //if already exists no need to fetch
  if (shows && shows.length > 0) {
    return res.json({
      shows,
    });
  }

  shows = await fetchShows();

  return res.json({
    shows,
  });
});

app.post("/post-review", async (req, res) => {
  const { showId, rating, description } = req.body;

  if (nullOrEmpty(showId)) {
    return res.json({ error: "Show ID parameter must be provided [showId]" });
  }

  if (nullOrEmpty(rating)) {
    return res.json({ error: "Rating parameter must be provided [rating]" });
  }

  if (parseInt(rating) < 0 || parseInt(rating) > 5) {
    return res.json({
      error:
        "Rating parameter should be a valid number between 0 and 5 [rating]",
    });
  }

  if (nullOrEmpty(description)) {
    return res.json({
      error: "Description parameter must be a non empty string [description]",
    });
  }

  if (description && description.length > 255) {
    return res.json({
      error:
        "Description string should be less than 256 characters [description]",
    });
  }

  //if shows is not already populated then do so
  if (!shows || shows.length <= 0) {
    shows = await fetchShows();
  }

  const currentShow = shows.find((show) => show.id === showId);

  if (!currentShow) {
    return res.json({ error: "Show with a given id not found" });
  }

  const index = shows.indexOf(currentShow);
  currentShow.rating = rating;
  currentShow.description = description;
  shows[index] = currentShow;

  return res.json({
    data: currentShow,
  });
});

module.exports = app;
