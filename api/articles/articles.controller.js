const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.service");

class ArticlesController {
    async getAll(req, res, next) {
        try {
            const users = await articlesService.getAll();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }
    async create(req, res, next) {
        try {
            const userId = req.user._id;
            const articleData = {
                ...req.body,
                user: userId
            };
            const article = await articlesService.create(articleData);
            req.io.emit("article:create", article);
            res.status(201).json(article);
        } catch (err) {
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw new UnauthorizedError("Seuls les administrateurs peuvent mettre à jour un article");
            }
            const id = req.params.id;
            const data = req.body;
            const articleModified = await articlesService.update(id, data);
            res.json(articleModified);
        } catch (err) {
            next(err);
        }
    }
    async delete(req, res, next) {
        try {
            if (req.user.role !== 'admin') {
                throw new UnauthorizedError("Seuls les administrateurs peuvent supprimer un article");
            }
            const id = req.params.id;
            await articlesService.delete(id);
            req.io.emit("article:delete", { id });
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
    async login(req, res, next) {
        try {
          const { email, password } = req.body;
          const userId = await usersService.checkPasswordUser(email, password);
          if (!userId) {
            throw new UnauthorizedError();
          }
          const token = jwt.sign({ userId }, config.secretJwtToken, {
            expiresIn: "3d",
          });
          res.json({
            token,
          });
        } catch (err) {
          next(err);
        }
      }
}

module.exports = new ArticlesController();