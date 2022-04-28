const app = require("./app");
const { PORT } = require("./config")




app.listen(PORT, function () {
  console.log("Started http://localhost:3001/ ");
});

