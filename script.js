const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

let userMessageCount = 0;
let botMessageCount = 0;

function sendMessage() {
  const message = userInput.value.trim();
  if (message) {
    appendMessage("user", message);
    userInput.value = "";
    sendToBot(message);
  }
}

function appendMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(`${sender}-message`);
  messageDiv.textContent = message;
  chatLog.appendChild(messageDiv);
  chatLog.scrollTop = chatLog.scrollHeight;

  if (sender === "user") {
    userMessageCount++;
  } else if (sender === "bot") {
    botMessageCount++;
  }
  updateVisualization(); // Update the visualization after each message
}

function sendToBot(message) {
  fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  })
    .then((response) => response.json())
    .then((data) => {
      appendMessage("bot", data.response);
    })
    .catch((error) => {
      console.error("Error:", error);
      appendMessage("bot", "Sorry, I encountered an error.");
    });
}

function updateVisualization() {
  const visualization = d3.select("#chat-visualization");

  // Clear previous visualization
  visualization.selectAll("*").remove();

  // Create a simple bar chart
  const data = [
    { label: "User", count: userMessageCount },
    { label: "Bot", count: botMessageCount },
  ];

  const width = 200;
  const height = 100;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  const svg = visualization
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, width])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count)])
    .range([height, 0]);

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.label))
    .attr("y", (d) => yScale(d.count))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.count))
    .attr("fill", "steelblue");

  svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.label) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.count) - 5)
    .attr("text-anchor", "middle")
    .text((d) => d.count);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g").call(d3.axisLeft(yScale));
}
