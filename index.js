import express from 'express';
import { DirectionsController } from "./directions/Directions/DirectionsController.js";
import { DirectionsService } from "./directions/Directions/DirectionsService.js";
import { MapApi } from "./directions/MapApi/MapApi.js";
import { BestTimeApi } from "./directions/BestTimeApi/BestTimeApi.js";

const app = express();
const port = process.env.PORT || 3000
const bestTimeApi = new BestTimeApi()
const mapApi = new MapApi()
const directionsService = new DirectionsService(mapApi, bestTimeApi)
const directionsController = new DirectionsController(app, directionsService)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

