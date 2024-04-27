const mongoose = require("mongoose");
const mongoURL = "mongodb://localhost:27017/iNoteBook";

const connectToMongo = async () => {
	try {
		await mongoose.connect(mongoURL);
		console.log("Connected to MongoDB successfully!");
	} catch (error) {
		console.log("Error connecting to MongoDB", error);
	}
};
module.exports = connectToMongo;
