// server file form where the application will be served
const express = require("express");
const connection = require("./db");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();

const authRoutes = require("./routes/authRoutes");
const userRouters = require("./routes/userRoutes");
const mechanicRouter =require('./routes/mechanicRoutes');
const preprocessRouter = require("./routes/processRoutes");
const adminRouter = require("./routes/adminRouter");
const notificationRoutes = require('./routes/notificationRoute');


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.use("/auth", authRoutes);
app.use("/users", userRouters);
app.use("/api/v1/mechanic", mechanicRouter);
app.use("/api/v2/users", userRouters);
app.use("/api/v3", preprocessRouter);
app.use("/api/v4/admin", adminRouter);
 

app.use('/notification', notificationRoutes);

connection();

const port = process.env.PORT;
app.listen(port, console.log(`Listening on port ${port}...`));