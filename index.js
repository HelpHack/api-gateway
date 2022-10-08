import express from 'express';
import createRabbitManager from './rabbit.js';
import {msgbus, Router} from 'helphack-router'
import HttpHandler from "./httpHandler.js";

const app = express();
const port = process.env.PORT || 3000
let queueManager, router, httpHandler
const init = async () => {
  queueManager = await createRabbitManager();
  router = new Router(queueManager);
  httpHandler = new HttpHandler(queueManager)
}
init().then(() => {
  console.log('init')
  app.get('/*', async (req, res, next) => {

    await httpHandler.handleRequest(req,res, next)
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
})

