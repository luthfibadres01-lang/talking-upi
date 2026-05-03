// ==========================================
// ⚠️ GANTI DENGAN API KEY OPENAI MILIKMU ⚠️
const OPENAI_API_KEY = 'MASUKKAN_API_KEY_OPENAI_KAMU_DISINI'; 
// ==========================================

// === ELEMENT SELECTION ===
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const aiTextElement = document.getElementById('ai-text');
const cursor = document.getElementById('cursor');
const aiHead = document.getElementById('ai-head');
const aiMouth = document.getElementById('ai-mouth');
const voiceGenderSelect = document.getElementById('voice-gender');

// === WEB SPEECH API SETUP ===
const synth = window.speechSynthesis;
let isTyping = false;

// === EVENT LISTENERS ===
sendBtn.addEventListener('click', handleUserRequest);

inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleUserRequest();
    }
});

// === FUNGSI UTAMA ===
async function handleUserRequest() {
    const userText = inputField.value.trim();
    if (userText === '' || isTyping) return;

    inputField.value = '';
    
    // Tampilkan status "Berpikir..."
    aiTextElement.innerHTML = 'Sedang membaca pikiranmu...';
    cursor.style.display = 'inline-block';

    try {
        // Coba memanggil OpenAI API
        const aiResponse = await fetchChatGPTResponse(userText);
        triggerResponse(aiResponse);
    } catch (error) {
        console.error("Error API:", error);
        // Fallback jika API Error / Belum diisi
        triggerResponse("Hmm... Koneksi ke dimensi lain terputus. Pastikan API Key OpenAI sudah benar.");
    }
}

// === FUNGSI MEMANGGIL OPENAI API ===
async function fetchChatGPTResponse(message) {
    if(OPENAI_API_KEY === 'MASUKKAN_API_KEY_OPENAI_KAMU_DISINI') {
        throw new Error("API Key belum diatur");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Atau ganti 'gpt-4' jika punya akses
            messages: [
                {
                    // System Prompt: Membentuk karakter (Horor Psikologi)
                    role: "system", 
                    content: "Kamu adalah UPI, sebuah AI kepala virtual berhantu dengan tema horor psikologi. Jawab semua pertanyaan dengan gaya misterius, agak creepy, tapi tetap relevan dengan pertanyaan user. Gunakan bahasa Indonesia sehari-hari ala Gen Z tapi bernada gelap. Jawab secara singkat (maksimal 2-3 kalimat)."
                },
                {
                    role: "user", 
                    content: message
                }
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// === TRIGGER JAWABAN (ANIMASI & AUDIO) ===
function triggerResponse(text) {
    aiTextElement.innerHTML = '';
    isTyping = true;
    
    speakAndAnimate(text);
    typeWriterEffect(text, 0);
}

// === TYPING EFFECT ===
function typeWriterEffect(text, i) {
    if (i < text.length) {
        aiTextElement.innerHTML += text.charAt(i);
        setTimeout(() => typeWriterEffect(text, i + 1), 50); // Kecepatan ngetik
    } else {
        isTyping = false;
        setTimeout(() => cursor.style.display = 'none', 2000);
    }
}

// === TEXT-TO-SPEECH (SUARA LAKI/PEREMPUAN) & ANIMASI MULUT ===
function speakAndAnimate(text) {
    if (synth.speaking) {
        synth.cancel();
    }

    const utterThis = new SpeechSynthesisUtterance(text);
    
    utterThis.lang = 'id-ID'; 
    utterThis.rate = 0.9; // Tempo agak lambat

    // Mengubah gender suara berdasarkan pitch (nada)
    const selectedVoice = voiceGenderSelect.value;
    if (selectedVoice === 'male') {
        utterThis.pitch = 0.2; // Pitch rendah = Suara berat (Laki-laki/Monster)
    } else {
        utterThis.pitch = 1.3; // Pitch tinggi = Suara melengking (Perempuan/Hantu)
    }

    // Event saat mulai bicara
    utterThis.onstart = function () {
        aiMouth.classList.add('talking');
        aiHead.classList.add('glow');
    };

    // Event saat selesai bicara / Error
    utterThis.onend = function () { stopAnimation(); };
    utterThis.onerror = function () { stopAnimation(); };

    function stopAnimation() {
        aiMouth.classList.remove('talking');
        aiHead.classList.remove('glow');
    }

    synth.speak(utterThis);
}
