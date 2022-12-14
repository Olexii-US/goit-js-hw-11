import { Notify } from 'notiflix/build/notiflix-notify-aio'
export default class PixabayImg {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
        }

    getImage() {

    const searchParams = new URLSearchParams({
    key: "31443805-4c85089cebd86174cba4b6646",
    q: `${this.searchQuery}`,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: 100,
    page: this.page
})
    const url = `https://pixabay.com/api/?${searchParams}`

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
        return response.json()
        })
        .then(data => {
            console.log("data", data)
            if (data.hits.length === 0) {
                console.log("все пропало")
                return Notify.warning("Sorry, there are no images matching your search query. Please try again.")
            }
            this.page += 1;
            return data
        })
        .catch(error => Notify.failure(error.message))  
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
