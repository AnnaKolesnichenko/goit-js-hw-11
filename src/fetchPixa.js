const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "36533445-a1e23ac088572808c637a5064";
const image_type = "photo";
const orientation = "horizontal";
const safesearch = true;


function fetchPixabay(query, page = 1) {
    return fetch(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page${40}`)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.status);
    }) 
}



export default { fetchPixabay };