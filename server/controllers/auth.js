import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/* REGISTER */
export const register = async (req, res) => {
    try {
        // Destructuring the necessary fields from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt();
        // Hash the password using the generated salt
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password and other provided data
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        // Save the new user in the database
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // Respond with the created user
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


/* LOGGING IN */
export const login = async (req, res) => {
    try {
        // Destructure email and password from the request body
        const { email, password } = req.body;
        // Find the user with the provided email
        const user = await User.findOne({ email:    email })

        // If the user does not exist, return an error message
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        // Compare the provided password with the user's stored password hash
        const isMatch = await bcrypt.compare(password, user.password);
        // If the passwords don't match, return an error message
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        // Create a JSON Web Token (JWT) containing the user ID
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET)
        // Remove the password field from the user object for security reasons, so it does not show at the frontend
        delete user.password;
        // Respond with a status of 200 along with the generated token and user details
        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}