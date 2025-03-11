const chatService = require("../services/chatService");
const userService = require("../services/userService");
const { validateChatId, getParticipantsData } = require('../utils/chatUtils');

const createChat = async (req, res) => {
    try {
        const createdChatId = await chatService.createChat(req.body);
        console.log("Id chatu: ", createdChatId);
        res.status(200).json({chatId: createdChatId});
    } catch (error) {
        console.error("Błąd tworzenia czatu:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Nieprawidłowe dane wejściowe" });
        }

        res.status(500).json({ error: "Wewnętrzny błąd serwera" });
    }
}

const getChatList = async (req, res) => {
    try {
        const userId = req.params.userId; // Pobierz właściwe userId
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const chatList = await chatService.getChatList(userId);

        const formattedChats = await Promise.all(chatList.map(async (chat) => {
            const participants = await getParticipantsData(chat.participants);

            const messages = await chatService.getChatMessagesList(chat._id.toString());
            const lastMessage = messages.length > 0 ? messages[0] : null; // Sprawdzenie, czy są wiadomości

            return {
                id: chat._id.toString(),
                participants,
                settings: chat.settings, // Nie było w oryginalnym kodzie, ale założyłem, że chcesz zwrócić
                lastMessage
            };
        }));

        return res.json(formattedChats);

    } catch (error) {
        console.error("Error fetching chat list:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Główna funkcja do pobierania danych czatu
const getChatData = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        console.log("getChatData chatId param: ", chatId);

        // Walidacja chatId
        try {
            validateChatId(chatId);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        // Pobieranie danych o czacie
        const chat = await chatService.getChatData(chatId);

        console.log("getChatData - fetched chatData: ", chat);

        if (chat) {
            try {
                // Pobieranie danych uczestników
                const participants = await getParticipantsData(chat.participants);

                console.log("getChatData - participants fetched: ", participants);

                const chatData = {
                    id: chat._id.toString(),
                    participants,
                    settings: chat.settings
                };

                console.log("getChatData - formatted ChatData: ", chatData);

                return res.json(chatData);
            } catch (err) {
                console.error("Error while fetching participants or user data: ", err);
                return res.status(500).json({ error: "Error while fetching participants or user data" });
            }
        } else {
            console.log("getChatData - no data found for chat");
            return res.status(404).json({ error: "Chat not found" });
        }
    } catch (error) {
        console.error("Error fetching chat data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};




module.exports = {
    createChat,
    getChatList,
    getChatData
}