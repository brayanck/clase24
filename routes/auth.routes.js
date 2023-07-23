const router = require("express").Router();
const passport = require("passport");



router.get("/register", (req, res) => {
    res.render("register", {});
});

router.post("/register/crear", passport.authenticate("local-register", { failureRedirect: "/auth/register", successRedirect: "/auth/login", passReqToCallback: true }));

module.exports = router;

router.get('/login', (req, res) => {
    res.render("login", {});
  });

  router.post("/login/crear",passport.authenticate("local-login",{failureRedirect:"/auth/login",successRedirect:"/perfil",passReqToCallback: true })
  )

  router.get("/logout", (req, res,next) => {
    req.logOut(() => {});
    res.redirect("/auth/login");
  });
  
router.get("/github",passport.authenticate("github",{scope:["user:email"],session:false}))

router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) =>  res.redirect('/perfil'));


module.exports = router