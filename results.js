// Results Page Logic

class ResultsPage {
  constructor() {
    this.assessmentData = null;
    this.init();
  }

  init() {
    // Simulate loading delay
    setTimeout(() => {
      this.loadAssessmentData();
    }, 2000);
  }

  loadAssessmentData() {
    // First, try to get data from Make response
    const makeResponse = localStorage.getItem('makeResponse');
    const assessmentData = localStorage.getItem('assessmentData');

    if (!assessmentData) {
      this.showError();
      return;
    }

    try {
      this.assessmentData = JSON.parse(assessmentData);
      
      // If Make response exists, merge it with assessment data
      if (makeResponse) {
        const makeData = JSON.parse(makeResponse);
        this.assessmentData = { ...this.assessmentData, ...makeData };
        console.log('Merged data from Make:', this.assessmentData);
      }
      
      this.displayResults();
    } catch (error) {
      console.error('Error parsing assessment data:', error);
      this.showError();
    }
  }

  displayResults() {
    // Hide loading, show results
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultsState').style.display = 'block';

    // Populate stage info
    this.displayStage();
    
    // Populate insights
    this.displayInsights();
    
    // Generate recommendations
    this.displayRecommendations();

    // Setup buttons
    this.setupButtons();
  }

  displayStage() {
    const { stage } = this.assessmentData;
    const stageName = stage.replace('Stage ', '').replace(': ', ' — ');

    document.getElementById('stageName').textContent = stageName;
    document.getElementById('stageDescription').textContent = this.getStageDescription(stage);
  }

  displayInsights() {
    const { answers } = this.assessmentData;

    // Role insight
    document.getElementById('insightRole').textContent = answers.role || 'Not specified';

    // Challenges insight
    const challengesList = answers.challenges && answers.challenges.length > 0
      ? answers.challenges.join(', ')
      : 'Not specified';
    document.getElementById('insightChallenges').innerHTML = challengesList
      .split(', ')
      .map(c => `<span class="challenge-tag">${c}</span>`)
      .join('');

    // Stuck insight
    document.getElementById('insightStuck').textContent = `"${answers.stuck || 'Not specified'}"`;

    // Growth posture insight
    document.getElementById('insightPosture').textContent = answers['growth-posture'] || 'Not specified';
  }

  displayRecommendations() {
    const { answers, stage } = this.assessmentData;
    const recommendations = this.generateRecommendations(stage, answers);

    const container = document.getElementById('recommendationsContainer');
    container.innerHTML = recommendations
      .map(rec => `
        <div class="recommendation-item">
          <div class="recommendation-title">${rec.title}</div>
          <p class="recommendation-text">${rec.text}</p>
        </div>
      `)
      .join('');
  }

