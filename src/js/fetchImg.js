import axios from 'axios';
export { fetchImg };

const BASE_URL = 'https://pixabay.com/api/'; 
const KEY = '29394267-31e8822dcf81ed000db5cdbcd';
    
async function fetchImg(query, page, perPage) {
    try {
        const response = await axios.get(
        `${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
        );
        // console.log(response.data)
        return response;
        
    }
    catch (error) {
        console.log(error);
    }
}

