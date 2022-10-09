
export class DirectionsController {
    constructor(express, directionsService) {
        this.express = express;
        this.directionsService = directionsService

        this.registerEndpoints();
    }

    registerEndpoints = () => {
        this.express.get('/directions', async (req, res) => {
            console.log({params: req.params})
            console.log({query: req.query})
            const result = await this.getDirections(req)

            res.send(result)
        })
    }

    getDirections = async (request) => {
        // console.log({request})
        const {startLat,startLng, endLat,endLng, type, numberOfProducts} = request.query

        const result = await this.directionsService.getDirections(Number(startLat),Number(startLng), Number(endLat), Number(endLng), type, Number(numberOfProducts))

        return result;
    }
}