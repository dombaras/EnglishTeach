document.addEventListener('DOMContentLoaded', () => {
    const backToHomeBtn = document.getElementById('back-to-home');
    const sentencesReadSpan = document.getElementById('sentences-read');
    
    // Retrieve the number of sentences read from localStorage
    const sentencesRead = localStorage.getItem('sentencesRead') || 0;
    sentencesReadSpan.textContent = sentencesRead;
    
    backToHomeBtn.addEventListener('click', () => {
        // Clear the localStorage when going back to home
        localStorage.removeItem('sentencesRead');
        window.location.href = '/';
    });
});
