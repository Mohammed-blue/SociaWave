import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        // Retrieve the token from the request's 'Authorization' header
        let token= req.header("Authorization");

        // Check if the token is missing; if so, return an 'Access Denied' message
        if (!token) {
            return res.status(403).send("Access Denied");
        }

        // Remove the 'Bearer ' string at the start of the token (if present)
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // Verify the token using the secret key and decode the information
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // Set the verified user information in the request for further handling
        req.user = verified;

        // Continue with the next middleware or the actual route handler
        next();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}