import express from 'express';        // Import the Express framework
import bodyParser from 'body-parser'; // Middleware for parsing request bodies
import mongoose from 'mongoose';      // MongoDB ODM library
import cors from 'cors';              // Middleware for enabling CORS
import dotenv from 'dotenv';          // Environment variable management
import multer from 'multer';          // Middleware for handling file uploads
import helmet from 'helmet';          // Middleware for enhancing security
import morgan from 'morgan';          // HTTP request logger
import path from 'path';              // Node.js path module for working with file paths
import { fileURLToPath } from 'url';  // Built-in Node.js URL module for working with URLs
import { register } from './controllers/auth.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { verifyToken } from './middleware/auth.js';
import { createPost } from './controllers/posts.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts } from './data/index.js';

/* CONFIGURATION */
// Get the current file's path and directory using 'fileURLToPath' and 'path' from Node.js modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from a .env file into the process.env.
dotenv.config();

// Create an instance of the Express application.
const app = express();

// Middleware: Parse incoming requests as JSON.
app.use(express.json());

// Middleware: Enhance security with Helmet middleware.
app.use(helmet());

// Middleware: Set the Cross-Origin Opener Policy for added security.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Middleware: HTTP request logging using Morgan with 'common' format.
app.use(morgan("common"));

// Middleware: Parse JSON and URL-encoded request bodies with size limits.
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// Middleware: Enable Cross-Origin Resource Sharing (CORS) for the app.
app.use(cors());

// Serve static files (assets) from the 'public/asses' directory for the '/assets' route.
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    // Define the destination where uploaded files will be stored.
    destination: (req, file, cb) => {
        // 'req' represents the HTTP request made by the client.
        // 'file' is the file being uploaded.
        // 'cb' is a callback function to specify where to store the file.
        // In this case, it's set to be stored in the "public/assets" directory.
        cb(null, "public/assets");
    },
    // Define the file name for the stored file.
    filename: (req, file, cb) => {
        // 'req' is again the HTTP request.
        // 'file' is the uploaded file.
        // 'cb' is a callback function.
        // Use the original filename for the uploaded file.
        cb(null, file.originalname);
    }
});

// Create a Multer instance using the defined storage.
const upload = multer({ storage: storage });



/* ROUTES WITH FILES */

// Create a POST route for user registration that includes file upload
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES  */
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/posts", postRoutes);


/* MONGOOSE SETUP */
// Defines the port number the server will run on. It defaults to 6001 if no environment variable 'PORT' is set.
const PORT = process.env.PORT || 6001;

// Connects to the MongoDB database using Mongoose. It uses the MONGO_URL environment variable to establish the connection.
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // Uses the MongoDB driver's updated URL parser.
    useUnifiedTopology: true,// Uses the new Server Discover and Monitoring engine.
}).then(() => {
    // Once the connection is successfully established, the server starts to listen on the specified PORT.
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // Insert predefined user data and post data into their respective collections in the database. allows us to insert data into our MongoDB database manually so save it once and then comment them out. for Data Test usage
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((err) => {
    // If there is an error in connecting to the database, an error message is logged.
    console.log(`${err} did not connect`)
})
