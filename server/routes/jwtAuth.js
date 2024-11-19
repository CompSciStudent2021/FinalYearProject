const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validinfo');

// Registering
router.post("/register", validInfo, async (req, res) => {
    const { email, name, password } = req.body;
  
    try {
      const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
        email,
      ]);
  
      if (user.rows.length > 0) {
        return res.status(401).json({ error: "User already exists!" }); // Return JSON
      }
  
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
  
      let newUser = await pool.query(
        "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, bcryptPassword]
      );
  
      const jwtToken = jwtGenerator(newUser.rows[0].user_id);
      console.log("Generated JWT Token:", jwtToken); // Debugging
  
      return res.json({ token: jwtToken }); // Use 'token' for consistency
    } catch (err) {
      console.error("Server error:", err.message);
      res.status(500).json({ error: "Server error" }); // Return JSON
    }
  });
  

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).send("Password or Email is incorrect");
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        if (!validPassword) {
            return res.status(401).send("Password or Email is incorrect");
        }

        // Return JWT token
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token });
        //console.log("Generated Token: ", token);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Verify route
router.post('/verify', require('../middleware/authorisation'), async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
