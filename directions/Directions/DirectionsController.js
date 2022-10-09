
export class DirectionsController {
    constructor(router, directionsService) {
        this.router = router;
        this.directionsService = directionsService

        this.registerEndpoints();
    }

    registerEndpoints = () => {
        this.router.get('directions', '/directions', this.getDirections);
    }

    getDirections = async (request) => {
        const {start, end, type, numberOfProducts} = request.query

        const result = await this.directionsService.getDirections(start, end, type, numberOfProducts)

        return result;
    }
}