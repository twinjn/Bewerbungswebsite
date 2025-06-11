/****************************************************************
*  Kleiner Chatbot über OpenAI-API                              *
****************************************************************/
const OPENAI_KEY = "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";      /*  <-  HIER DEIN KEY  */
const systemMsg  = "Du bist Twin Jegans Karriere-Chatbot. " +
                   "Antworte kurz, hilfreich, auf Deutsch.";

const btn   = document.getElementById("cta");
const panel = document.createElement("div");
panel.id    = "chatPanel";
panel.className =
  "fixed bottom-28 right-6 w-[320px] h-[420px] bg-[#18181B] text-sm " +
  "rounded-xl shadow-2xl p-4 flex flex-col opacity-0 pointer-events-none " +
  "transition-opacity";

panel.innerHTML = `
  <h3 class="text-lg font-semibold mb-2 text-center">Frage mich etwas!</h3>
  <div id="chatLog" class="flex-1 overflow-y-auto space-y-2 pr-1 mb-2"></div>
  <form id="chatForm" class="flex gap-2">
    <input id="chatInput" autocomplete="off" placeholder="Deine Frage …"
           class="flex-1 bg-[#111114] rounded-md px-3 py-2 focus:outline-none" />
    <button class="bg-[#0A84FF] rounded-md px-3 text-[#0A0A0A] font-bold">→</button>
  </form>`;
document.body.appendChild(panel);

/* Panel toggeln */
btn.addEventListener("click",()=>{
  panel.classList.toggle("opacity-0");
  panel.classList.toggle("pointer-events-none");
  if(!panel.classList.contains("opacity-0"))
     document.getElementById("chatInput").focus();
});

/* Chat senden */
document.getElementById("chatForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const inp=document.getElementById("chatInput");
  const q  =inp.value.trim();
  if(!q) return;
  inp.value="";
  bubble(q,"right");
  const wait=bubble("…","left",true);
  try{
    const a=await ask(q);
    wait.remove(); bubble(a,"left");
  }catch(err){
    wait.remove(); bubble("Fehler 😕", "left");
  }
});

function bubble(t,side,pending=false){
  const d=document.createElement("div");
  d.className=`${pending?"pending":""} max-w-[80%] break-words px-3 py-2 rounded-lg `
             +(side==="right"
                  ?"ml-auto bg-[#0A84FF] text-[#0A0A0A]"
                  :"bg-[#27272A] text-[#F2F2F2]");
  d.textContent=t; document.getElementById("chatLog").appendChild(d);
  d.scrollIntoView({behavior:"smooth"}); return d;
}
async function ask(user){
  const body={
    model:"gpt-3.5-turbo",
    messages:[{role:"system",content:systemMsg},{role:"user",content:user}],
    temperature:.7,max_tokens:200
  };
  const r=await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${OPENAI_KEY}`},
    body:JSON.stringify(body)
  });
  const j=await r.json();
  return j.choices[0].message.content.trim();
}
