const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - firstname
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *         firstname:
 *           type: string
 *           description: The first name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         username: HB
 *         firstname: hamza
 *         email: kholti.hamza@gmail.com
 *         password: password123
 */

/**
 * @swagger
 * /auth/account:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation error
 */
router.post('/account', async (req, res) => {
  try {
    const { username, firstname, email, password } = req.body;
    const user = new User({ username, firstname, email, password });
    const savedUser = await user.save();
    res.status(201).json({ message: 'Account created successfully', user: savedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Generate a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *             example:
 *               email: kholti.hamza@gmail.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Token generated successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/token', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
