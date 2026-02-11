// Results Page Logic

class ResultsPage {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    this.loadResultData();
  }

  loadResultData() {
    const stored = localStorage.getItem('maximizeResult');

    if (!stored) {
      this.showError();
      return;
    }

    try {
      this.data = JSON.parse(stored);
      this.displayResults();
    } catch (error) {
      console.error('Error parsing result data:', error);
      this.showError();
    }
  }

  displayResults() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultsState').style.display = 'block';

    this.displayStage();
    this.displayInsights();
    this.displayRecommendations();
    this.setupButtons();
  }

  displayStage() {
    const stage =
      this.data.ai?.stage || this.data.assessment?.stage || 'Unknown Stage';

    const stageName = stage.replace('Stage ', '').replace(': ', ' — ');

    document.getElementById('stageName').textContent = stageName;
    document.getElementById('stageDescription').textContent =
      this.getStageDescription(stage);
  }

  displayInsights() {
    const answers = this.data.assessment?.answers;

    if (!answers) return;

    document.getElementById('insightRole').textContent =
      answers.role || 'Not specified';

    const challengesList =
      answers.challenges && answers.challenges.length > 0
        ? answers.challenges
        : [];

    document.getElementById('insightChallenges').innerHTML =
      challengesList
        .map(c => `<span class="challenge-tag">${c}</span>`)
        .join('') || 'Not specified';

    document.getElementById('insightStuck').textContent =
      `"${answers.stuck || 'Not specified'}"`;

    document.getElementById('insightPosture').textContent =
      answers['growth-posture'] || 'Not specified';
  }

  displayRecommendations() {
    const aiRecommendations = this.data.ai?.nextActions;
    const container = document.getElementById('recommendationsContainer');

    // 🔥 If AI returned custom recommendations, use them
    if (aiRecommendations && aiRecommendations.length > 0) {
      container.innerHTML = aiRecommendations
        .map((rec, index) => `
          <div class="recommendation-item">
            <div class="recommendation-title">${index + 1}. Action Step</div>
            <p class="recommendation-text">${rec}</p>
          </div>
        `)
        .join('');
      return;
    }

    // Fallback to stage-based recommendations
    const stage =
      this.data.ai?.stage || this.data.assessment?.stage;

    const recommendations = this.generateRecommendations(stage);

    container.innerHTML = recommendations
      .map(rec => `
        <div class="recommendation-item">
          <div class="recommendation-title">${rec.title}</div>
          <p class="recommendation-text">${rec.text}</p>
        </div>
      `)
      .join('');
  }

  generateRecommendations(stage) {
    const baseRecommendations = {
      'Stage 1: Identity Revelation': [
        {
          title: '1. Clarify Your Identity',
          text: 'Define who you are beyond your current role. Identity shapes behavior.'
        },
        {
          title: '2. Audit Your Beliefs',
          text: 'Write down 3 beliefs currently shaping your decisions.'
        },
        {
          title: '3. Seek Clarity Conversations',
          text: 'Talk with someone 2 steps ahead of you about your blind spots.'
        }
      ],
      'Stage 2: Mindset Transformation': [
        {
          title: '1. Reframe Limiting Narratives',
          text: 'Challenge internal assumptions that limit growth.'
        },
        {
          title: '2. Expand Learning Capacity',
          text: 'Invest intentionally in skill and mental expansion.'
        }
      ],
      'Stage 3: Leadership Activation': [
        {
          title: '1. Lead Something Small',
          text: 'Start influencing within your immediate circle.'
        }
      ],
      'Stage 4: Purpose Deployment': [
        {
          title: '1. Build Systems',
          text: 'Structure your work to create consistent outcomes.'
        }
      ],
      'Stage 5: Legacy Construction': [
        {
          title: '1. Design for Continuity',
          text: 'Think beyond yourself. Build structures that outlive you.'
        }
      ]
    };

    return baseRecommendations[stage] ||
      baseRecommendations['Stage 1: Identity Revelation'];
  }

  getStageDescription(stage) {
    const descriptions = {
      'Stage 1: Identity Revelation':
        'This stage is about uncovering who you truly are beneath performance and pressure.',
      'Stage 2: Mindset Transformation':
        'Here, you are rewiring the internal architecture shaping your decisions.',
      'Stage 3: Leadership Activation':
        'You are stepping into influence and activating responsibility.',
      'Stage 4: Purpose Deployment':
        'Execution becomes aligned with purpose and structure.',
      'Stage 5: Legacy Construction':
        'You are thinking beyond impact toward generational influence.'
    };

    return descriptions[stage] ||
      'Continue your growth journey with clarity and intention.';
  }

  setupButtons() {
    document.getElementById('downloadBtn').addEventListener('click', () => {
      this.downloadReport();
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
      localStorage.removeItem('maximizeResult');
      window.location.href = 'assessment.html';
    });
  }

  downloadReport() {
    const answers = this.data.assessment?.answers;
    const stage =
      this.data.ai?.stage || this.data.assessment?.stage;

    const aiInsights = this.data.ai?.coreIssues || [];

    const reportContent = `
MAXIMIZE — PERSONAL INSIGHT REPORT
════════════════════════════════════

STAGE:
${stage}

CORE INSIGHTS:
${aiInsights.join('\n')}

ROLE:
${answers?.role}

CHALLENGES:
${answers?.challenges?.join('\n')}

WHAT FEELS STUCK:
"${answers?.stuck}"

GROWTH POSTURE:
${answers?.['growth-posture']}

════════════════════════════════════
Generated by MAXIMIZE AI Diagnostic
    `.trim();

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' +
        encodeURIComponent(reportContent)
    );
    element.setAttribute(
      'download',
      'MAXIMIZE_Insight_Report.txt'
    );
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ResultsPage();
});
