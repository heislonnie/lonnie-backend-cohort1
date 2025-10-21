require("dotenv").config();
const { connectDB } = require("./config/db");
const app = require("./app");

const port = process.env.PORT || 3000;
connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

