import {msgbus} from "helphack-router";

const URL = process.env.RABBIT_URL || "127.0.0.2:5672";
const USER = process.env.RABBIT_USER || "guest";
const PASSWORD = process.env.RABBIT_PASS || "guest";

const createRabbitManger  = async () => new msgbus(`amqp://${USER}:${PASSWORD}@${URL}/`, {
  exchange: { mandatory: true, immediate: true }
});

export default createRabbitMangers