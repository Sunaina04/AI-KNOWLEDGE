document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const userInput = document.getElementById("user-input").value;

  if (!userInput.trim()) return;

  // Display the user's message in the chat box
  addMessage(userInput, "user");

  try {
    // Send the user input to the backend
    const response = await fetch("http://localhost:5000/chat", {
      // Ensure correct backend URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from backend");
    }

    // Parse the JSON response from the backend
    const data = await response.json();
    console.log("daata", data);
    const botReply = data.chatbotResponse;

    // Display the bot's reply in the chat box
    addMessage(botReply, "bot");
  } catch (error) {
    console.error("Error sending message:", error);
    addMessage("Sorry, something went wrong. Please try again.", "bot");
  }

  // Clear the input field
  document.getElementById("user-input").value = "";
}

// Function to display messages in the chat box
function addMessage(message, sender) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message", `${sender}-message`);
  messageDiv.innerText = message;
  chatBox.appendChild(messageDiv);

  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;
}
