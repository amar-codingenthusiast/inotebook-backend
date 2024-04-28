const mongoose = require("mongoose");
// const mongoURL = "mongodb://localhost:27017/iNoteBook";
require("dotenv").config();
const mongoName = process.env.MONGO_NAME;
const mongoPass = process.env.MONGO_PASS;
const mongoURL = `mongodb+srv://${mongoName}:${mongoPass}@inotebook.ifyelul.mongodb.net/iNoteBook?retryWrites=true&w=majority&appName=INOTEBOOK`;
const connectToMongo = async () => {
	try {
		await mongoose.connect(mongoURL);
		console.log("Connected to MongoDB successfully!");
	} catch (error) {
		console.log("Error connecting to MongoDB", error);
	}
};
module.exports = connectToMongo;
