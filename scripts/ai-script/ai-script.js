// =========================
// ELEMENT
// =========================
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const welcome = document.getElementById("welcome");

const micBtn = document.getElementById("mic-btn");
const voicePopup = document.getElementById("voice-popup");
const voiceText = document.getElementById("voice-text");
const cancelVoice = document.getElementById("cancel-voice");

// =========================
// STATE
// =========================
let firstMessage = true;
let recognition;
let finalTranscript = "";

let isCancelled = false;
let isLoading = false;
let lastFromVoice = false;
let isRecording = false;

// TTS CONTROL (PER MESSAGE)
let currentSpeakingBtn = null;
let currentUtterance = null;

// =========================
// LOAD VOICES
// =========================
speechSynthesis.onvoiceschanged = () => {
    console.log("Voices loaded:", speechSynthesis.getVoices());
};

speechSynthesis.getVoices();

// =========================
// SESSION ID
// =========================
let sessionId = localStorage.getItem("sessionId");

if(!sessionId){
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
}

// =========================
// ENTER
// =========================
input.addEventListener("keypress", e => {
    if(e.key === "Enter") handleSend();
});

// =========================
// CLEAN TEXT
// =========================
function cleanText(text){
    return text
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/__/g, "")
        .replace(/_/g, "")
        .replace(/~~/g, "")
        .replace(/#/g, "")
        .replace(/>/g, "")
        .replace(/- /g, "")
        .replace(/• /g, "");
}

// =========================
// FORMAT AI TEXT
// =========================
function formatAI(text){
    if(!text) return "";

    text = text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.*?)__/g, "<strong>$1</strong>");
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");
    text = text.replace(/~~(.*?)~~/g, "<u>$1</u>");

    const lines = text.split("\n");
    let html = "";
    let inList = false;

    lines.forEach(line => {
        const trimmed = line.trim();

        if(trimmed.startsWith("- ") || trimmed.startsWith("• ")){
            if(!inList){
                html += "<ul>";
                inList = true;
            }
            html += `<li>${trimmed.substring(2)}</li>`;
        }else{
            if(inList){
                html += "</ul>";
                inList = false;
            }

            if(trimmed !== ""){
                html += `<p>${trimmed}</p>`;
            }
        }
    });

    if(inList) html += "</ul>";

    return html;
}

// =========================
// GET VOICE (INDO ONLY)
// =========================
function getVoice(){
    const voices = speechSynthesis.getVoices();

    let voice =
        voices.find(v => v.lang === "id-ID" && v.name.toLowerCase().includes("female")) ||
        voices.find(v => v.lang.startsWith("id")) ||
        voices[0];

    console.log("VOICE SELECTED:", voice ? voice.name : "NOT FOUND");

    return voice;
}

// =========================
// TTS PER MESSAGE FIX
// =========================
let isSpeakingReady = false;

function speak(text, btn){

    if(!isSpeakingReady && currentSpeakingBtn === btn){
        return;
    }

    if(currentSpeakingBtn === btn){
        speechSynthesis.cancel();
        resetTTS();
        return;
    }

    speechSynthesis.cancel();

    if(currentSpeakingBtn){
        currentSpeakingBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }

    const clean = cleanText(text);
    const utter = new SpeechSynthesisUtterance(clean);

    // FIX KE INDONESIA
    utter.lang = "id-ID";

    const voice = getVoice();
    if(voice) utter.voice = voice;

    currentUtterance = utter;
    currentSpeakingBtn = btn;

    isSpeakingReady = false;

    btn.innerHTML = '<i class="fa-solid fa-circle-stop"></i>';

    utter.onstart = () => {
        isSpeakingReady = true;
    };

    utter.onend = () => {
        if(currentSpeakingBtn === btn){
            resetTTS();
        }
    };

    utter.onerror = () => {
        if(currentSpeakingBtn === btn){
            resetTTS();
        }
    };

    speechSynthesis.speak(utter);
}

