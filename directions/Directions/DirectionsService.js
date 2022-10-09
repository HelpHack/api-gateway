export class DirectionsService {
    constructor(mapApi, bestTimeApi) {
        this.mapApi = mapApi
        this.bestTimeApi = bestTimeApi
    }

    getDirections = async (start, end, type, numberOfProducts) => {
        console.log({start, end, type})
        const startArrayLocation = [start.lng, start.lat]
        const endArrayLocation = [end.lng, end.lat]
        const {route: rawRoute} = await this.mapApi.getDirections(start,end,type)
        console.log({rawRoute})
        const legs = rawRoute.legs
        console.log({legs})
        const steps = legs.flatMap(leg => leg.steps)
        const stepLocations = steps.map(step => step.maneuver.location)
        // console.log({stepLocations})
        // const stepsLocations = []
        const allPointsToCheck = [startArrayLocation, endArrayLocation, ...stepLocations]
        console.log({allPointsToCheck})
        const promises = allPointsToCheck.map(([lng, lat]) => this.bestTimeApi.getShopsInArea(lat, lng))
        const venues = (await Promise.all(promises)).flat()
        // const venues = []
        const sumOfBusyIndices = venues.reduce((sum, venue) => sum + venue.day_raw[0], 0)
        const countOfBusyIndices = venues.reduce((count, venue) => venue.day_raw[0] > 0 ? count + 1 : count, 0)



        const averageBusyIndex = countOfBusyIndices ? sumOfBusyIndices / countOfBusyIndices : 0
        const timesPerShop = venues.map(venue => {
            const relevantBusyIndex = venue.day_raw[0]
            const adjustedBusyIndex = relevantBusyIndex > 0 ? relevantBusyIndex : averageBusyIndex
            const numberOfProductFactor = (2*numberOfProducts)/100 + 1
            const busyIndexFactor = (adjustedBusyIndex/100) + 1
            const predictedTimeInShop = 5 * numberOfProductFactor * busyIndexFactor
            console.log({adjustedBusyIndex, numberOfProductFactor, busyIndexFactor, predictedTimeInShop})
            // console.log({relevantBusyIndex})
            return {
                ...venue,
                predictedTimeInShop
            }
        }).sort((a,b) => a.predictedTimeInShop - b.predictedTimeInShop)
        // console.log({timesPerShop})
        const bestShops = timesPerShop.slice(0,5)
        const routesPromises = bestShops.map(venue => this.mapApi.getDirections(start, end, type, {lng: venue.venue_lng, lat: venue.venue_lat}, venue.venue_id))
        const bestShopsRoutes = await Promise.all(routesPromises)
        // console.log({bestShopsRoutes: bestShopsRoutes.map(x => x.route)});
        const summedTimes = bestShopsRoutes.map(({id: venueId, route}) => {
            const routeTime = route.duration_typical
            const relevantVenue = timesPerShop.find(venue => venue.venue_id === venueId)
            const timeInShop = relevantVenue.predictedTimeInShop

            return {
                ...relevantVenue,
                sumDuration: routeTime + timeInShop
            }
        }).sort((a,b) => a.sumDuration - b.sumDuration)
        // console.log({summedTimes})

        const theBestShop = summedTimes[0]

        console.log({theBestShop})

        return theBestShop

        return {
            start,
            end,
            waypoint: {lng: theBestShop.venue.lng, lat: theBestShop.venue_lat},
            shop: theBestShop
        }
    }
}