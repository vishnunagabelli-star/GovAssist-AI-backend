/**
 * GovAssist AI - Core Logic
 */

// --- Constants & Data ---
const EXAM_CATEGORIES = [
    { id: 'rrb', name: 'Railway (RRB)', icon: 'train', count: 12 },
    { id: 'ssc', name: 'SSC Exams', icon: 'file-check', count: 8 },
    { id: 'banking', name: 'Banking (IBPS/SBI)', icon: 'landmark', count: 15 },
    { id: 'upsc', name: 'UPSC / State PCS', icon: 'graduation-cap', count: 5 }
];

const JOBS = [
    { id: 1, title: 'RRB NTPC Graduate Level', category: 'railway', lastDate: '2026-04-15', link: '#' },
    { id: 2, title: 'SSC CGL Tier 1 Notification', category: 'central', lastDate: '2026-05-01', link: '#' },
    { id: 3, title: 'SBI PO 2026 Recruitment', category: 'banking', lastDate: '2026-03-30', link: '#' },
    { id: 4, title: 'TSPSC Group 1 Services', category: 'state', lastDate: '2026-04-10', link: '#' }
];

const UPDATES = [
    { title: 'Global Innovation Index 2026', date: 'March 18, 2026', tag: 'Current Affairs' },
    { title: 'New Monetary Policy Highlights', date: 'March 17, 2026', tag: 'Banking' },
    { title: 'Railway Budget Allocation 2026', date: 'March 16, 2026', tag: 'Railways' }
];

const SCHEMES = [
    { title: 'PM KISAN Nidhi', benefit: '₹6,000/year for farmers', link: '#' },
    { title: 'PM Awas Yojana', benefit: 'Subsidy for home construction', link: '#' },
    { title: 'Ayushman Bharat', benefit: '₹5 Lakh health insurance cover', link: '#' }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderTestCategories();
    renderJobs();
    renderUpdates();
    renderSchemes();
    initChatbot();
    lucide.createIcons();
});

// --- Theme Management ---
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.setAttribute('data-lucide', 'sun');
    } else {
        icon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
}

// --- Dynamic Content Rendering ---
function renderTestCategories() {
    const container = document.getElementById('test-categories');
    if (!container) return;

    EXAM_CATEGORIES.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <i data-lucide="${cat.icon}" style="margin-bottom: 1rem; color: var(--primary-blue)"></i>
            <h3>${cat.name}</h3>
            <p>${cat.count} Full-length mock tests available.</p>
            <button class="btn btn-outline start-quiz-btn" data-id="${cat.id}" style="margin-top: 1rem; width: 100%">Explore Tests</button>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.start-quiz-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const catId = btn.getAttribute('data-id');
            startQuiz(catId);
        });
    });
}

// --- Quiz Engine Logic ---
async function startQuiz(catId) {
    const title = EXAM_CATEGORIES.find(c => c.id === catId).name;
    document.getElementById('quiz-title').innerText = title + " Mock Test";
    document.getElementById('quiz-modal').classList.remove('hidden');
    
    try {
        const response = await fetch('questions.json');
        const data = await response.json();
        quizQuestions = data[catId] || [];
        currentQuestionIndex = 0;
        showQuestion();
        startTimer(60);
    } catch (err) {
        console.error("Failed to load questions:", err);
    }
}

function showQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    const container = document.getElementById('question-container');
    document.getElementById('curr-q').innerText = currentQuestionIndex + 1;
    
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem;">${q.q}</h2>
        <div class="options-list">
            ${q.options.map((opt, i) => `
                <button class="option-btn" data-index="${i}">${opt}</button>
            `).join('')}
        </div>
    `;

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
}

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        alert("Quiz Finished! Well done.");
        document.getElementById('quiz-modal').classList.add('hidden');
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
});

function startTimer(minutes) {
    let seconds = minutes * 60;
    const timerDisplay = document.getElementById('timer');
    const interval = setInterval(() => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        timerDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        seconds--;
        if (seconds < 0) {
            clearInterval(interval);
            alert("Time Up!");
        }
    }, 1000);
}

function renderJobs(filter = 'all') {
    const container = document.getElementById('job-list');
    if (!container) return;
    container.innerHTML = '';

    const filteredJobs = filter === 'all' ? JOBS : JOBS.filter(job => job.category === filter);

    filteredJobs.forEach(job => {
        const item = document.createElement('div');
        item.className = 'job-item';
        item.innerHTML = `
            <div class="job-info">
                <span class="job-badge badge-${job.category}">${job.category}</span>
                <h4>${job.title}</h4>
                <div class="job-meta">Last Date: ${job.lastDate}</div>
            </div>
            <a href="${job.link}" class="btn btn-outline btn-sm">Apply Now</a>
        `;
        container.appendChild(item);
    });

    // Handle filter clicks
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderJobs(btn.getAttribute('data-filter'));
        });
    });
}

function renderUpdates() {
    const container = document.getElementById('updates-grid');
    if (!container) return;

    UPDATES.forEach(upd => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span style="font-size: 0.75rem; color: var(--primary-green); font-weight: 600;">${upd.tag}</span>
            <h4 style="margin: 0.5rem 0;">${upd.title}</h4>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${upd.date}</div>
            <a href="#" style="display: block; margin-top: 1rem; color: var(--primary-blue); text-decoration: none; font-weight: 500;">Read More &rarr;</a>
        `;
        container.appendChild(card);
    });
}

function renderSchemes() {
    const container = document.getElementById('schemes-grid');
    if (!container) return;

    SCHEMES.forEach(scheme => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <i data-lucide="info" style="color: var(--primary-blue); margin-bottom: 1rem;"></i>
            <h3>${scheme.title}</h3>
            <p>${scheme.benefit}</p>
            <a href="${scheme.link}" class="btn btn-outline" style="margin-top: 1rem; width: 100%">Learn More</a>
        `;
        container.appendChild(card);
    });
}

// --- Chatbot Logic ---
function initChatbot() {
    const fab = document.getElementById('chatbot-fab');
    
    // Create Chat Window if it doesn't exist
    let chatWindow = document.getElementById('chat-window');
    if (!chatWindow) {
        chatWindow = document.createElement('div');
        chatWindow.id = 'chat-window';
        chatWindow.className = 'chat-window hidden';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <h3>GovBot Assistant</h3>
                <button id="close-chat">&times;</button>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot">Namaste! I'm GovBot. How can I help you with your exam preparation today?</div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Type your doubt...">
                <button id="send-chat"><i data-lucide="send"></i></button>
            </div>
        `;
        document.body.appendChild(chatWindow);
        
        // Add Chat Window Styles
        const styles = `
            .chat-window {
                position: fixed;
                bottom: 5rem;
                right: 2rem;
                width: 350px;
                height: 500px;
                background: var(--bg-card);
                border-radius: 1rem;
                box-shadow: var(--shadow-lg);
                display: flex;
                flex-direction: column;
                z-index: 1001;
                border: 1px solid var(--border-color);
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            .chat-window.hidden {
                transform: translateY(20px);
                opacity: 0;
                pointer-events: none;
            }
            .chat-header {
                padding: 1rem;
                background: var(--primary-blue);
                color: white;
                border-radius: 1rem 1rem 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .chat-messages {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .message {
                padding: 0.75rem 1rem;
                border-radius: 0.75rem;
                max-width: 80%;
                font-size: 0.9rem;
            }
            .message.bot {
                background: var(--border-color);
                align-self: flex-start;
            }
            .message.user {
                background: var(--primary-green);
                color: white;
                align-self: flex-end;
            }
            .chat-input-area {
                padding: 1rem;
                border-top: 1px solid var(--border-color);
                display: flex;
                gap: 0.5rem;
            }
            .chat-input-area input {
                flex: 1;
                padding: 0.5rem;
                border-radius: 0.5rem;
                border: 1px solid var(--border-color);
                background: var(--bg-main);
                color: var(--text-main);
            }
            .chat-input-area button {
                background: var(--primary-blue);
                border: none;
                color: white;
                padding: 0.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // Event Listeners
    fab.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    document.getElementById('close-chat').addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    const sendChat = () => {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (text) {
            addMessage(text, 'user');
            input.value = '';
            // Mock bot response
            setTimeout(() => {
                addMessage("I'm a demo bot for now. Soon I'll be integrated with AI to answer your doubts about exams!", 'bot');
            }, 1000);
        }
    };

    document.getElementById('send-chat').addEventListener('click', sendChat);
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChat();
    });
}

function addMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerText = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}
