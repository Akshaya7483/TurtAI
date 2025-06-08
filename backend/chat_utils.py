# chat_utils.py
import json
import os
from uuid import uuid4
from datetime import datetime

chat_file_path = os.path.join(os.path.dirname(__file__), "../chat.json")

def load_chats():
    # Initialize with {} if the file is empty or doesn't exist
    if not os.path.exists(chat_file_path) or os.path.getsize(chat_file_path) == 0:
        with open(chat_file_path, "w") as f:
            json.dump({}, f)

    with open(chat_file_path, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            # Reinitialize if JSON is invalid
            with open(chat_file_path, "w") as f:
                json.dump({}, f)
            return {}
def save_chats(chats):
    with open(chat_file_path, "w") as f:
        json.dump(chats, f, indent=2)

def get_sessions(user_id):
    chats_data = load_chats()
    if user_id in chats_data:
        return {"sessions": chats_data[user_id]["sessions"]}
    else:
        return {"error": "No sessions found for this user"}

def create_session(user_id):
    session_id = str(uuid4())
    chats_data = load_chats()
    
    if user_id not in chats_data:
        chats_data[user_id] = {"sessions": {}}
    
    chats_data[user_id]["sessions"][session_id] = {
        "name": "New Chat",
        "created_at": datetime.utcnow().isoformat(),
        "last_updated": datetime.utcnow().isoformat(),
        "chats": []
    }
    save_chats(chats_data)
    return {"sessionId": session_id}

def add_message(user_id, session_id, role, content):
    chats_data = load_chats()
    
    if user_id in chats_data and session_id in chats_data[user_id]["sessions"]:
        chats_data[user_id]["sessions"][session_id]["chats"].append({"role": role, "content": content})
        chats_data[user_id]["sessions"][session_id]["last_updated"] = datetime.utcnow().isoformat()
        save_chats(chats_data)
        return {"success": True}
    else:
        return {"error": "Session not found"}

def get_chat_history(user_id, session_id):
    chats_data = load_chats()
    if user_id in chats_data and session_id in chats_data[user_id]["sessions"]:
        return chats_data[user_id]["sessions"][session_id]
    else:
        return {"error": "Session not found"}

def delete_chat_session(user_id, session_id):
    chats_data = load_chats()
    if user_id in chats_data and session_id in chats_data[user_id]["sessions"]:
        del chats_data[user_id]["sessions"][session_id]
        save_chats(chats_data)
        return {"success": True}
    else:
        return {"error": "Session not found"}

def rename_session(user_id, session_id, new_name):
    chats_data = load_chats()
    if user_id in chats_data and session_id in chats_data[user_id]["sessions"]:
        chats_data[user_id]["sessions"][session_id]["name"] = new_name
        save_chats(chats_data)
        return {"success": True}
    else:
        return {"error": "Session not found"}

# Main entry point for calling from Node.js
if __name__ == "__main__":
    import sys
    command = sys.argv[1]
    args = json.loads(sys.argv[2])

    if command == "get_sessions":
        result = get_sessions(**args)
    elif command == "create_session":
        result = create_session(**args)
    elif command == "add_message":
        result = add_message(**args)
    elif command == "get_chat_history":
        result = get_chat_history(**args)
    elif command == "delete_chat_session":
        result = delete_chat_session(**args)
    elif command == "rename_session":
        result = rename_session(**args)
    else:
        result = {"error": "Unknown command"}

    print(json.dumps(result))
