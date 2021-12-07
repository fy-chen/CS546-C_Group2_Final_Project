// const loginRoutes = require("./login");
const landingRoutes = require("./landing");
const projectRoutes = require("./projects");
const ticketRoutes = require("./ticket");
const signupRoutes = require("./signup");
const loginRoutes = require("./login");
const commentRoutes = require("./comment");
const userRoutes = require("./user");
const logoutRoutes= require("./logout");

const constructorMethod = (app) => {
  // app.use("/", loginRoutes);
  app.use("/landingPage", landingRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/ticket", ticketRoutes);
  app.use("/api/signup", signupRoutes);
  app.use("/api/login", loginRoutes);
  app.use("/api/comment", commentRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/logout",logoutRoutes);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
