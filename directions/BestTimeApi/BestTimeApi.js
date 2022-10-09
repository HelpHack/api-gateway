import axios from 'axios'

export class BestTimeApi {
    constructor() {
        this.apiKey = 'pri_6e0c1cec83e64e428e671017a014d3e2'
    }

    getShopsInArea = async (lat, lng) => {
        console.log({lat, lng})
        console.log(`https://besttime.app/api/v1/venues/filter?api_key_private=${this.apiKey}&radius=400&limit=20&page=0&lat=${lat}&lng=${lng}&now=true`)
        try {
            const response = await axios.get(`https://besttime.app/api/v1/venues/filter?api_key_private=${this.apiKey}&radius=400&limit=20&page=0&lat=${lat}&lng=${lng}&now=true`)
            return response.data.venues;
        } catch {
            return []
        }


        // console.log({response})
    }
}