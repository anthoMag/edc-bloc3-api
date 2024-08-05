const Article = require("./articles.schema");
const bcrypt = require("bcrypt");

class ArticleService {
    getAll() {
        return Article.find({});
      }
    get(id) {
        return Article.findById(id);
      }
    create(data) {
        const article = new Article(data);
        return article.save();
    }
    update(id, data) {
        return Article.findByIdAndUpdate(id, data, { new: true });
    }
    delete(id) {
        return Article.deleteOne({ _id: id });
    }
    getArticlesByUserId(userId) {
        return Article.find({ user: userId }).populate("user", "-password").exec();
    }
}

module.exports = new ArticleService();
