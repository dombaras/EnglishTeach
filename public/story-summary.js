document.addEventListener('DOMContentLoaded', () => {
    console.log('Story summary page loaded');

    // Retrieve statistics from localStorage
    const readingTime = localStorage.getItem('readingTime');
    const translationShownCount = localStorage.getItem('translationShownCount');
    const totalSentences = localStorage.getItem('totalSentences');
    const sentencesRead = localStorage.getItem('sentencesRead') || totalSentences; // Assume all sentences were read if not explicitly tracked

    console.log('Retrieved from localStorage:', { readingTime, translationShownCount, totalSentences, sentencesRead });

    // Get DOM elements
    const readingTimeElement = document.getElementById('reading-time');
    const translationsShownElement = document.getElementById('translations-shown');
    const translationPercentageElement = document.getElementById('translation-percentage');
    const sentencesReadElement = document.getElementById('sentences-read');
    const backToHomeBtn = document.getElementById('back-to-home');

    // Display reading time
    if (readingTimeElement && readingTime) {
        readingTimeElement.textContent = formatTime(parseInt(readingTime));
    }

    // Display translations shown count
    if (translationsShownElement && translationShownCount) {
        translationsShownElement.textContent = translationShownCount;
    }

    // Display translation percentage
    if (translationPercentageElement && translationShownCount && totalSentences) {
        const percentage = calculatePercentage(parseInt(translationShownCount), parseInt(totalSentences));
        translationPercentageElement.textContent = percentage + '%';
    }

    // Display sentences read
    if (sentencesReadElement && sentencesRead) {
        sentencesReadElement.textContent = sentencesRead;
    }

    // Helper function to format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }

    // Helper function to calculate percentage
    function calculatePercentage(part, whole) {
        return Math.round((part / whole) * 100);
    }

    // Event listener for back to home button
    backToHomeBtn.addEventListener('click', () => {
        // Clear all relevant items from localStorage
        localStorage.removeItem('readingTime');
        localStorage.removeItem('translationShownCount');
        localStorage.removeItem('totalSentences');
        localStorage.removeItem('sentencesRead');
        console.log('Cleared localStorage');
        window.location.href = '/';
    });
});
