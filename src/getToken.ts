import axios from "axios";

// Get token function
const getToken = async () => {
    const response = await axios({
        method: "get",
        url: "http://foundersapi.herokuapp.com/token",
    });

    // Return the token
    return response.data.token;
};

export default getToken;
