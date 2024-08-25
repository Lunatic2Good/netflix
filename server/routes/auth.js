const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { prisma } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

//Validate input
//Validate that the user does not already exist
//hash the password
//save the user
//return a JWT
router.post("/signup", [
    check("username", "Please enter a valid username").isLength({ min: 6 }),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a strong password").isStrongPassword(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { username, email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (user) {
        return res.status(400).json({
            errors: [{
                msg: "This user already exists",
            }]
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            username: true,
            email: true,
        },
    });

    const token = JWT.sign(newUser, process.env.JSON_WEB_TOKEN_SECRET_KEY, { expiresIn: 24 * 60 * 60 * 1000 });

    return res.json({
        user: newUser,
        token,
    });
});

//Validate that the user does exist
//Validate the password
//return a JWT
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        return res.status(400).json({
            errors: [{
                msg: "Invalid credentials",
            }]
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            errors: [{
                msg: "Invalid credentials",
            }]
        });
    }
    
    const userPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };

    const token = JWT.sign(userPayload, process.env.JSON_WEB_TOKEN_SECRET_KEY, { expiresIn: 24 * 60 * 60 * 1000 });

    return res.json({
        user: userPayload,
        token,
    });
});

router.get("/me", async (req, res) => {
    const bearerToken = req.headers.authorization;
    console.log(bearerToken);
    if(!bearerToken) return res.send(null);
    const jwt = bearerToken.split("Bearer ")[1];
    if(!jwt) return res.send(null);
    
    let payload;
    try {
        payload = JWT.verify(jwt, process.env.JSON_WEB_TOKEN_SECRET_KEY);
    } catch (error) {
        return res.send(null);
    }

    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
        select: {
            id: true,
            username: true,
            email: true,
        }
    });

    return res.json(user);
});

module.exports = router;