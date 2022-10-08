const DEFAULT_TIMEOUT = process.env.TEST ? 1000 : 30000;
const TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT || DEFAULT_TIMEOUT);

class HttpHandler {
  constructor(queueManager) {
    this.queueManager = queueManager;

    this.handleRequest = this.handleRequest.bind(this);
  }

  static getQueueName(path) {
    console.log({ path });
    const parts = path.split('/');


    return parts[1]
  }

  async _toRabbitmqRequest(req) {
    const { headers } = req;
    const body = await HttpHandler._readBody(req);

    const rabbitRequest = {
      data: body,
      headers,
      path: req.originalUrl,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      method: req.method,
    };

    return rabbitRequest;
  }

  static _readBody(req) {
    return new Promise((resolve, reject) => {
      let body = [],
        hasBody = false;
      req
        .on('data', chunk => {
          hasBody = true;
          body.push(chunk);
        })
        .on('end', () => {
          if (hasBody) {
            body = Buffer.concat(body).toString();
            resolve(body);
          } else {
            resolve(null);
          }
        })
        .on('error', reject);
    });
  }

  async handleRequest(req, res, next) {
    console.log({ req });
    const startTime = new Date().getTime();
    const queueName = HttpHandler.getQueueName(req.path);
    const start = new Date().getTime();
    console.log({queueName})
    let statusCode = 0;

    try {
      const rabbitRequest = await this._toRabbitmqRequest(req);
      console.log({rabbitRequest})
      const result = await this.queueManager.query(
        queueName,
        rabbitRequest,
        { mandatory: true, immediate: true },
        TIMEOUT,
      );
      console.log({result})
      const { headers } = result;
      statusCode = result.statusCode;
      const data = result.data

      if (headers) {
        res.set(headers);
      }
      if (rabbitRequest && result)
      res.status(statusCode).send(data);
    } catch (err) {
      console.log(err)
      res.status(500).send({ error: 'server error' });
    }
  }
}

export default HttpHandler;
