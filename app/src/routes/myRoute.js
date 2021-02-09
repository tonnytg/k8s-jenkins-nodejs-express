const express = require('express');
const routes = express.Router();
const MessageController = require('../controllers/myController.js');

routes.get("/", MessageController.index);
routes.get("/message/:id", MessageController.show);
routes.post("/message", MessageController.store);
routes.put("/message/:id", MessageController.update);
routes.delete("/message/:id", MessageController.destroy);
routes.get("/test", (req, res) => {
    return res.send("Fim");
})

module.exports = routes;