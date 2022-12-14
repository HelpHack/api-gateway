import axios from 'axios'

export class BestTimeApi {
    constructor() {
        this.apiKey = 'pri_8909963981d9440d8e1ff488bdbedd8b'
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