// reset state
function resetTTS(){
    if(currentSpeakingBtn){
        currentSpeakingBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
    currentSpeakingBtn = null;
    currentUtterance = null;
    isSpeakingReady = false;
}

// =========================
// COPY TOAST
// =========================
function showToast(){
    let toast = document.getElementById("toast");

    if(!toast){
        toast = document.createElement("div");
        toast.id = "toast";
        toast.textContent = "Teks disalin!";
        document.body.appendChild(toast);

        toast.style.position = "fixed";
        toast.style.bottom = "30px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "#333";
        toast.style.color = "#fff";
        toast.style.padding = "10px 16px";
        toast.style.borderRadius = "8px";
        toast.style.opacity = "0";
        toast.style.transition = "0.3s";
        toast.style.zIndex = "9999";
    }

    toast.style.opacity = "1";

    setTimeout(()=>{
        toast.style.opacity = "0";
    },1500);
}

// =========================
// MESSAGE
// =========================
function addMessage(text, sender){
    const wrapper = document.createElement("div");
    wrapper.className = "msg-wrapper " + sender;

    const profile = document.createElement("div");
    profile.className = "profile";

    if(sender === "ai"){
        const img = document.createElement("img");
        img.src = "/images/imgs-icon/original-logo-gumi-nusa.png";
        profile.appendChild(img);
    }else{
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-user";
        profile.appendChild(icon);
    }

    const content = document.createElement("div");
    content.className = "msg-content";

    const name = document.createElement("div");
    name.className = "msg-name";
    name.textContent = sender === "ai" ? "Buwana AI" : "Pengunjung";

    const bubble = document.createElement("div");
    bubble.className = "msg " + sender;

    if(sender === "ai"){
        bubble.innerHTML = formatAI(text);
    }else{
        bubble.textContent = text;
    }

    content.appendChild(name);
    content.appendChild(bubble);

    if(sender === "ai"){
        const actions = document.createElement("div");
        actions.className = "msg-actions";

        const speakBtn = document.createElement("button");
        speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        speakBtn.className = "speak-btn";
        speakBtn.onclick = () => speak(text, speakBtn);

        const copyBtn = document.createElement("button");
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(text);
            showToast();
        };

        actions.appendChild(copyBtn);
        actions.appendChild(speakBtn);

        content.appendChild(actions);
    }

    wrapper.appendChild(profile);
    wrapper.appendChild(content);

    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;

    if(sender === "ai" && lastFromVoice){
        const btn = wrapper.querySelector(".speak-btn");
        if(btn) speak(text, btn);
        lastFromVoice = false;
    }
}

// =========================
// TYPING
// =========================
function showTyping(){
    const div = document.createElement("div");
    div.className = "typing";
    div.id = "typing";
    div.innerHTML = `<span></span><span></span><span></span>`;
    chatBox.appendChild(div);
}

function removeTyping(){
    const t = document.getElementById("typing");
    if(t) t.remove();
}

// =========================
// WELCOME
// =========================
function activateChat(){
    if(firstMessage){
        welcome.style.opacity = "0";
        chatBox.classList.remove("hidden");

        setTimeout(()=>{
            welcome.style.display="none";
        },300);

        firstMessage = false;
    }
}

chatBox.classList.add("hidden");

// =========================
// SUGGESTION
// =========================
function useSuggestion(el){
    if(isLoading) return;
    input.value = el.textContent;
    handleSend();
}

// =========================
// LOADING
// =========================
function setLoading(state){
    isLoading = state;

    const sendBtn = document.querySelector(".input-area button:last-child");

    micBtn.disabled = state;
    if(sendBtn) sendBtn.disabled = state;

    if(state){
        micBtn.classList.add("disabled-btn");
        if(sendBtn) sendBtn.classList.add("disabled-btn");
    }else{
        micBtn.classList.remove("disabled-btn");
        if(sendBtn) sendBtn.classList.remove("disabled-btn");
    }

    input.placeholder = state
        ? "Buwana sedang memikirkan jawaban..."
        : "Tanya sesuatu...";
}

// =========================
// SEND
// =========================
async function handleSend(){
    if(isLoading) return;

    const text = input.value.trim();
    if(!text) return;

    activateChat();

    addMessage(text,"user");
    input.value = "";

    showTyping();
    setLoading(true);

    try{
        const res = await fetch("http://localhost:3000/chat",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                message: text,
                sessionId: sessionId
            })
        });

        const data = await res.json();

        removeTyping();
        addMessage(data.reply || "AI tidak memberikan respon 😢","ai");

    }catch{
        removeTyping();
        addMessage("Terjadi kesalahan koneksi 😢","ai");
    }finally{
        setLoading(false);
    }
}

// =========================
// VOICE (UNCHANGED)
// =========================
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.lang = "id-ID";
    recognition.interimResults = true;

    function startVoice(){
        if(isLoading) return;

        finalTranscript = "";
        isCancelled = false;
        lastFromVoice = true;
        isRecording = true;

        recognition.start();

        voicePopup.style.display = "flex";
        voiceText.textContent = ". . .";
    }

    function stopVoice(){
        isRecording = false;
        recognition.stop();
        voicePopup.style.display = "none";
    }

    micBtn.addEventListener("click", ()=>{
        if(isRecording){
            stopVoice();
        }else{
            startVoice();
        }
    });

    recognition.onresult = (event)=>{
        let interim = "";

        for(let i=event.resultIndex;i<event.results.length;i++){
            const text = event.results[i][0].transcript;

            if(event.results[i].isFinal){
                finalTranscript += text;
            } else {
                interim += text;
            }
        }

        voiceText.textContent = finalTranscript + interim;
        input.value = finalTranscript + interim;
    };

    recognition.onend = ()=>{
        voicePopup.style.display = "none";
        isRecording = false;

        if(isCancelled) return;

        if(finalTranscript.trim() !== ""){
            input.value = finalTranscript;
            handleSend();
        }
    };

    cancelVoice.addEventListener("click", ()=>{
        isCancelled = true;
        stopVoice();
        finalTranscript = "";
        input.value = "";
    });

}else{
    micBtn.style.display="none";
}

// STOP SAAT REFRESH
window.addEventListener("beforeunload", () => {
    speechSynthesis.cancel();

    // reset session
    navigator.sendBeacon(
        "http://localhost:3000/reset-session",
        JSON.stringify({ sessionId: sessionId })
    );
});