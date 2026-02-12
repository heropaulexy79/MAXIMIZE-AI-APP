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
      'growth-posture': null,
      next_action: [] // Ensure next_action exists
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
        const roleRadios = question.querySelectorAll('input[name="role"]');
        const roleText = question.querySelector('input[name="other-role"]');
        
        const radioSelected = Array.from(roleRadios).some(r => r.checked);
        const textFilled = roleText.value.trim() !== '';

        if (!radioSelected && !textFilled) {
          this.showValidationError('Please select your role or specify "Other"');
          return false;
        }

        if (radioSelected) {
          const selected = Array.from(roleRadios).find(r => r.checked);
          this.answers.role = selected.value;
        } else {
          this.answers.role = roleText.value;
        }
        return true;

      case 3:
        const checkboxes = question.querySelectorAll('input[name="challenges"]');
        const selected = Array.from(checkboxes).filter(c => c.checked);

        if (selected.length === 0) {
          this.showValidationError('Please select at least one challenge');
          return false;
        }

        this.answers.challenges = selected.map(c => c.value);
        return true;

      case 4:
        const textarea = question.querySelector('textarea[name="stuck"]');

        if (!textarea.value.trim()) {
          this.showValidationError('Please share what feels stuck');
          return false;
        }

        this.answers.stuck = textarea.value.trim();
        return true;

      case 5:
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

    const currentQuestion = document.getElementById(`q${this.currentStep}`);
    currentQuestion.style.display = 'none';

    this.currentStep++;
    
    const nextQuestion = document.getElementById(`q${this.currentStep}`);
    nextQuestion.style.display = 'block';

    this.updateProgress();

    setTimeout(() => {
      const firstInput = nextQuestion.querySelector('input, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  prevQuestion() {
    if (this.currentStep === 1) return;

    const currentQuestion = document.getElementById(`q${this.currentStep}`);
    currentQuestion.style.display = 'none';

    this.currentStep--;
    
    const prevQuestion = document.getElementById(`q${this.currentStep}`);
    prevQuestion.style.display = 'block';

    this.updateProgress();
  }

  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepEl = document.getElementById('currentStep');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const percentage = (this.currentStep / this.totalSteps) * 100;
    progressFill.style.width = percentage + '%';
    currentStepEl.textContent = this.currentStep;

    prevBtn.style.display = this.currentStep === 1 ? 'none' : 'flex';
    nextBtn.textContent = this.currentStep === this.totalSteps ? 'Reveal My Insight' : 'Continue';
  }

  // Helper to normalize next_action into a proper array
  normalizeNextAction(nextAction) {
    if (!nextAction) return [];
    if (Array.isArray(nextAction)) return nextAction;
    if (typeof nextAction === 'string') {
      return nextAction
        .split(/\n|,/) // split by newline or comma
        .map(a => a.trim())
        .filter(a => a.length > 0);
    }
    return [];
  }

 submitAssessment() {
  const assessmentData = {
    timestamp: new Date().toISOString(),
    answers: this.answers
  };

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = '✓ Processing...';
  nextBtn.disabled = true;

  this.sendToMake(assessmentData);
}

sendToMake(assessmentData) {
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(assessmentData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(result => {
    console.log("Success:", result);

    // Save result for results page
    localStorage.setItem("assessmentResult", JSON.stringify(result));

    window.location.href = "results.html";
  })
  .catch(error => {
    console.error("Error sending to Make:", error);

    alert("Something went wrong. Please try again.");
  });
}

}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AssessmentForm();
});
