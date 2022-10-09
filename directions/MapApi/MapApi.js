import mbxClient from '@mapbox/mapbox-sdk';
import mbxDirections from '@mapbox/mapbox-sdk/services/directions.js';

const directionsProfiles = {
    cycling: 'cycling',
    walking: 'walking',
    driving: 'driving-traffic'
}

export class MapApi {
    constructor() {
        this.apiKey = 'pk.eyJ1IjoiYWRhbWFkYW1hZGFtYWRhbSIsImEiOiJjbDkwNW43MW4weHFuM25xdmN0cGd4M29nIn0.OpqKJKNFlUr6zG_cvdOGqw'// process.env.MAPBOX_API_KEY;
        this.baseClient = mbxClient({ accessToken: this.apiKey });
        this.directionsClient = mbxDirections(this.baseClient)
    }

    getDirections = async (start, end, type, waypoint, id) => {
        console.log(start, end, type, waypoint)
        const waypoints = waypoint
            ? [
                {
                    coordinates: [start.lng, start.lat],
                },
                {
                    coordinates: [waypoint.lng, waypoint.lat]
                },
                {
                    coordinates: [end.lng, end.lat]
                }
            ] :
            [
                {
                    coordinates: [start.lng, start.lat],
                },
                {
                    coordinates: [end.lng, end.lat]
                },
            ]
console.log({waypoints})
        const response = await this.directionsClient.getDirections({
            profile: directionsProfiles[type],
            steps: true,
            waypoints
        })
            .send()
console.log({response})
        const directions = response.body;
        const {routes} = directions
        // console.log(routes[0])
        return {route: routes[0], id};

    }
}