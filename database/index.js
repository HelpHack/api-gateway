import { response } from 'express'
import { MongoClient, ObjectId } from 'mongodb'

export default class Database {
  constructor(app) {
    this.app = app
    this.client = new MongoClient(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017`)
  }

  start = async () => {
    await this.client.connect()
    await this.client.db("admin").command({ ping: 1 });
    this.requests = this.client.db('oxylion').collection('Requests')

    this.app.get('/requests', this.getRequests)
    this.app.post('/requests', this.createRequest)
    this.app.put('/requests', this.updateRequest)
  }

  getRequests = async (_, response) => {
    const results = await this.requests.find({})
    const parsed = await results.toArray()

    response.send(parsed)
  }

  createRequest = async (request, response) => {

    const record = await this.requests.insertOne(request.body)

    response.send({
      _id: record.insertedId,
      ...request.body
    })
  }

  updateRequest = async (request, response) => {

    const { _id, ...updatedData } = request.body
    this.requests.updateOne({
      _id: new ObjectId(_id)
    }, {
      $set: updatedData
    })

    response.send({})
  }
}