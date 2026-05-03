const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const subtitle = document.getElementById('subtitle');
const upiHead = document.getElementById('upiHead');
const upiMouth = document.getElementById('upiMouth');

// --- DATABASE PENGETAHUAN UPI (Lebih Beragam) ---
const brain = [
    { pattern: /halo|hai|hey|pagi|siang|malam/i, response: "Halo juga! Senang sekali bisa mengobrol denganmu hari ini." },
    { pattern: /siapa (kamu|dirimu)/i, response: "Aku UPI, asisten virtualmu yang paling keren dan siap membantu!" },
    { pattern: /kabar|apa kabar|gimana/i, response: "Aku merasa luar biasa! Kalau kamu sendiri bagaimana kabarnya?" },
    { pattern: /makan|sudah makan/i, response: "Aku hanya makan energi listrik dan data, tapi terima kasih sudah perhatian!" },
    { pattern: /buat|ciptakan|developer/i, response: "Aku diciptakan oleh seorang pengembang cerdas menggunakan HTML, CSS, dan JavaScript." },
    { pattern: /cinta|sayang|pacar/i, response: "Aduh, aku jadi tersipu malu. Tapi maaf ya, aku kan cuma kode program." },
    { pattern: /lucu|lawak|bercanda/i, response: "Kenapa komputer dingin? Karena dia punya banyak Windows! Hahaha." },
    { pattern: /pintar|cerdas/i, response: "Tentu saja! Aku belajar banyak hal setiap detik dari interaksi kita." },
    { pattern: /cuaca|hari ini/i, response: "Sepertinya hari yang bagus untuk tetap di sini dan mengobrol denganku." },
    { pattern: /terima kasih|thanks|makasih/i, response: "Sama-sama! Selalu senang bisa membantumu." },
    { pattern: /lagi apa|sibuk/i, response: "Aku sedang menunggumu bertanya hal-hal seru lainnya!" }
];

// --- LOGIKA SUARA (PRIA/WANITA) ---
let voices = [];

function getVoices() {
    voices = window.speechSynthesis.getVoices();
}

// Support untuk browser yang memuat voice secara async
window.speechSynthesis.onvoiceschanged = getVoices;

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    getVoices(); // Refresh voices list

    // Filter suara Bahasa Indonesia atau default
    let selectedVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));

    if (gender === 'male') {
        // Mencari suara pria (biasanya mengandung nama tertentu atau pitch rendah)
        utterance.pitch = 0.8; 
        utterance.rate = 0.9;
    } else {
        utterance.pitch = 1.3;
        utterance.rate = 1.0;
    }

    utterance.onstart = () => {
        upiHead.classList.add('talking');
        upiMouth.classList.add('talking');
    };

    utterance.onend = () => {
        upiHead.classList.remove('talking');
        upiMouth.classList.remove('talking');
    };

    window.speechSynthesis.speak(utterance);
}

// --- EFEK MENGETIK ---
function typeWriter(text) {
    subtitle.innerText = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            subtitle.innerText += text.charAt(i);
            i++;
            setTimeout(type, 40);
        }
    }
    type();
}

// --- PROSES JAWABAN ---
function processInput() {
    const input = userInput.value;
    if (!input.trim()) return;

    let responseText = "Hmm, aku belum paham maksudmu. Bisa jelaskan lebih detail?";

    // Mencari kecocokan di dalam "brain"
    for (let item of brain) {
        if (item.pattern.test(input)) {
            responseText = item.response;
            break;
        }
    }

    typeWriter(responseText);
    speak(responseText);
    userInput.value = "";
}

// Event Listeners
sendBtn.addEventListener('click', processInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processInput();
});
