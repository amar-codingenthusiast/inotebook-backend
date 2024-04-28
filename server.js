const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

connectToMongo();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))

app.listen(PORT, () => {
	console.log(`iNoteBook backend listening at ${PORT}`);
});
