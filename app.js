/* ==========================================================================
   HANDCRAFTED DIGITAL WORKSPACE - JAVASCRIPT APPLICATION LOGIC
   Sameera Personal Portfolio
   ========================================================================== */

// --- 1. PREMIUM WORKSPACE LOADING SCREEN (3-4 SEC DURATION) ---
const bootLines = [
  "Initializing Workspace...",
  "Loading Projects...",
  "Loading Resume...",
  "Connecting GitHub...",
  "Preparing Portfolio...",
  "Welcome."
];

function initBootScreen() {
  const consoleEl = document.getElementById('boot-console');
  const progressFill = document.getElementById('boot-progress');
  const bootScreen = document.getElementById('boot-screen');
  const skipBtn = document.getElementById('skip-boot-btn');

  let step = 0;
  const total = bootLines.length;
  const lineInterval = 350; // Total duration ~3.3 seconds

  const interval = setInterval(() => {
    if (step < total) {
      const line = document.createElement('div');
      line.style.opacity = '0';
      line.style.transition = 'opacity 0.3s ease';
      line.innerHTML = `<span style="color:var(--accent-cyan)">[OK]</span> ${bootLines[step]}`;
      consoleEl.appendChild(line);
      requestAnimationFrame(() => line.style.opacity = '1');

      step++;
      progressFill.style.width = `${(step / total) * 100}%`;
    } else {
      clearInterval(interval);
      setTimeout(() => bootScreen.classList.add('loaded'), 400);
    }
  }, lineInterval);

  skipBtn.addEventListener('click', () => {
    clearInterval(interval);
    bootScreen.classList.add('loaded');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearInterval(interval);
      bootScreen.classList.add('loaded');
    }
  });
}

