const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const path = require("path")
const dotenv = require('dotenv');
const connectDB = require("./config/db")

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const applicationRoutes = require('./routes/applicationRoutes');


dotenv.config({path:"./.env"})


const app = express();
app.use(express.json({limit:"9gb"}))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



app.use(bodyParser.json());

const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:15470'], 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  };

  app.use(cors(corsOptions)); 

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello, I am Olivia");
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/applications', applicationRoutes);


const startServer = async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
