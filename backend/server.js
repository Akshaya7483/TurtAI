const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const db = require("./database/db");
const cron = require("node-cron");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Name the file with a timestamp
  },
});

const upload = multer({ storage: storage });

// Serve static files from 'uploads' folder
app.use("/uploads", express.static(uploadDir)); // Serve files from the 'uploads' directory

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/chat', require('./routes/chatRoutes'));
const grantRoutes = require("./routes/grantroutes");
app.use("/api", grantRoutes);

// Fetch all grants data from the grants table
app.get("/api/announcements", (req, res) => {
  db.all("SELECT * FROM grants", (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve grants data' });
    res.json(rows);
  });
});

// Fetch a single grant's details based on ID
app.get("/api/grants/:grantId", (req, res) => {
  const grantId = req.params.grantId;
  db.get("SELECT * FROM grants WHERE id = ?", [grantId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve grant data" });
    }
    if (!row) {
      return res.status(404).json({ error: "Grant not found" });
    }
    res.json(row);
  });
});

// Record user's grant click history
app.post("/api/record-grant-click", (req, res) => {
  const { user_id, grant_id } = req.body;

  // Insert the clicked grant into the history table
  db.run(
    "INSERT INTO user_grant_history (user_id, grant_id) VALUES (?, ?)",
    [user_id, grant_id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save grant click history' });
      }
      res.status(200).json({ message: 'Grant click history saved' });
    }
  );
});

// Fetch user's grant click history
app.get("/api/user-grant-history/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  db.all(
    "SELECT grants.title, grants.organization, grants.grant_amount, grants.deadline, user_grant_history.clicked_at FROM user_grant_history JOIN grants ON user_grant_history.grant_id = grants.id WHERE user_grant_history.user_id = ?",
    [user_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve grant click history' });
      }
      res.json(rows);
    }
  );
});

// Endpoint for file upload
app.post("/api/upload-file", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }
  // File is uploaded successfully, return the path to the uploaded file
  res.json({
    success: true,
    fileName: req.file.filename,
    filePath: `http://localhost:8081/uploads/${req.file.filename}`, // Full URL to access the uploaded file
  });
});

// **New Endpoint to Fetch Uploaded Files List**
app.get("/api/uploads", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read uploads directory" });
    }
    res.json(files); // Return the list of uploaded files
  });
});

// // Chat endpoint
// const { spawn } = require("child_process");

// app.post("/api/chat", (req, res) => {
//   const { model, messages } = req.body;
//   console.log("Messages received:", messages);

//   // Prepare the curl command to send the request to Ollama
//   const curlCommand = "curl";
//   const curlArgs = [
//     "-s",
//     "http://localhost:11434/api/chat",
//     "-d",
//     `{
//       "model": "Turt",
//       "messages": ${JSON.stringify(messages)}
//     }`,
//   ];

//   // Spawn the curl process to stream output
//   const curlProcess = spawn(curlCommand, curlArgs);

//   let responseBuffer = "";

//   curlProcess.stdout.on("data", (data) => {
//     // Accumulate data as it arrives
//     responseBuffer += data.toString();

//     // Log partial response
//     console.log("Partial Ollama API Response:", responseBuffer);

//     try {
//       // Process and parse any available data
//       const lines = responseBuffer.split("\n").filter((line) => line.trim() !== "");
//       const parsedLines = lines
//         .map((line) => {
//           try {
//             return JSON.parse(line);
//           } catch (e) {
//             console.error("Error parsing response chunk:", e);
//             return null;
//           }
//         })
//         .filter((line) => line !== null);

//       // Combine the parsed content into a single response
//       const combinedResponse = parsedLines.map((chunk) => chunk.message.content).join(" ");

//       if (combinedResponse) {
//         // Send immediate response to client as soon as we have some content
//         res.json({ message: { role: "assistant", content: combinedResponse } });
//         responseBuffer = ""; // Reset buffer after response is sent
//       }
//     } catch (parseError) {
//       console.error("Error processing data:", parseError);
//     }
//   });

//   curlProcess.stderr.on("data", (data) => {
//     console.error("Curl command error:", data.toString());
//   });

//   curlProcess.on("error", (error) => {
//     console.error("Error spawning curl command:", error);
//     res.status(500).json({ error: "Failed to fetch response from Ollama" });
//   });

//   curlProcess.on("close", (code) => {
//     if (code !== 0) {
//       console.error(`Curl command failed with code ${code}`);
//       res.status(500).json({ error: "Curl command failed" });
//     }
//   });
// });


