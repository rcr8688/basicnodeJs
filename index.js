const express = require("express");
const swaggerUI = require("swagger-ui-express");
const cookieparser = require('cookie-parser')
const session = require('express-session')
const fileUpload = require("express-fileupload");

const YAML = require("yamljs");
const req = require("express/lib/request");
const swaggerJSDocs = YAML.load("./api.yaml");
const app = express();
app.use(express.json());

app.use(cookieparser())
app.use(session(
  {
    secret: "this is all the time exp",
    resave: false,
    saveUninitialized: false,
  }
))


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
app.use(fileUpload());

function validateCookie(req, res, next) {
  let { cookies } = req
  if (cookies !== null && cookies !== undefined && "session_id" in cookies) {
    if (cookies['session_id'] == "12346569") console.log("cookies are working ", cookies); next()
    res.status(403).json({ err: "Ur not Auth Person" })
  } else {
    res.status(403).json({ err: "Ur not Auth Person" })
  }
}


app.get('/signin', (req, res, next) => {
  // res.cookie("session_id", "12345697")
  req.session.isAuth = false
  res.send("testing cookies")
})


app.get('/protected', validateCookie, (req, res, next) => {
  res.status(200).send("working as expected for cookies")
})



var users = [
  { id: 1, name: "Tom, Cruise" },
  { id: 2, name: "John Cena" },
];

app.get("/string", (req, res) => {
  console.log(req.cookies);
  res.status(200).send("Users Route");
});

app.get("/user", (req, res) => {
  res.status(200).send({ id: 1, name: "Tom, Cruise" });
});

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.get("/users/:id", (req, res) => {
  res.status(200).send(users.find((x) => x.id === parseInt(req.params.id)));
});

app.post("/create", (req, res) => {
  users = [req.body, ...users];
  res.send(users);
});

app.get("/usersQuery", (req, res) => {
  res.send(users.find((x) => x.id === parseInt(req.query.id)));
});

app.post("/upload", (req, res) => {
  const file = req.files.file;
  let uploadPath = __dirname + "/upload/" + "file" + Date.now() + ".jpg";
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.send(Err);
    }
  });
  res.send(200);
});

app.listen(4000, () => console.log("Up & RUnning"));