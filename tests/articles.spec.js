const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const User = require("../api/users/users.model");

describe("tester API articles", () => {
  let token;
  const USER_ID = new mongoose.Types.ObjectId();
  const ARTICLE_ID = new mongoose.Types.ObjectId();
  const MOCK_USER = {
    _id: USER_ID,
    name: "ana",
    email: "nfegeg@gmail.com",
    password: "azertyuiop",
    role: "admin",
  };
  const MOCK_ARTICLE = {
    _id: ARTICLE_ID,
    title: "title article test",
    content: "content article test",
    user: USER_ID,
  };
  const MOCK_ARTICLE_CREATED = {
    title: "title article test unitaire",
    content: "content article test unitaire",
    user: USER_ID,
  };
  const MOCK_ARTICLE_UPDATED = {
    title: "title article test unitaire updated",
    content: "content article test unitaire updated",
    user: USER_ID,
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_USER, "findOne");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOne");
    mockingoose(Article).toReturn(MOCK_ARTICLE_UPDATED, "findOneAndUpdate");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
    expect(res.body.content).toBe(MOCK_ARTICLE_CREATED.content);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(MOCK_ARTICLE_UPDATED)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_ARTICLE_UPDATED.title);
    expect(res.body.content).toBe(MOCK_ARTICLE_UPDATED.content);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