  generateRecommendations(stage, answers) {
    const baseRecommendations = {
      'Stage 1: Foundation': [
        {
          title: '1. Define Your Why',
          text: 'Before any strategy, clarify your core purpose and values. This becomes your compass for all decisions.'
        },
        {
          title: '2. Build Daily Habits',
          text: 'Start small with one consistent habit that aligns with your goals. Small wins compound over time.'
        },
        {
          title: '3. Find a Mentor or Community',
          text: 'Seek guidance from those 2-3 steps ahead of you. Community accelerates learning exponentially.'
        },
        {
          title: '4. Start Documenting',
          text: 'Keep a growth journal. Reflect weekly on what worked, what didn\'t, and why.'
        }
      ],
      'Stage 2: Awakening': [
        {
          title: '1. Reframe Your Limiting Beliefs',
          text: 'Challenge the stories you\'ve told yourself. Replace each "I can\'t" with "I haven\'t learned how to yet."'
        },
        {
          title: '2. Expand Your Networks',
          text: 'Connect with people at the next level. Your network is your net worth and your personal growth multiplier.'
        },
        {
          title: '3. Invest in Learning',
          text: 'Take a course, read books, or find a coach in your area of growth. Knowledge compounds.'
        },
        {
          title: '4. Create Accountability',
          text: 'Partner with someone for weekly check-ins. External accountability drives real change.'
        }
      ],
      'Stage 3: Leadership': [
        {
          title: '1. Develop Your Leadership Philosophy',
          text: 'Define how you lead, what you stand for, and the culture you want to create.'
        },
        {
          title: '2. Invest in Your Team',
          text: 'Great leaders develop other leaders. Focus on raising people up, not just getting results.'
        },
        {
          title: '3. Build Strategic Partnerships',
          text: 'Collaborate with complementary leaders. Partnerships amplify impact and reach.'
        },
        {
          title: '4. Model the Way',
          text: 'Be the person you want your team to become. Leadership is influence through example.'
        }
      ],
      'Stage 4: Execution': [
        {
          title: '1. Optimize Your Systems',
          text: 'Audit your workflows and eliminate friction. Small process improvements compound into massive gains.'
        },
        {
          title: '2. Measure What Matters',
          text: 'Define key metrics for your goals. What gets measured gets managed.'
        },
        {
          title: '3. Elevate Your Team',
          text: 'Delegate strategically. Your job is to multiply impact through others, not do everything yourself.'
        },
        {
          title: '4. Build Leverage',
          text: 'Focus on high-impact activities. Master the art of doing more with less friction.'
        }
      ],
      'Stage 5: Legacy': [
        {
          title: '1. Define Your Legacy Intent',
          text: 'What impact do you want to leave? Let this guide every major decision.'
        },
        {
          title: '2. Create Scalable Systems',
          text: 'Build processes that can operate without you. True legacy is impact that outlasts you.'
        },
        {
          title: '3. Mentor the Next Generation',
          text: 'Invest deeply in emerging leaders. This is how movements are born.'
        },
        {
          title: '4. Measure Impact',
          text: 'Track not just financial success but cultural, social, and personal impact.'
        }
      ]
    };

    // Return relevant recommendations, or defaults if stage not found
    return baseRecommendations[stage] || baseRecommendations['Stage 1: Foundation'];
  }

  getStageDescription(stage) {
    const descriptions = {
      'Stage 1: Foundation': 'You\'re building your foundation. This is about clarity, consistency, and creating the habits that will carry you forward.',
      'Stage 2: Awakening': 'You\'re awakening to new possibilities. This stage is about reframing your mindset and expanding your beliefs about what\'s possible.',
      'Stage 3: Leadership': 'You\'re stepping into leadership. Now it\'s about multiplying your impact through others and creating meaningful influence.',
      'Stage 4: Execution': 'You\'re executing with purpose. This stage is about mastering systems, optimizing processes, and scaling what works.',
      'Stage 5: Legacy': 'You\'re thinking in terms of legacy. Your focus shifts to creating lasting impact that will outlive your direct efforts.'
    };

    return descriptions[stage] || 'Continue your growth journey with intention and purpose.';
  }

  setupButtons() {
    document.getElementById('downloadBtn').addEventListener('click', () => {
      this.downloadReport();
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
      localStorage.removeItem('assessmentData');
      window.location.href = 'assessment.html';
    });
  }

  downloadReport() {
    const { answers, stage } = this.assessmentData;
    const reportContent = this.generateReportContent(answers, stage);

    // Create and download PDF or TXT (simple implementation uses download text file)
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', 'MAXIMIZE_Assessment_Report.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  generateReportContent(answers, stage) {
    const timestamp = new Date(this.assessmentData.timestamp).toLocaleDateString();
    
    return `
MAXIMIZE — ASSESSMENT REPORT
Generated: ${timestamp}
═══════════════════════════════════════════════════════════════

YOUR STAGE
${stage}

KEY INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Role:
${answers.role}

Challenges You're Facing:
${answers.challenges.join('\n')}

What Feels Stuck:
"${answers.stuck}"

Your Growth Posture:
${answers['growth-posture']}

═══════════════════════════════════════════════════════════════

This assessment is your personalized roadmap for growth.
Use these insights to inform your next steps and priorities.

MAXIMIZE Nation — Discover Your Stage, Own Your Growth
    `.trim();
  }

  showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ResultsPage();
});
