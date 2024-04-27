const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env.local" });
const fetchUser = require("../middleware/fetchUser");

router.post(
	"/create-user",
	[
		body("name", "Enter a valid name").isLength({ min: 3 }),
		body("email", "Enter a valid email").isEmail(),
		body("password", "Enter a valid password").isLength({ min: 8 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, errors: errors.array() });
		}
		try {
			let user = await User.findOne({ email: req.body.email });
			if (user) {
				return res.status(400).json({
					success: false,
					error: "Sorry, this email is already exist.",
				});
			}
			const salt = await bcrypt.genSalt(10);
			const securedPassword = await bcrypt.hash(req.body.password, salt);
			user = await User.create({
				name: req.body.name,
				email: req.body.email,
				password: securedPassword,
			});
			const authtoken = jwt.sign(
				{ user: { id: user.id } },
				process.env.JWT_SECRET
			);
			res.json({
				success: true,
				authtoken: authtoken,
				user: { name: user.name, email: user.email },
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	}
);

router.post(
	"/login",
	[
		body("email", "Enter a valid email").isEmail(),
		body("password", "Password cannot be blank").exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ success: false, errors: errors.array() });
		}
		try {
			let user = await User.findOne({ email: req.body.email });
			if (!user) {
				return res.status(400).json({
					success: false,
					error: "Please try to login with correct credentials",
				});
			}
			const passwordCompare = await bcrypt.compare(
				req.body.password,
				user.password
			);
			if (!passwordCompare) {
				return res.status(400).json({
					success: false,
					error: "Please try to login with correct credentials",
				});
			}
			const authtoken = jwt.sign(
				{ user: { id: user.id } },
				process.env.JWT_SECRET
			);
			res.json({
				success: true,
				authtoken: authtoken,
				user: { name: user.name, email: user.email },
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	}
);

module.exports = router;
