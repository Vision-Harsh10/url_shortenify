const express = require("express");
const app = express();
const cors = require('cors');
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const { ConnectToMongoDB } = require("./routes/connect");
const PORT = 8001;

ConnectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("DataBase Connected")
);

app.use(cors());
app.use(express.json());
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
    //   { new: true }
    );
    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    res.redirect(entry.redirectURL);
  });
app.listen(PORT, () => {
  console.log(`Server Started at PORT :  ${PORT}`);
});
