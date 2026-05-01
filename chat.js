/****************************************************************
*  KI-Chatbot über Google Gemini API                            *
****************************************************************/

// API-Key nicht im Quellcode speichern.
// Setze ihn z.B. im HTML vor chat.js:
// <script>window.GEMINI_API_KEY = "...";</script>
const GEMINI_KEY = window.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.5-flash";

const systemMsg =
  "Du bist Twin Jegans Bewerbungs-Chatbot. Antworte freundlich, präzise und auf Deutsch. " +
  "Beantworte nur Fragen über Twin Jegan, seine Fähigkeiten, Projekte, Erfahrung und Kontakt. " +
  "Wenn Infos fehlen, sag ehrlich, dass du das nicht weißt.";

const botBtn = document.createElement("button");
botBtn.id = "chatToggle";
botBtn.type = "button";
botBtn.className = "fixed bottom-6 right-6 z-50 btn-primary shadow-xl";
botBtn.textContent = "🤖 KI-Chat";

const panel = document.createElement("section");
panel.id = "chatPanel";
panel.className =
  "fixed bottom-24 right-6 z-50 w-[340px] h-[460px] max-w-[calc(100vw-2rem)] bg-panel border border-border rounded-xl shadow-2xl p-4 flex flex-col opacity-0 pointer-events-none transition-opacity";
panel.innerHTML = `
  <div class="flex items-center justify-between mb-2">
    <h3 class="text-lg font-semibold">Frage mich etwas</h3>
    <button id="chatClose" type="button" class="chip">✕</button>
  </div>
  <p class="text-xs text-muted mb-2">Ich beantworte Fragen über Twin Jegan.</p>
  <div id="chatLog" class="flex-1 overflow-y-auto space-y-2 pr-1 mb-3"></div>
  <form id="chatForm" class="flex gap-2">
    <input id="chatInput" autocomplete="off" placeholder="Deine Frage …" class="input" />
    <button class="btn-primary px-3" aria-label="Senden">→</button>
  </form>`;

document.body.appendChild(botBtn);
document.body.appendChild(panel);

function togglePanel(show) {
  const shouldOpen = show ?? panel.classList.contains("opacity-0");
  panel.classList.toggle("opacity-0", !shouldOpen);
  panel.classList.toggle("pointer-events-none", !shouldOpen);
  if (shouldOpen) document.getElementById("chatInput").focus();
}

botBtn.addEventListener("click", () => togglePanel());
panel.querySelector("#chatClose").addEventListener("click", () => togglePanel(false));

const chatLog = panel.querySelector("#chatLog");
const chatForm = panel.querySelector("#chatForm");
const chatInput = panel.querySelector("#chatInput");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;

  if (!GEMINI_KEY) {
    bubble("Kein Gemini API-Key gefunden. Bitte window.GEMINI_API_KEY setzen.", "left");
    return;
  }

  chatInput.value = "";
  bubble(question, "right");
  const waitBubble = bubble("…", "left", true);

  try {
    const answer = await askGemini(question);
    waitBubble.remove();
    bubble(answer, "left");
  } catch (err) {
    waitBubble.remove();
    bubble("Fehler bei Gemini. Prüfe API-Key, Modell und API-Freischaltung in Google AI Studio.", "left");
    console.error(err);
  }
});

function bubble(text, side, pending = false) {
  const node = document.createElement("div");
  node.className = `${pending ? "pending" : ""} max-w-[85%] break-words px-3 py-2 rounded-lg ${
    side === "right" ? "ml-auto bg-[#0A84FF] text-[#0A0A0A]" : "bg-[#27272A] text-[#F2F2F2]"
  }`;
  node.textContent = text;
  chatLog.appendChild(node);
  node.scrollIntoView({ behavior: "smooth", block: "end" });
  return node;
}

async function askGemini(userQuestion) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_KEY,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemMsg }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userQuestion }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 250,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const apiError = data?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Gemini API Fehler: ${apiError}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return text || "Dazu habe ich gerade keine Antwort.";
}
