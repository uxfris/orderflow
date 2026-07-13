import app from "./app.js";

function start() {
  app.listen(3001, () => {
    console.log("Server running at http://localhost:3001");
  });
}

start();
