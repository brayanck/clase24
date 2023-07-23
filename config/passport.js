const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../daos/models/users.model");
const UserGit = require("../daos/models/userGit.model");
const { createHash, isValidPassword } = require("../utils/bcrypts");
const Cart = require("../daos/models/carts.model");
const initializePassport = () => {
    passport.use(
        "local-register",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    const userData = req.body;
                    const user = await User.findOne({ email: email });
                    if (user) {
                        console.log("ya existe el usuario");
                        return done(null, false);
                    }
                    const newCart = new Cart()
                    await newCart.save()
                    userData.cartId = newCart._id;
                    userData.password = createHash(password);
                    const result = await User.create(userData);
                    done(null, result);
                } catch (err) {
                    return done(null, false, { message: "Invalid credentials" });
                }
            }
        )
    );
    passport.use(
        "local-login",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    const user = await User.findOne({ email: email });
                    if (!user) {
                        console.log("usuario no existe");
                        return done(null, false, {
                            message: "Usuario o contraseña incorrecta",
                        });
                    }
                    if (!isValidPassword(user, password)) return done(null, false);
                    return done(null, {
                        email: user.email,
                        first_name: user.first_name,
                        age: user.age,
                        last_name: user.last_name,
                    });
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "6f0821aa32c24251c283",
                clientSecret: "4de3a19d7e232364141270cef2b4f23b6879d815",
                callbackURL: "http://localhost:8080/auth/github/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                UserGit.findOne({ githubId: profile.id }).then((data, err) => {
                    if (!data)
                        return UserGit.create({
                            githubId: profile.id,
                            fullname: profile.displayName,
                            username: profile.username,
                            location: profile._json.location,
                            phone: profile._json.phone,
                            email: profile._json.email,
                            profilePhoto: profile._json.avatar_url,
                            password: null,
                        }).then((data, err) => {
                            return done(null, { email: data.fullname, name: data.username });
                        });
                    else return done(null, { email: data.fullname, name: data.username });
                });
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });
};

module.exports = initializePassport;