// --- 2. ENHANCED DUAL CUSTOM CURSOR (DOT + RING) ---
function initCustomCursor() {
  const dot = document.getElementById('custom-cursor-dot');
  const ring = document.getElementById('custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot moves immediately with mouse (0 lag)
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function renderRing() {
    // Smooth spring lerp for outer ring
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  // Hover states management
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('button, a, .floating-tech-chip, .stack-proj-card, .project-card, .skill-node');
    if (!target) {
      ring.className = '';
      return;
    }

    if (target.matches('.btn-primary, .btn-secondary, button')) {
      ring.className = 'hover-button';
    } else if (target.matches('.floating-tech-chip, .skill-node')) {
      ring.className = 'hover-chip';
    } else if (target.matches('.stack-proj-card, .project-card')) {
      ring.className = 'hover-project';
    } else if (target.matches('a, [data-cursor-type="link"]')) {
      ring.className = 'hover-link';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest('button, a, .floating-tech-chip, .stack-proj-card, .project-card, .skill-node')) {
      ring.className = '';
    }
  });

  document.addEventListener('mousedown', () => {
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.6)`;
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
  });
}

// Add CSS keyframe for ripple dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes cursorRipple {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(3); opacity: 0; }
  }
`;
document.head.appendChild(style);

// --- 3. LIGHTWEIGHT CANVAS PARTICLES ---
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 18;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 1.2 + 0.5,
      color: Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(56, 189, 248, ',
      alpha: Math.random() * 0.2 + 0.05
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(render);
  }

  render();
}

// --- 4. PROJECTS DATA WITH HONEST CANDIDATE LABELS ---
const projectsData = [
  {
    id: 'routepay',
    title: 'RoutePay',
    type: 'Personal Project',
    tag: 'Payment Routing Engine',
desc: 'Payment routing service built with Node.js and Express featuring idempotency, failover, and circuit breaker patterns.',
learned: 'Learned how idempotency keys and circuit breakers help make payment systems more reliable.',
    visibleStack: ['Node.js', 'Express', 'Redis', 'MySQL'],
    githubUrl: 'https://github.com',
    caseStudy: {
overview: 'A backend project simulating how payment gateways handle retries, failures, and duplicate requests.',
      problem: 'Preventing double charging when an upstream payment gateway times out before returning 200 OK.',
      architectureNodes: ['Client Req', 'Express Gateway', 'Redis Lock Check', 'Circuit Breaker', 'Payment Gateway A/B'],
      apiEndpoint: 'POST /v1/payments',
      apiReq: `{\n  "amount": 2500,\n  "currency": "USD",\n  "idempotencyKey": "req_pay_9981x"\n}`,
      apiRes: `{\n  "paymentId": "pay_tx_7721",\n  "status": "COMPLETED"\n}`,
dbSchema: 'MySQL stores payment records while Redis maintains temporary idempotency locks.',
      challenges: {
    problem: 'Handling gateway timeouts without processing duplicate payments.',
    firstAttempt: 'Retried failed payment requests immediately.',
    whyFailed: 'A timeout did not always mean the payment had failed, leading to duplicate requests.',
    finalSolution: 'Added Redis idempotency locks before forwarding requests to payment gateways.'
},
learnings: 'Next, I would explore message queues, the Outbox Pattern, and asynchronous payment processing.'    }
  },
  {
    id: 'stackread',
    title: 'Stackread',
    type: 'Developer Tool',
    tag: 'GitHub Repository Analyzer',
desc: 'GitHub repository analyzer that summarizes project structure using the GitHub API and Gemini AI.',
learned: 'Learned how to process repository files efficiently while managing LLM context limits.',
    visibleStack: ['React', 'Express', 'GitHub API', 'Redis', 'Gemini API'],
    githubUrl: 'https://github.com',
    caseStudy: {
overview: 'Developer tool that helps understand unfamiliar GitHub repositories through AI-generated summaries.',
problem: 'Reading large repositories manually is slow and time-consuming.',
      architectureNodes: ['React Client', 'Express Gateway', 'Redis Cache Check', 'GitHub API', 'Gemini AI API'],
      apiEndpoint: 'POST /api/analyze',
      apiReq: `{\n  "repoUrl": "https://github.com/sameera/routepay"\n}`,
      apiRes: `{\n  "repoName": "routepay",\n  "summary": "Node.js Express Payment Router using Redis Idempotency"\n}`,
dbSchema: 'Redis caches generated summaries to reduce repeated API calls.',
     challenges: {
    problem: 'Large repositories exceeded Gemini context limits.',
    firstAttempt: 'Sent entire repository files directly to the model.',
    whyFailed: 'Large prompts increased latency and frequently exceeded token limits.',
    finalSolution: 'Parsed and filtered repository files before sending only the relevant content.'
},

      learnings: 'I would like to evolve Stackread into a tool that helps explorers quickly understand unfamiliar open-source projects before making their first contribution.'
    }
  },
  {
    id: 'ecoride',
    title: 'Ecoride',
    type: 'Academic Project',
    tag: 'Carpooling Microservices Backend',
desc: 'Ride-sharing backend built with Node.js, Express, and MySQL for managing rides and bookings.',
learned: 'Learned to coordinate concurrent database operations using Promise.all and optimistic locking.',
    visibleStack: ['Node.js', 'Express', 'MySQL', 'REST APIs', 'Promise.all'],
    githubUrl: 'https://github.com/sameerapujari/EcoRide-Carpooling-System',
    caseStudy: {
overview: 'Academic backend project for managing ride creation, booking, and search.',
problem: 'Handling multiple users booking limited seats at the same time.',
      architectureNodes: ['Client App', 'Express Router', 'MySQL Driver Store', 'Promise.all Resolver'],
      apiEndpoint: 'GET /api/v1/rides/search',
      apiReq: `{\n  "origin": "Campus",\n  "destination": "Tech Park"\n}`,
      apiRes: `{\n  "matches": 4,\n  "availableRides": [{ "driver": "Alex", "seats": 2 }]\n}`,
dbSchema: 'MySQL database with normalized tables for users, rides, bookings, and reviews.',
      challenges: {
    problem: 'Preventing overbooking during simultaneous booking requests.',
    firstAttempt: 'Processed bookings using sequential database queries.',
    whyFailed: 'Concurrent requests could reserve the same seat.',
    finalSolution: 'Applied optimistic locking and parallel database operations where appropriate.'
},
learnings: 'I would extend it with live ride tracking, notifications, and location-aware ride matching.'    }
  },
  {
    id: 'os-simulator',
    title: 'OS Simulator',
    type: 'Academic Project',
    tag: 'Process Scheduling & Memory Allocator',
desc: 'C++ simulator demonstrating CPU scheduling and virtual memory management concepts.',
learned: 'Built a stronger understanding of scheduling algorithms, paging, and process management.',
    visibleStack: ['C++', 'Operating Systems', 'Algorithms'],
    githubUrl: 'https://github.com/sameerapujari/MultiprogOS',
    caseStudy: {
overview: 'Academic simulator visualizing common operating system scheduling and memory allocation algorithms.',
problem: 'Making operating system concepts easier to understand through simulation.',
      architectureNodes: ['Process Gen', 'Scheduling Queue', 'Virtual CPU', 'Memory Pager'],
      apiEndpoint: 'CLI Interface Engine',
      apiReq: `create_process(pid=4, priority=1, memory=64MB);`,
      apiRes: `Process 4 allocated to Frame 12. Switch count: 1`,
dbSchema: 'Virtual page table mapping logical pages to physical memory frames.',
      challenges: {
    problem: 'Accurately simulating process execution and scheduling.',
    firstAttempt: 'Executed processes in a simple sequential loop.',
    whyFailed: 'It did not reflect the behavior of preemptive scheduling algorithms.',
    finalSolution: 'Implemented separate scheduling logic with simulated CPU time slices.'
},

learnings: 'I would extend it by visualizing page replacement algorithms and adding process synchronization.'    }
  },
  {
    id: 'cdn-cache',
title: 'CDN Cache Optimizer',
type: 'Learning Project',
tag: 'Distributed Systems Simulation',

desc: 'Python-based CDN simulator evaluating cache eviction, cache pre-loading, and request routing strategies.',

learned: 'Implemented LRU caching, dynamic programming, Branch & Bound, and Dijkstra\'s algorithm in a realistic CDN simulation.',

visibleStack: [
  'Python',
  'LRU Cache',
  'Dynamic Programming',
  'Dijkstra',
  'Streamlit'
],

githubUrl: 'https://github.com/sameerapujari/cdn_cache_optimiser',

caseStudy: {
  overview: 'Learning project simulating a Content Delivery Network to compare cache eviction, cache pre-loading, and routing algorithms.',

  problem: 'Reducing content access latency while maximizing cache hit rates across distributed CDN nodes.',

  architectureNodes: [
    'Traffic Generator',
    'Cache Engine',
    'Routing Engine',
    'CDN Nodes',
    'Dashboard'
  ],

  apiEndpoint: 'Simulation Engine',

  apiReq: `simulate(requestTrace, cacheSize, strategy);`,

  apiRes: `Cache Hit Rate: 84%\nAverage Latency: 23ms`,

  dbSchema: 'In-memory cache using hash maps, doubly linked lists, and graph-based routing structures.',

  challenges: {
    problem: 'Balancing cache hit rates with request latency under different caching strategies.',
    firstAttempt: 'Implemented only standard LRU cache eviction.',
    whyFailed: 'Did not account for intelligent cache pre-loading or network routing decisions.',
    finalSolution: 'Combined LRU, Dynamic Programming, Branch & Bound, and Dijkstra\'s algorithm to compare multiple optimization strategies.'
  },

  learnings: 'If I were extending this further, I\'d explore consistent hashing, adaptive cache replacement, and distributed cache coordination.'
    }
  },
  {
id: 'medical-image-detection',

title: 'Chest X-Ray AI',

type: 'Research Project',

tag: 'Computer Vision',

desc: 'Deep learning model built with PyTorch and EfficientNet-B0 for automated medical image abnormality detection.',

learned: 'Gained hands-on experience with transfer learning, image preprocessing, model evaluation, and deep learning workflows.',

visibleStack: [
  'Python',
  'PyTorch',
  'EfficientNet-B0',
  'OpenCV',
  'Computer Vision'
],

githubUrl: 'https://github.com/sameerapujari/chest-xray-classification',

caseStudy: {
  overview: 'Research project focused on detecting abnormalities in medical images using transfer learning with EfficientNet-B0.',

  problem: 'Building an accurate image classification model while working with limited labeled medical imaging data.',

  architectureNodes: [
    'Medical Images',
    'Preprocessing',
    'EfficientNet-B0',
    'Classifier',
    'Prediction'
  ],

  apiEndpoint: 'Model Inference',

  apiReq: `Input: Chest X-ray Image`,

  apiRes: `Prediction: Abnormal (Confidence: 0.91)`,

  dbSchema: 'Image dataset organized into labeled classes with preprocessing and augmentation pipelines.',

  challenges: {
    problem: 'Preventing overfitting on a relatively small medical imaging dataset.',
    firstAttempt: 'Training the model directly on the available dataset.',
    whyFailed: 'The model overfit quickly and generalized poorly on unseen images.',
    finalSolution: 'Applied transfer learning with EfficientNet-B0, image augmentation, and fine-tuning to improve generalization.'
  },

  learnings: 'If I were extending this further, I\'d explore Grad-CAM for model explainability, larger medical datasets, and model deployment.'
    }
  }
];

function renderProjects() {
  const container = document.getElementById('projects-grid');
  container.innerHTML = '';

  projectsData.forEach(p => {
    const card = document.createElement('div');
    card.className = 'glass-card card-md project-card';
    card.setAttribute('data-project-id', p.id);

    card.innerHTML = `
      <div>
        <div class="project-header-row">
          <h3 class="project-card-title">${p.title}</h3>
          <span class="project-type-badge">${p.type}</span>
        </div>

        <p class="project-desc-text">${p.desc}</p>

        <div class="project-learned-box">
          <strong>What I Learned:</strong> ${p.learned}
        </div>

        <div class="project-visible-stack">
          ${p.visibleStack.map(s => `<span class="stack-pill">${s}</span>`).join('')}
        </div>
      </div>

      <div class="project-card-ctas">
        <button class="btn-primary" style="font-size:var(--fs-caption); padding:6px 14px;" onclick="openCaseStudyModal('${p.id}')">
          Read Case Study
        </button>
        <a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn-secondary" style="font-size:var(--fs-caption); padding:6px 14px;" data-cursor-type="link">
          GitHub
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

function highlightSkillProjects(skillName, element) {
  document.querySelectorAll('.skill-node').forEach(s => s.classList.remove('active'));
  element.classList.add('active');

  document.querySelectorAll('.project-card').forEach(card => {
    const projId = card.getAttribute('data-project-id');
    const proj = projectsData.find(p => p.id === projId);

    if (proj && proj.visibleStack.some(st => st.toLowerCase().includes(skillName.toLowerCase()))) {
      card.style.borderColor = 'var(--accent-cyan)';
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      card.style.borderColor = 'var(--glass-border)';
    }
  });
}

// --- 5. UNIFIED CASE STUDY MODAL ---
function openCaseStudyModal(projectId) {
  const p = projectsData.find(proj => proj.id === projectId);
  if (!p) return;

  const cs = p.caseStudy;
  const modalBackdrop = document.getElementById('case-study-modal');
  const bodyContainer = document.getElementById('modal-body-container');

  bodyContainer.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="project-type-badge">${p.type}</span>
      <h2 style="font-size: 1.7rem; margin-top: 6px;">${p.title} — ${p.tag}</h2>
    </div>

    <div class="case-study-tabs">
      <button class="cs-tab-btn active" onclick="switchCaseStudyTab('overview')">Overview</button>
      <button class="cs-tab-btn" onclick="switchCaseStudyTab('arch')">Architecture</button>
      <button class="cs-tab-btn" onclick="switchCaseStudyTab('api')">API Spec</button>
      <button class="cs-tab-btn" onclick="switchCaseStudyTab('db')">Database</button>
      <button class="cs-tab-btn" onclick="switchCaseStudyTab('challenges')">Challenges</button>
      <button class="cs-tab-btn" onclick="switchCaseStudyTab('learnings')">Learnings</button>
    </div>

    <div class="cs-tab-content active" id="cs-tab-overview">
      <h4 style="color:var(--accent-cyan); margin-bottom:8px;">Overview</h4>
      <p style="color:var(--text-muted); margin-bottom:16px;">${cs.overview}</p>
      <h4 style="color:var(--accent-cyan); margin-bottom:8px;">Problem Statement</h4>
      <p style="color:var(--text-muted);">${cs.problem}</p>
    </div>

    <div class="cs-tab-content" id="cs-tab-arch">
      <h4 style="color:var(--accent-cyan); margin-bottom:12px;">Request Flow</h4>
      <div style="display:flex; flex-wrap:wrap; gap:8px; padding:16px; background:#0A0A0C; border-radius:6px; border:1px solid var(--border-color); font-family:var(--font-code); font-size:0.85rem;">
        ${cs.architectureNodes.map((node, i) => `
          <span>${node}</span>
          ${i < cs.architectureNodes.length - 1 ? '<span style="color:var(--text-dim);">➔</span>' : ''}
        `).join('')}
      </div>
    </div>

    <div class="cs-tab-content" id="cs-tab-api">
      <h4 style="color:var(--accent-cyan); margin-bottom:8px;">API Contract: ${cs.apiEndpoint}</h4>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:12px;">
        <div>
          <p style="font-size:var(--fs-code); color:var(--text-muted); margin-bottom:4px;">Request Payload:</p>
          <pre style="background:#0A0A0C; padding:12px; border-radius:6px; border:1px solid var(--border-color); font-size:var(--fs-code); color:#E2E8F0;">${cs.apiReq}</pre>
        </div>
        <div>
          <p style="font-size:var(--fs-code); color:var(--text-muted); margin-bottom:4px;">Response (200 OK):</p>
          <pre style="background:#0A0A0C; padding:12px; border-radius:6px; border:1px solid rgba(16,185,129,0.3); font-size:var(--fs-code); color:#A7F3D0;">${cs.apiRes}</pre>
        </div>
      </div>
    </div>

    <div class="cs-tab-content" id="cs-tab-db">
      <h4 style="color:var(--accent-cyan); margin-bottom:8px;">Database & Storage Design</h4>
      <p style="color:var(--text-muted); line-height:1.6;">${cs.dbSchema}</p>
    </div>

    <div class="cs-tab-content" id="cs-tab-challenges">
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div>
          <strong style="color:var(--text-main);">1. Problem:</strong>
          <p style="color:var(--text-muted); font-size:0.9rem;">${cs.challenges.problem}</p>
        </div>
        <div>
          <strong style="color:var(--text-main);">2. First Attempt:</strong>
          <p style="color:var(--text-muted); font-size:0.9rem;">${cs.challenges.firstAttempt}</p>
        </div>
        <div>
          <strong style="color:#F87171;">3. Why It Failed:</strong>
          <p style="color:var(--text-muted); font-size:0.9rem;">${cs.challenges.whyFailed}</p>
        </div>
        <div>
          <strong style="color:var(--accent-green);">4. Final Solution:</strong>
          <p style="color:var(--text-main); font-size:0.9rem;">${cs.challenges.finalSolution}</p>
        </div>
      </div>
    </div>

    <div class="cs-tab-content" id="cs-tab-learnings">
      <h4 style="color:var(--accent-cyan); margin-bottom:8px;">Future Production Explorations</h4>
      <div style="padding:16px; background:rgba(99,102,241,0.1); border-left:3px solid var(--primary); border-radius:6px; font-family:var(--font-code); font-size:0.88rem; color:#E2E8F0;">
        ${cs.learnings}
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
}

function switchCaseStudyTab(tabId) {
  document.querySelectorAll('.cs-tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  document.querySelectorAll('.cs-tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`cs-tab-${tabId}`).classList.add('active');
}

function closeModal() {
  document.getElementById('case-study-modal').classList.remove('active');
}

function openResumeModal() {
  document.getElementById('resume-modal').classList.add('active');
}
function closeResumeModal() {
  document.getElementById('resume-modal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  initBootScreen();
  initCustomCursor();
  initCanvasBackground();
  renderProjects();

  const stack4=document.querySelector("#stack-4");
    const cards=document.querySelectorAll("#stack-4 .explore-card");

    const observer=new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(!entry.isIntersecting) return;

            cards.forEach((card,index)=>{

                setTimeout(()=>{

                    card.classList.add("show");

                },index*250);

            });

            observer.disconnect();

        });

    },{

        threshold:.4

    });

    observer.observe(stack4);
});
