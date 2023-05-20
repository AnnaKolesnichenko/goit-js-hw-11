const BASE_URL = "https://pixabay.com/api/";

function fetchPixabay() {
    return fetch(`${BASE_URL}/`)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.status);
    }) 
}

export default { fetchPixabay };