const { spawn } = require('child_process');
app.post("/api/chat", (req, res) => {
  const { model, messages } = req.body;
  console.log("Messages received:", messages);

  // Prepare the curl command to send the request to Ollama
  const curlCommand = 'curl';
  const curlArgs = [
    '-s',
    '-X', 'POST',
    'http://localhost:11434/api/chat',
    '-H', 'Content-Type: application/json',
    '-d', JSON.stringify({
      model: model || "Turt",
      messages: messages
    })
  ];

  // Spawn the curl process to stream output
  const curlProcess = spawn(curlCommand, curlArgs);

  let responseBuffer = '';

  curlProcess.stdout.on('data', (data) => {
    // Accumulate data as it arrives
    responseBuffer += data.toString();

    // Log partial response for debugging purposes
    console.log("Partial Ollama API Response:", responseBuffer);
  });

  curlProcess.stderr.on('data', (data) => {
    console.error("Curl command error:", data.toString());
  });

  curlProcess.on('error', (error) => {
    console.error("Error spawning curl command:", error);
    res.status(500).json({ error: "Failed to fetch response from Ollama" });
  });

  curlProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Curl command failed with code ${code}`);
      res.status(500).json({ error: "Curl command failed" });
    } else {
      try {
        // Attempt to parse the full response buffer
        const parsedLines = responseBuffer
          .split("\n")
          .filter(line => line.trim() !== "")
          .map(line => {
            try {
              return JSON.parse(line);
            } catch (e) {
              console.error("Error parsing response chunk:", e);
              return null;
            }
          })
          .filter(line => line !== null);

        // Extract all message contents and join them
        const combinedResponse = parsedLines
          .map(chunk => chunk.message && chunk.message.content)
          .filter(content => content)
          .join(" ");

        if (combinedResponse) {
          res.json({ message: { role: "assistant", content: combinedResponse } });
        } else {
          res.status(500).json({ error: "Unexpected response format from Ollama" });
        }
      } catch (parseError) {
        console.error("Error parsing full response:", parseError);
        res.status(500).json({ error: "Failed to parse response from Ollama" });
      }
    }
  });
});

// app.post("/api/chat", (req, res) => {
//   const { model, messages } = req.body;
//   console.log("Messages received:", messages);

//   // Prepare the curl command to send the request to Ollama
//   const curlCommand = 'curl';
//   const curlArgs = [
//     '-s',
//     '-X', 'POST',  // Explicitly set HTTP method to POST
//     'http://localhost:11434/api/chat',
//     '-H', 'Content-Type: application/json',
//     '-d', JSON.stringify({
//       model: model || "Turt",
//       messages: messages
//     })
//   ];

//   // Spawn the curl process to stream output
//   const curlProcess = spawn(curlCommand, curlArgs);

//   let responseBuffer = '';

//   curlProcess.stdout.on('data', (data) => {
//     // Accumulate data as it arrives
//     responseBuffer += data.toString();

//     console.log("Partial Ollama API Response:", responseBuffer);
//   });

//   curlProcess.stderr.on('data', (data) => {
//     console.error("Curl command error:", data.toString());
//   });

//   curlProcess.on('error', (error) => {
//     console.error("Error spawning curl command:", error);
//     res.status(500).json({ error: "Failed to fetch response from Ollama" });
//   });

//   curlProcess.on('close', (code) => {
//     if (code !== 0) {
//       console.error(`Curl command failed with code ${code}`);
//       res.status(500).json({ error: "Curl command failed" });
//     } else {
//       try {
//         // Attempt to parse the full response buffer
//         const parsedResponse = JSON.parse(responseBuffer);
//         if (parsedResponse && parsedResponse.message && parsedResponse.message.content) {
//           res.json({ message: { role: "assistant", content: parsedResponse.message.content } });
//         } else {
//           res.status(500).json({ error: "Unexpected response format from Ollama" });
//         }
//       } catch (parseError) {
//         console.error("Error parsing full response:", parseError);
//         res.status(500).json({ error: "Failed to parse response from Ollama" });
//       }
//     }
//   });
// });

// Schedule the Python scraper to run every 10 minutes
cron.schedule("*/10 * * * *", () => {
  exec("python3 ./scripts/scrapeGrants.py", (error, stdout, stderr) => {
    if (error) {
      console.error("Error running Python script:", error, stderr);
    } else {
      console.log("Python script output:", stdout);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
