const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header("token"); // Change key to match frontend, or update frontend key
        console.log("JWT Token received in header:", jwtToken); // Debugging line

        if (!jwtToken) {
            console.error("No token provided");
            return res.status(403).json("Not Authorised");
        }

        if (!process.env.jwtSecret) {
            console.error("jwtSecret is not defined in environment variables");
            return res.status(500).json("Internal Server Error");
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        console.log("JWT Payload:", payload); // Debugging line

        req.user = payload.user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            console.error("Token expired:", err.message);
            return res.status(403).json("Token has expired");
        }
        console.error("Error verifying token:", err.message);
        return res.status(403).json("Not Authorised");
    }
};
