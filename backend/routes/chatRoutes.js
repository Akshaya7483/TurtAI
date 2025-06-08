const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Route to get all sessions for a user
router.get("/:userId/sessions", chatController.getsessions);

// Route to create a new chat session
router.post("/:userId/create-session", chatController.createSession);

// Route to add a message to a chat session
router.post("/add-message", chatController.addMessage);

// Route to process a message with Ollama and receive an assistant response
router.post("/:sessionId/message", chatController.processMessage);

// Route to get chat history for a specific session
router.get("/:userId/:sessionId/history", chatController.getChatHistory);

router.put("/:userId/sessions/:sessionId/rename", chatController.renameSession);
router.delete("/:userId/sessions/:sessionId", chatController.deleteChatSession);

module.exports = router;
