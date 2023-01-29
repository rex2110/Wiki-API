const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const e = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
});
const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});
const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, foundArticle) => {
      if (err) res.send(err);
      else res.send(foundArticle);
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err, sentArticle) => {
      if (err) res.send(err);
      else res.send(sentArticle);
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) res.send(err);
      else res.send("Successfully deleted all articles");
    });
  });

app
  .route("/articles/:title")
  .get((req, res) => {
    Article.findOne({ title: req.params.title }, (err, foundArticle) => {
      if (foundArticle) res.send(foundArticle);
      else res.send("No article found");
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (err) res.send(err.message);
        else {
          res.send("Article updated successfully");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.title },
      { $set: req.body },
      (err) => {
        if (!err) res.send("Article Updated Successfully");
        else res.send(err.message);
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.title }, (err) => {
      if (err) res.send(err.message);
      else res.send("Article deleted successfully");
    });
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
