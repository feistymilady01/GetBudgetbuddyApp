const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const jwt = require('jsonwebtoken');

const app = express();

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST_IP,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});


app.use(express.json());

// Enable CORS for a specific origin and allow credentials
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/register');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/login');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        //credentials: false,
    })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use (
    session ({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.send("We need a token, please give it to us next time");
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                console.log(err);
                res.json({ auth: false, message: "you have failed to authenticate" });
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
};

app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.send("You are authenticated. Congratulations!")
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
});



app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const fullname = req.body.fullname;
    const email = req.body.email;

    // Check if the username already exists in the database
    db.execute(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "Registration failed" });
            } else if (result.length > 0) {
                // Username already exists
                res.status(400).json({ error: "Username already exists" });
            } else {
                // Username is unique, proceed with registration
                db.execute(
                    "INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)",
                    [fullname,email,username, password], // Store the plain text password
                    (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ error: "Registration failed" });
                        } else {
                            console.log("User registered successfully");
                            res.status(200).json({ message: "Registration successful" });
                        }
                    }
                );
            }
        }
    );
});



app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.execute(
        "SELECT * FROM users WHERE username = ?;",
        [username],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            if (result.length > 0) {
                if (password === result[0].password) { // Compare passwords in plain text (not secure)
                    const id = result[0].id;
                    const token = jwt.sign({ id }, "jwtSecret", {
                        expiresIn: 300,
                    });
                    req.session.user = result;
                    console.log(req.session.user);
                    res.json({ auth: true, token: token, result: result });
                } else {
                    res.json({ auth: false, message: "Wrong username or password" });
                }
            } else {
                res.json({ auth: false, message: "No user exists" });
            }
        }
    );
});

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
    console.log(`App server now listening on port ${process.env.REACT_APP_SERVER_PORT}`);
});