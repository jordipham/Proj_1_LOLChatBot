// chatbot.js
// === LOL ChatBot JS with tiny custom tokenizer + stemmer ===

// Simple tokenizer: splits on space & punctuation
function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[\s,.!?]+/)
    .filter(Boolean);
}

// Tiny stemmer: strips common suffixes (like Porter-lite)
function stem(word) {
  return word
    .replace(/(ing|ed|ly|s)$/, "") // very crude
    .replace(/[^a-z]/g, "");
}

function preprocess(text) {
  return tokenize(text).map(stem);
}

let intents = [
  {
    tag: "greeting",
    patterns: ["Hi", "Hello", "Hey", "How are you", "What's up"],
    responses: [
      "Hi there!",
      "Hello 👋",
      "Hey!",
      "I'm fine, thank you.",
      "Nothing much!",
    ],
  },
  {
    tag: "goodbye",
    patterns: ["Bye", "See you later", "Goodbye", "Take care"],
    responses: ["Goodbye!", "See you later 👋", "Take care!"],
  },
  {
    tag: "thanks",
    patterns: ["Thank you", "Thanks", "Thanks a lot", "I appreciate it"],
    responses: ["You're welcome!", "No problem 😊", "Glad I could help!"],
  },
  {
    tag: "tank",
    patterns: [
      "What tank items do I build?",
      "Best items for tank",
      "Common items for tank",
    ],
    responses: [
      "Try Jak'sho the Protean, Heartsteel, Warmog's, Force of Nature, Thornmail.",
    ],
  },
  {
    tag: "ADC",
    patterns: [
      "What adc items do I build?",
      "best adc items",
      "Common adc items",
      "bot lane items",
    ],
    responses: ["IE, BT, Galeforce, Maw of Malmortius, QSS, Kraken Slayer."],
  },
];

function matchIntent(input) {
  const inputTokens = preprocess(input);
  let bestIntent = null;
  let bestScore = 0;

  for (const intent of intents) {
    let patternTokens = intent.patterns.flatMap((p) => preprocess(p));
    let overlap = inputTokens.filter((t) => patternTokens.includes(t)).length;

    if (overlap > bestScore) {
      bestScore = overlap;
      bestIntent = intent;
    }
  }
  return bestScore > 0 ? bestIntent : null;
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

// Chat UI logic
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message " + sender;
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  if (sender === "bot") {
    triggerBotPulse();
    triggerFloatingBubbles();
  }
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

// Tiny header accent on load
d3.select("header")
  .append("svg")
  .attr("width", 50)
  .attr("height", 20)
  .selectAll("circle")
  .data([1, 2, 3])
  .enter()
  .append("circle")
  .attr("cx", (d, i) => 15 * i + 5)
  .attr("cy", 10)
  .attr("r", 4)
  .attr("fill", (d, i) => [
    "var(--primary-red)",
    "var(--light-blue)",
    "var(--dark-blue)",
  ])
  .attr("opacity", 0.9);

// D3 animated pulse on bot reply
const d3Container = d3.select("#d3-header");
function triggerBotPulse() {
  d3Container.selectAll("*").remove();
  const theme = document.documentElement.dataset.theme;
  const pulseColor =
    theme === "dark" ? "var(--light-blue)" : "var(--primary-red)";

  const svg = d3Container.append("svg").attr("width", 30).attr("height", 30);

  const circle = svg
    .append("circle")
    .attr("cx", 15)
    .attr("cy", 15)
    .attr("r", 5)
    .attr("fill", pulseColor)
    .attr("opacity", 0.8);

  circle
    .transition()
    .duration(800)
    .attr("r", 12)
    .attr("opacity", 0)
    .ease(d3.easeCubicOut)
    .on("end", () => svg.remove());
}

// Fun: floating bubbles on bot reply
function triggerFloatingBubbles() {
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)
    .style("position", "fixed")
    .style("top", 0)
    .style("left", 0)
    .style("pointer-events", "none");

  const colors = [
    "var(--primary-red)",
    "var(--light-blue)",
    "var(--dark-blue)",
  ];
  const bubbles = d3.range(5).map(() => ({
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + 20,
    r: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  svg
    .selectAll("circle")
    .data(bubbles)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", (d) => d.color)
    .attr("opacity", 0.7)
    .transition()
    .duration(1500)
    .ease(d3.easeCubicOut)
    .attr("cy", (d) => d.y - (100 + Math.random() * 50))
    .attr("opacity", 0)
    .on("end", function () {
      d3.select(this).remove();
    });

  setTimeout(() => svg.remove(), 2000);
}
