// Results Page Logic — Clean Version

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
    this.displayCoreIssue();
    this.displayRecommendations();
    this.displayReflectionQuestion();
    this.setupButtons();
  }

  displayStage() {
    const stage = this.data.ai?.stage || this.data.assessment?.stage || 'Unknown Stage';
    document.getElementById('stageName').textContent = stage;
  }

  displayCoreIssue() {
    const coreIssue = this.data.ai?.core_issue || this.data.assessment?.answers?.stuck || 'No core issue provided';
    const stageDescription = document.getElementById('stageDescription');
    stageDescription.textContent = coreIssue;
  }

  displayRecommendations() {
    const ai = this.data.ai;
    const container = document.getElementById('recommendationsContainer');

    if (!ai || !ai.next_action) {
      container.innerHTML = '<p>No recommendations available.</p>';
      return;
    }

    // Ensure next_action is an array of strings
    let nextActions = ai.next_action;
    if (!Array.isArray(nextActions)) {
      nextActions = [String(nextActions)];
    }

    container.innerHTML = nextActions
      .map((action, index) => `
        <div class="recommendation-item">
          <div class="recommendation-title">${index + 1}. Action Step</div>
          <p class="recommendation-text">${action}</p>
        </div>
      `)
      .join('');
  }

  displayReflectionQuestion() {
    const reflectionQuestion = this.data.ai?.reflection_question || 'No reflection question provided';
    
    // Create a new section for reflection question
    const container = document.getElementById('recommendationsContainer');
    const reflectionHTML = `
      <div class="recommendation-item">
        <div class="recommendation-title">Reflection Question</div>
        <p class="recommendation-text">${reflectionQuestion}</p>
      </div>
    `;
    container.innerHTML += reflectionHTML;
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
    const reportElement = document.getElementById("reportContent");
    const downloadBtn = document.getElementById("downloadBtn");
    const originalText = downloadBtn.textContent;

    // Show loading state on button
    downloadBtn.textContent = "Generating PDF...";
    downloadBtn.disabled = true;

    // Use html2canvas to capture the visual output
    html2canvas(reportElement, { 
        scale: 2,           // Higher scale for better quality
        useCORS: true,      // Helps with loading external fonts/images if any
        backgroundColor: "#0a192f" // Fallback background color to ensure text is visible
    }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        // Add a tiny bit of margin by adjusting width
        const imgWidth = pageWidth - 10; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // X, Y coordinates: 5mm margin on the sides, 10mm from top
        pdf.addImage(imgData, "PNG", 5, 10, imgWidth, imgHeight);

        pdf.save("MAXIMIZE_Insight_Report.pdf");

        // Restore button state
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
    }).catch(error => {
        console.error("Error generating PDF:", error);
        downloadBtn.textContent = "Error generating PDF";
        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }, 3000);
    });
  }

  showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ResultsPage();
});