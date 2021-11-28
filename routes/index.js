// const loginRoutes = require("./login");
const landingRoutes = require("./landing");
const projectRoutes = require("./projects");
const ticketRoutes = require("./ticket");
const signupRoutes = require("./signup");
const loginRoutes = require("./login");

const constructorMethod = (app) => {  
  // app.use("/", loginRoutes);
  app.use("/landingPage", landingRoutes);
  app.use("/projectPage", projectRoutes);
  app.use("/ticketPage", ticketRoutes);
  app.use("/signup", signupRoutes);
  app.use("/api/login", loginRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
