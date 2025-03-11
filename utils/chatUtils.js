const userService = require('../services/userService');

// Funkcja do walidacji chatId
const validateChatId = (chatId) => {
    if (!chatId) {
        throw new Error("Chat ID is required");
    }
};

// Funkcja do pobierania uczestników
const getParticipantsData = async (participants) => {
    return await Promise.all(
        participants.map(async (user) => {
            console.log("Fetching data for user: ", user);
            const userData = await userService.getMinimumUserData(user);
            if (!userData) {
                console.log(`No user data found for user ${user}`);
            }
            return userData;
        })
    );
};

module.exports = { validateChatId, getParticipantsData };
