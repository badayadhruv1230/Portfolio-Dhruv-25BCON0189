const chatInput = document.getElementById("userInput");
const chatButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const chatStatus = document.getElementById("chatStatus");

const portfolioContext = `
Portfolio owner: Dhruv Badaya.
Education: Computer Science student. The exact institution and course details should be confirmed by the portfolio owner before submission.
Skills shown on this portfolio: HTML, CSS, JavaScript, Python, Git, GitHub, API integration, and basic Node.js.
Projects:
1. Python Factorial Program: Python program for factorial calculation. Repository: https://github.com/badayadhruv1230/Dhruv-python-Factorial-25BCON0189
2. Python Directory Program: Python directory-related practical. Repository: https://github.com/badayadhruv1230/Dhruv-python-Directory-25bcon0189
3. Messy Python Code Improvement: Python code quality and refactoring practical. Repository: https://github.com/badayadhruv1230/messy-python-25bcon0189
4. Bug Fixing Using Cursor AI: Python debugging practical. Repository: https://github.com/badayadhruv1230/Buggy-Python-Script-25BCON0189
5. Interactive Quiz Application: JavaScript quiz application. Repository: https://github.com/badayadhruv1230/Quiz-25BCON0189
6. Book Reading List Application: application for organizing a reading list. Repository: https://github.com/badayadhruv1230/reading-list-25BCON0189
GitHub profile: https://github.com/badayadhruv1230
The website also has a city-based weather widget.
`;

function showChatMessage(role, text) {
  const message = document.createElement("div");
  message.className = `chat-message ${role === "user" ? "chat-user" : "chat-assistant"}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage() {
  const question = chatInput.value.trim();
  if (!question || chatButton.disabled) return;

  showChatMessage("user", question);
  chatInput.value = "";
  chatButton.disabled = true;
  chatStatus.textContent = "AI is thinking...";

  try {
    // The API key stays on the server; the browser calls the same-origin endpoint.
    const response = await fetch(CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, context: portfolioContext })
    });

    if (response.status === 429) throw new Error("RATE_LIMIT");
    if (!response.ok) throw new Error("API_ERROR");

    const data = await response.json();
    if (typeof data.answer !== "string" || !data.answer.trim()) {
      throw new Error("INVALID_RESPONSE");
    }
    showChatMessage("assistant", data.answer.trim());
    chatStatus.textContent = "";
  } catch (error) {
    console.error("Chat error:", error);
    if (error.message === "RATE_LIMIT") {
      showChatMessage("assistant", "Too many requests. Please wait and try again.");
    } else if (!navigator.onLine) {
      showChatMessage("assistant", "No internet connection. Please reconnect.");
    } else {
      showChatMessage("assistant", "AI service unavailable. Please try again.");
    }
    chatStatus.textContent = "";
  } finally {
    chatButton.disabled = false;
  }
}

if (typeof CONFIG === "undefined" || !CONFIG.endpoint) {
  chatButton.disabled = true;
  chatStatus.textContent = "Chatbot endpoint is not configured.";
} else {
  chatButton.addEventListener("click", sendChatMessage);
  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendChatMessage();
  });
}
