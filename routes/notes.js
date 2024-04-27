const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

router.get("/fetch-all-notes", fetchUser, async (req, res) => {
	try {
		const notes = await Note.find({ user: req.user.id });
		res.json(notes);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});

router.post(
	"/add-note",
	fetchUser,
	[
		body("title", "Enter a valid title").isLength({ min: 3 }),
		body(
			"description",
			"Description must be atleast 5 characters"
		).isLength({ min: 5 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const note = new Note({
				title: req.body.title,
				description: req.body.description,
				tag: req.body.tag,
				user: req.user.id,
			});
			const savedNote = await note.save();
			res.json({savedNote: savedNote});
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Internal Server Error");
		}
	}
);

router.put("/update-note/:id", fetchUser, async (req, res) => {
	try {
		const newNote = {};
		if (req.body.title) {
			newNote.title = req.body.title;
		}
		if (req.body.description) {
			newNote.description = req.body.description;
		}
		if (req.body.tag) {
			newNote.tag = req.body.tag;
		}
		let note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).send("Not found");
		}
		if (note.user.toString() !== req.user.id) {
			return res.status(401).send("Not allowed");
		}
		note = await Note.findByIdAndUpdate(
			req.params.id,
			{ $set: newNote },
			{ new: true }
		);
		res.json({ note: note });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});

router.delete("/delete-note/:id", fetchUser, async (req, res) => {
	try {
		let note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).send("Not found");
		}
		if (note.user.toString() !== req.user.id) {
			return res.status(401).send("Not allowed");
		}
		note = await Note.findByIdAndDelete(req.params.id);
		if (!note) {
			return res.status(404).send("Not found");
		}
		res.json({ success: "Note has been deleted", note: note });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
