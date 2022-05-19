// const express = require("express");
// const router = new express.Router();

const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

 router.post('/login', async (req, res, next) => {
    try {
        let { username, password } = req.body;

        if (!username || !password) {
            throw new ExpressError("Username and password required", 400);
        }

        if (await User.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({token});
        } else {
            throw new ExpressError("Invalid username/password", 400);
        }
    } catch (err) {
        return next(err);
    }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async (req, res, next) => {
    try {
        let { username } = await User.register(req.body);

        if (!username) {
            throw new ExpressError("Username is required.", 400);
        }

        let token = jwt.sign({username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({token});

    } catch (err) {
        return next(err)
    }
})




module.exports = router;