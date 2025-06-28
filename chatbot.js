// Chatbot logic ported from backend/app.py

let intents = [
  {
    tag: "greeting",
    patterns: ["Hi", "Hello", "Hey", "How are you", "What's up"],
    responses: [
      "Hi there",
      "Hello",
      "Hey",
      "I'm fine, thank you",
      "Nothing much",
    ],
  },
  {
    tag: "goodbye",
    patterns: ["Bye", "See you later", "Goodbye", "Take care"],
    responses: ["Goodbye", "See you later", "Take care"],
  },
  {
    tag: "thanks",
    patterns: ["Thank you", "Thanks", "Thanks a lot", "I appreciate it"],
    responses: ["You're welcome", "No problem", "Glad I could help"],
  },
  {
    tag: "tank",
    patterns: [
      "What tank items do I build?",
      "Best items for tank",
      "Common items for tank",
    ],
    responses: [
      "Jak'sho the Protean",
      "Heartsteel",
      "Warmog's",
      "Force of Nature",
      "Thornmail",
    ],
  },
  {
    tag: "ADC",
    patterns: [
      "What adc items do I built?",
      "best adc items",
      "Common adc items",
      "bot lane items",
    ],
    responses: [
      "IE",
      "BT",
      "galeforce",
      "mawl of malmortius",
      "QSS",
      "kraken slayer",
    ],
  },
];

// Simple case-insensitive matching for this frontend version
function matchIntent(input) {
  input = input.trim().toLowerCase();
  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      if (input === pattern.toLowerCase()) {
        return intent;
      }
    }
  }
  // Fallback: fuzzy match if input contains pattern words
  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      if (input.includes(pattern.toLowerCase().split(" ")[0])) {
        return intent;
      }
    }
  }
  return null;
}

function getBotResponse(userInput) {
  const intent = matchIntent(userInput);
  if (intent) {
    const resp =
      intent.responses[Math.floor(Math.random() * intent.responses.length)];
    return resp;
  }
  return "Sorry, I don't understand that yet!";
}

// UI logic
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message " + sender;
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userMsg = chatInput.value;
  appendMessage(userMsg, "user");
  chatInput.value = "";
  setTimeout(() => {
    const botMsg = getBotResponse(userMsg);
    appendMessage(botMsg, "bot");
  }, 350);
});

// Theme toggle
const themeBtn = document.getElementById("toggle-theme");
themeBtn.addEventListener("click", () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("lolchatbot-theme", html.dataset.theme);
});
(function () {
  const saved = localStorage.getItem("lolchatbot-theme");
  if (saved) document.documentElement.dataset.theme = saved;
})();

// JSON editor for intents
const jsonEditor = document.getElementById("json-editor");
const saveJsonBtn = document.getElementById("save-json");
const editorMsg = document.getElementById("editor-msg");

function refreshEditor() {
  jsonEditor.value = JSON.stringify(intents, null, 2);
}
refreshEditor();
saveJsonBtn.onclick = function () {
  try {
    const newData = JSON.parse(jsonEditor.value);
    if (!Array.isArray(newData))
      throw new Error("Top-level JSON must be an array of intents");
    // Basic validation
    for (let it of newData) {
      if (
        !it.tag ||
        !Array.isArray(it.patterns) ||
        !Array.isArray(it.responses)
      )
        throw new Error("Each intent must have tag, patterns[], responses[]");
    }
    intents = newData;
    editorMsg.textContent = "Saved!";
    editorMsg.style.color = "#16457A";
    setTimeout(() => (editorMsg.textContent = ""), 1200);
  } catch (e) {
    editorMsg.textContent = "Invalid JSON: " + e.message;
    editorMsg.style.color = "#E64107";
  }
};

// Example: Tiny D3.js usage for future visualization
// (e.g., a fun animated accent in the header, or stats)
d3.select("header")
  .append("svg")
  .attr("width", 26)
  .attr("height", 26)
  .style("margin-left", "10px")
  .selectAll("circle")
  .data([1, 2, 3])
  .enter()
  .append("circle")
  .attr("cx", (d, i) => 8 * i + 8)
  .attr("cy", 13)
  .attr("r", 4)
  .attr("fill", (d, i) => ["#E64107", "#508ddf", "#16457A"][i])
  .attr("opacity", 0.9);
