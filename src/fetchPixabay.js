import { Notify } from 'notiflix/build/notiflix-notify-aio'
import axios from 'axios';

export default class PixabayImg {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
        }

    async getImage() {
        const searchParams = new URLSearchParams({
            key: "31443805-4c85089cebd86174cba4b6646",
            q: `${this.searchQuery}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
            per_page: 40,
            page: this.page
        })
        const url = `https://pixabay.com/api/?${searchParams}`

        try {
            const response = await axios.get(url)
 
            if (response.data.hits.length === 0) {
                return Notify.warning("Sorry, there are no images matching your search query. Please try again.")
            }
            if (this.page === 1) {
                Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
            }        

            this.page += 1;
            return response.data
        }
        catch (error) {
            Notify.failure(error.message)
        }
    }

    resetPage() {
        this.page = 1;
    }
    
    get query() {  
        return this.searchQuery;    
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
