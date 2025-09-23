require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoute = require("./router/auth-router");
const contactRoute = require("./router/contact-router")
const teacherRoute = require("./router/teacher-router");
const teacherDashboardRoute = require("./router/teacher-dashboard-router");
const adminDashboardRoute = require("./router/admin-dashboard-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const feedbackRoute = require("./router/feedback-routes");

const corsOptions ={
    origin:['http://localhost:3000', 'http://localhost:3002'], 
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,       
}

app.use(cors(corsOptions));

app.use(express.json()); 
app.use("/api/auth",authRoute);
app.use("/api/form",contactRoute);
app.use("/api/teacher",teacherRoute);
app.use("/api/teacher-dashboard",teacherDashboardRoute);
app.use("/api/admin-dashboard",adminDashboardRoute);
app.use("/api/feedback", feedbackRoute);


app.use(errorMiddleware);

const PORT = 5001;
connectDb().then(()=>{
    app.listen(PORT,()=>{console.log(`Server is running at PORT:${PORT}`)})
    console.log("Database connected");
}); 
