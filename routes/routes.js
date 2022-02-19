const router = require("express").Router();
const bcrypt = require("bcryptjs/dist/bcrypt");
const passport = require("passport");
const user = require("../models/user");

const initializePassport = require("../passport-config");

initializePassport(
  passport,
  async (email) => {
    const userFound = await user.findOne({ email });
    return userFound;
  },
  async (id) => {
    const userFound = await user.findOne({ _id: id });
    return userFound;
  }
);

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/auth");

//inicio
router.get("/", checkAuthenticated, (req, res) => {
  res.render("index", { name: req.user.name });
});

//registrer //el get para renderizar
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

//logging
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

//si esta todo ok lo redireciona al index
router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//validamos si ya hay un usuario igual
router.post("/register", checkNotAuthenticated, async (req, res) => {
  const userFound = await user.findOne({ email: req.body.email });

  if (userFound) {
    req.flash("error", "User with that email already exists");
    res.redirect("/register");
  } else {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      //ACA ESTA EL ERROR // el error era que la variable estaba nombrada igual a la const
      const User = new user({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      await User.save();
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.redirect("/register");
    }
  }
});

router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

module.exports = router;
