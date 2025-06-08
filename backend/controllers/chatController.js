
const { spawn } = require("child_process");

function callPythonFunction(command, args, res) {
    const process = spawn("python3", ["chat_utils.py", command, JSON.stringify(args)]);

    process.stdout.on("data", (data) => {
        try {
            const result = JSON.parse(data.toString());
            if (!res.headersSent) res.json(result);
        } catch (error) {
            console.error("Error parsing JSON from Python:", error);
            if (!res.headersSent) res.status(500).json({ error: "Invalid JSON response from Python" });
        }
    });

    process.stderr.on("data", (data) => {
        console.error(`Error from Python: ${data}`);
        if (!res.headersSent) res.status(500).json({ error: "Failed to execute Python function" });
    });

    process.on("close", (code) => {
        if (code !== 0 && !res.headersSent) {
            res.status(500).json({ error: "Python process exited with error" });
        }
    });
}
exports.getsessions = (req, res) => {
    const { userId } = req.params;
    callPythonFunction("get_sessions", { user_id: userId }, res);
};

exports.createSession = (req, res) => {
    const userId = req.body.userId;
    callPythonFunction("create_session", { user_id: userId }, res);
};

exports.addMessage = (req, res) => {
    const { userId, sessionId, role, content } = req.body;
    callPythonFunction("add_message", { user_id: userId, session_id: sessionId, role, content }, res);
};

exports.getChatHistory = (req, res) => {
    const { userId, sessionId } = req.params;
    callPythonFunction("get_chat_history", { user_id: userId, session_id: sessionId }, res);
};

exports.deleteChatSession = (req, res) => {
    const { userId, sessionId } = req.params;
    callPythonFunction("delete_chat_session", { user_id: userId, session_id: sessionId }, res);
};

exports.renameSession = (req, res) => {
    const { userId, sessionId } = req.params;
    const { newName } = req.body;
    callPythonFunction("rename_session", { user_id: userId, session_id: sessionId, new_name: newName }, res);
};


exports.processMessage = (req, res) => {
    
    const { prompt, userId ,sessionId} = req.body;  // Assume sessionId is provided
    console.log("Received prompt:", prompt, "for user:", userId, "in session:", sessionId);

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");
    

    // Spawn the Python script as a child process, passing userId and sessionId
    const pythonProcess = spawn("python3", ["run_ollama.py", prompt, userId, sessionId]);

    // Stream data from the Python script to the client in real-time
    pythonProcess.stdout.on("data", (data) => {
        const chunk = data.toString();
        console.log("Ollama response chunk:", chunk);
        res.write(chunk);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error("Ollama error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
        }
        res.end();
    });
};

