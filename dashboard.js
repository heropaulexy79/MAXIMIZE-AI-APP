document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    setupInteractions();
});

function loadDashboardData() {
    // 1. Get the latest result from LocalStorage (from the assessment)
    const storedData = localStorage.getItem('maximizeResult');
    let currentData = null;

    if (storedData) {
        try {
            currentData = JSON.parse(storedData);
        } catch (e) {
            console.error("Data parse error", e);
        }
    }

    // 2. Populate Header & Hero
    if (currentData && currentData.ai) {
        updateHeroSection(currentData.ai);
        updateActionPanel(currentData.ai);
    } else {
        // Fallback if no assessment taken
        document.getElementById('userStage').textContent = "No Assessment Found";
        document.getElementById('userCoreIssue').textContent = "Take your first assessment to see your roadmap.";
        document.getElementById('actionList').innerHTML = '<p class="action-text">Please start your first assessment.</p>';
    }

    // 3. Populate History (Mock Data + Current)
    populateHistory(currentData);
}

function updateHeroSection(aiData) {
    const stage = aiData.stage || "Unknown";
    const coreIssue = aiData.core_issue || "Analysis pending...";
    
    document.getElementById('userStage').textContent = stage;
    document.getElementById('userCoreIssue').textContent = coreIssue;

    // Determine Progress based on stage number (Primitive logic based on stage name)
    // Assuming stages like "Stage 1", "Stage 2" etc.
    let progress = 10; 
    if(stage.includes("1")) progress = 20;
    if(stage.includes("2")) progress = 40;
    if(stage.includes("3")) progress = 60;
    if(stage.includes("4")) progress = 80;
    if(stage.includes("5")) progress = 100;

    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressPercent').textContent = `${progress}%`;
}

function updateActionPanel(aiData) {
    const listContainer = document.getElementById('actionList');
    const reflectionPrompt = document.getElementById('reflectionPrompt');
    
    // Actions
    let actions = aiData.next_action || [];
    if (!Array.isArray(actions)) actions = [actions];

    const actionsHtml = actions.map((act, index) => `
        <div class="action-item">
            <input type="checkbox" id="act_${index}" class="action-checkbox" />
            <label for="act_${index}" class="action-text">${act}</label>
        </div>
    `).join('');

    listContainer.innerHTML = actionsHtml;

    // Reflection
    if (aiData.reflection_question) {
        reflectionPrompt.textContent = aiData.reflection_question;
    }

    // Add event listeners for new checkboxes
    document.querySelectorAll('.action-checkbox').forEach(box => {
        box.addEventListener('change', function() {
            const text = this.nextElementSibling;
            if(this.checked) text.classList.add('done');
            else text.classList.remove('done');
        });
    });
}

function populateHistory(currentData) {
    const tableBody = document.getElementById('historyTableBody');
    
    // Mock History Data (Simulating past assessments)
    const historyData = [
        { date: '2023-10-15', stage: 'Stage 1: Foundation', action: 'View' },
        { date: '2023-11-20', stage: 'Stage 1: Foundation', action: 'View' }
    ];

    // Add current if exists
    if (currentData) {
        historyData.unshift({
            date: 'Today',
            stage: currentData.ai.stage,
            action: 'View'
        });
    }

    const rows = historyData.map(item => `
        <tr>
            <td>${item.date}</td>
            <td><span class="stage-badge">${item.stage.split(':')[0]}</span> ${item.stage.split(':')[1] || ''}</td>
            <td><button class="btn-small" style="padding:2px 8px; font-size:0.7rem">View</button></td>
        </tr>
    `).join('');

    tableBody.innerHTML = rows;
}

function setupInteractions() {
    // Logout
    document.querySelector('.logout-btn').addEventListener('click', () => {
        alert("Logging out...");
        // window.location.href = 'login.html';
    });

    // Export Button
    const exportBtn = document.getElementById('exportBtn');
    if(exportBtn) {
        exportBtn.addEventListener('click', () => {
             // Reuse the download logic from results.js if accessible, or simple alert for now
             alert("Downloading Report...");
        });
    }
}