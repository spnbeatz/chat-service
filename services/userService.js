const getMinimumUserData = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5037/api/user/usermin/${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("getMinimumUserData userID: ", userId);
        if(response.ok){
            return await response.json();
        } else return null;
    } catch (error) {
        console.log("Error fetching minimum user data: ", error);
    }

}

module.exports = {
    getMinimumUserData
}