import axios from 'axios'

export class BestTimeApi {
    constructor() {
        this.apiKey = 'pri_3ef23ed060704e0ba1d2d94cdb3a0ff8'
    }

    getShopsInArea = async (lat, lng) => {
        console.log({lat, lng})
        const response = await axios.get(`https://besttime.app/api/v1/venues/filter?api_key_private=${this.apiKey}&radius=400&limit=20&page=0&lat=${lat}&lng=${lng}&now=true`)

        return response.data.venues;

        // console.log({response})
    }
}