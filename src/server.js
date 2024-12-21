const app = require("./app");
const connectDB = require("./config/connectDB");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  console.log(`Server running on port http://localhost:${serverPort}`);
  await connectDB();
});
