import express from 'express';
import { DirectionsController } from "./directions/Directions/DirectionsController.js";
import { DirectionsService } from "./directions/Directions/DirectionsService.js";
import { MapApi } from "./directions/MapApi/MapApi.js";
import { BestTimeApi } from "./directions/BestTimeApi/BestTimeApi.js";
import Database from './database/index.js';
import dotenv from 'dotenv'

dotenv.config()
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000
const bestTimeApi = new BestTimeApi()
const mapApi = new MapApi()
const directionsService = new DirectionsService(mapApi, bestTimeApi)
const directionsController = new DirectionsController(app, directionsService)
const database = new Database(app).start()

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

