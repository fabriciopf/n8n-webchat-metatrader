
const webhookUrl = 'https://9486bdfc2919.ngrok-free.app/webhook/6a7f5a0e-a31e-4efc-bc20-93a4b7a1585b';

function getSessionId() {
  let sessionId = sessionStorage.getItem('session-id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('session-id', sessionId);
  }
  return sessionId;
}

async function sendMessageAndWait() {
  const input = document.getElementById("userInput");
  const messages = document.getElementById("messages");
  const loader = document.getElementById("loader");
  const sessionId = getSessionId();

  const userMsg = input.value.trim();
  if (!userMsg) return;

  const userDiv = document.createElement("div");
  userDiv.className = "user-message";
  userDiv.innerHTML = `<strong>Você:</strong> ${userMsg}`;
  messages.appendChild(userDiv);
  messages.scrollTop = messages.scrollHeight;
  input.value = '';

  loader.style.display = "block";

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'text/plain',
        'x-session-id': sessionId
      },
      body: JSON.stringify({ chatInput: userMsg })
    });

    const data = await res.json();
    const htmlResposta = marked.parse(data.output || '[sem resposta]');

    const n8nDiv = document.createElement("div");
    n8nDiv.className = "n8n-message";
    n8nDiv.innerHTML = `<strong>Agente:</strong> ${htmlResposta}`;
    messages.appendChild(n8nDiv);
    messages.scrollTop = messages.scrollHeight;
  } catch (err) {
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.innerHTML = `<strong>Erro:</strong> ${err.message}`;
    messages.appendChild(errorDiv);
  } finally {
    loader.style.display = "none";
  }
}

document.getElementById("userInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessageAndWait();
  }
});
