const express = require("express");
const cors = require("cors");
const monk = require("monk");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();
const filter = new Filter();
const db = monk(process.env.MONGO_URI || "localhost/myTwits");
const twits = db.get("twits");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello Binoy");
});

app.get("/add", (req, res) => {
  twits.find().then((twits) => {
    res.json(twits);
  });
});
// validation check also can use express validator or joi
function isValidTwit(twit) {
  return (
    twit.name &&
    twit.name.toString().trim() !== "" &&
    twit.content &&
    twit.content.toString().trim() !== ""
  );
}

app.use(
  rateLimit({
    windowMs: 30 * 1000, // 15 minutes
    max: 1, // limit each IP to 100 requests per windowMs
  })
);

app.post("/add", (req, res) => {
  if (isValidTwit(req.body)) {
    //to db
    const newTwit = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date(),
    };
    twits.insert(newTwit).then((createdNewTwit) => {
      res.json(createdNewTwit);
    });
  } else {
    res.json({
      message: "please enter a valid name and twit",
    });
  }
});
app.listen(4000, () => {
  console.log("server is listening to http://localhost:4000");
});
