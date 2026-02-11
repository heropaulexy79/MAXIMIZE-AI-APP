// Assessment Form Logic

console.log("Assessment.js loaded");

class AssessmentForm {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.answers = {
      fullName: null,
      email: null,
      role: null,
      challenges: [],
      stuck: null,
      'growth-posture': null
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateProgress();
  }

  setupEventListeners() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (!nextBtn || !prevBtn) {
      console.error('Navigation buttons not found');
      return;
    }

    console.log('Setting up event listeners for buttons');
    
    nextBtn.addEventListener('click', (e) => {
      console.log('Next button clicked');
      e.preventDefault();
      this.nextQuestion();
    });
    
    prevBtn.addEventListener('click', (e) => {
      console.log('Previous button clicked');
      e.preventDefault();
      this.prevQuestion();
    });

    // Also allow Enter key to continue on certain questions
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.currentStep < this.totalSteps) {
        const textarea = document.querySelector('.textarea-input:not([style*="display: none"])');
        if (!textarea) {
          this.nextQuestion();
        }
      }
    });
  }

  validateCurrentQuestion() {
    const questionId = `q${this.currentStep}`;
    const question = document.getElementById(questionId);

    if (!question) return false;

    switch (this.currentStep) {
      case 1:
        // Q1: Full Name and Email
        const fullNameInput = question.querySelector('input[name="fullName"]');
        const emailInput = question.querySelector('input[name="email"]');
        
        if (!fullNameInput || !emailInput) {
          console.error('Form inputs not found');
          return false;
        }
        
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!fullName) {
          this.showValidationError('Please enter your full name');
          return false;
        }

        if (!email) {
          this.showValidationError('Please enter your email address');
          return false;
        }

        if (!emailRegex.test(email)) {
          this.showValidationError('Please enter a valid email address');
          return false;
        }

        this.answers.fullName = fullName;
        this.answers.email = email;
        return true;

      case 2:
        // Q2: Role - either a radio selected or text input filled
        const roleRadios = question.querySelectorAll('input[name="role"]');
        const roleText = question.querySelector('input[name="other-role"]');
        
        const radioSelected = Array.from(roleRadios).some(r => r.checked);
        const textFilled = roleText.value.trim() !== '';

        if (!radioSelected && !textFilled) {
          this.showValidationError('Please select your role or specify "Other"');
          return false;
        }

        // Save the answer
        if (radioSelected) {
          const selected = Array.from(roleRadios).find(r => r.checked);
          this.answers.role = selected.value;
        } else {
          this.answers.role = roleText.value;
        }
        return true;

      case 3:
        // Q3: Challenges - at least one checked
        const checkboxes = question.querySelectorAll('input[name="challenges"]');
        const selected = Array.from(checkboxes).filter(c => c.checked);

        if (selected.length === 0) {
          this.showValidationError('Please select at least one challenge');
          return false;
        }

        this.answers.challenges = selected.map(c => c.value);
        return true;

      case 4:
        // Q4: Stuck - textarea must have content
        const textarea = question.querySelector('textarea[name="stuck"]');

        if (!textarea.value.trim()) {
          this.showValidationError('Please share what feels stuck');
          return false;
        }

        this.answers.stuck = textarea.value.trim();
        return true;

      case 5:
        // Q5: Growth Posture - one selected
        const growthRadios = question.querySelectorAll('input[name="growth-posture"]');
        const posture = Array.from(growthRadios).find(r => r.checked);

        if (!posture) {
          this.showValidationError('Please describe your growth posture');
          return false;
        }

        this.answers['growth-posture'] = posture.value;
        return true;

      default:
        return false;
    }
  }

  showValidationError(message) {
    const nextBtn = document.getElementById('nextBtn');
    const originalText = nextBtn.textContent;
    
    nextBtn.textContent = '❌ ' + message;
    nextBtn.style.background = 'rgba(239, 68, 68, 0.2)';
    
    setTimeout(() => {
      nextBtn.textContent = originalText;
      nextBtn.style.background = '';
    }, 3000);
  }

  nextQuestion() {
    console.log('nextQuestion called for step', this.currentStep);
    
    if (!this.validateCurrentQuestion()) {
      console.log('Validation failed for step', this.currentStep);
      return;
    }

    if (this.currentStep === this.totalSteps) {
      this.submitAssessment();
      return;
    }

    // Hide current question
    const currentQuestion = document.getElementById(`q${this.currentStep}`);
    currentQuestion.style.display = 'none';

    // Move to next
    this.currentStep++;
    
    // Show next question
    const nextQuestion = document.getElementById(`q${this.currentStep}`);
    nextQuestion.style.display = 'block';

    // Update progress
    this.updateProgress();

    // Focus on first input of new question
    setTimeout(() => {
      const firstInput = nextQuestion.querySelector('input, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  prevQuestion() {
    if (this.currentStep === 1) return;

    // Hide current question
    const currentQuestion = document.getElementById(`q${this.currentStep}`);
    currentQuestion.style.display = 'none';

    // Move to previous
    this.currentStep--;
    
    // Show previous question
    const prevQuestion = document.getElementById(`q${this.currentStep}`);
    prevQuestion.style.display = 'block';

    // Update progress
    this.updateProgress();
  }

  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepEl = document.getElementById('currentStep');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Update progress bar
    const percentage = (this.currentStep / this.totalSteps) * 100;
    progressFill.style.width = percentage + '%';

    // Update step text
    currentStepEl.textContent = this.currentStep;

    // Show/hide back button
    if (this.currentStep === 1) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
    }

    // Update next button text
    if (this.currentStep === this.totalSteps) {
      nextBtn.textContent = 'Reveal My Insight';
    } else {
      nextBtn.textContent = 'Continue';
    }
  }

  submitAssessment() {
    // Package all answers
    const assessmentData = {
      timestamp: new Date().toISOString(),
      answers: this.answers,
      stage: this.mapToStage(this.answers['growth-posture'])
    };

    // Show processing state
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = '✓ Processing...';
    nextBtn.disabled = true;

    // Send to Make webhook
    this.sendToMake(assessmentData);
  }

  sendToMake(assessmentData) {
    console.log("Sending to Make:", assessmentData);
  const webhookUrl = MAXIMIZE_CONFIG.make.webhookUrl;
  const apiKey = MAXIMIZE_CONFIG.make.apiKey;

  if (!webhookUrl || !apiKey) {
    console.warn('Make webhook not configured. Saving data locally only.');
    localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
    window.location.href = 'results.html';
    return;
  }

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-make-apikey": apiKey
    },
    body: JSON.stringify(assessmentData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Make webhook failed: ${response.status}`);
      }
      return response.text(); // 👈 IMPORTANT (see Fix #2)
    })
    .then(data => {
      localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
      console.log("Sent to Make successfully:", data);
      window.location.href = 'results.html';
    })
    .catch(error => {
      console.error('Error sending to Make:', error);
      localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
      window.location.href = 'results.html';
    });
}


  mapToStage(growthPosture) {
    const stageMap = {
      'Searching for clarityy': 'Stage 1: Identity Revelation',
      'Reframing my mindset': 'Stage 2: Mindset Transformation',
      'Stepping into leadership': 'Stage 3: Leadership Activation',
      'Executing with purpose': 'Stage 4: Purpose Deployment',
      'Thinking long-term impact': 'Stage 5: Legacy Construction'
    };
    return stageMap[growthPosture] || 'Unknown Stage';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AssessmentForm();
});
