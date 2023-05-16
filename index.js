const express = require("express");
const { PORT } = require("./src/config/constants");
const app = express();
const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes")(app);

require('./src/controllers/user/cronJob');

app.listen(PORT, () => {
  console.log(`Listening on port:${PORT}`);
});
