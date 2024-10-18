document.addEventListener('DOMContentLoaded', () => {
    const storyContent = document.getElementById('story-content');
    const hebrewTranslation = document.getElementById('hebrew-translation');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const toggleTranslationBtn = document.getElementById('toggle-translation-btn');
    const backToIntroBtn = document.getElementById('back-to-intro');
    let storyPairs = [];
    let currentSentence = 0;

    // Fetch and process the story
    fetch('/stories/three-little-pigs.txt')
        .then(response => response.text())
        .then(storyText => {
            // Split the story into sentence pairs (English and Hebrew)
            const sentences = storyText.split('\n').filter(line => line.trim() !== '');
            for (let i = 2; i < sentences.length; i += 2) {  // Start from index 2 to skip the title
                storyPairs.push({
                    english: sentences[i],
                    hebrew: sentences[i + 1] || ''  // In case of odd number of sentences
                });
            }
            displaySentence();
        })
        .catch(error => {
            console.error('Error loading story:', error);
            storyContent.innerText = 'Error loading story. Please try again later.';
        });

    // Display current sentence
    function displaySentence() {
        storyContent.innerText = storyPairs[currentSentence].english;
        hebrewTranslation.innerText = storyPairs[currentSentence].hebrew;
        // Hide Hebrew translation when displaying a new sentence
        hebrewTranslation.style.display = 'none';
        updateButtons();
    }

    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentSentence === 0;
        nextBtn.disabled = currentSentence === storyPairs.length - 1;
    }

    // Event listeners for navigation
    prevBtn.addEventListener('click', () => {
        if (currentSentence > 0) {
            currentSentence--;
            displaySentence();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSentence < storyPairs.length - 1) {
            currentSentence++;
            displaySentence();
        }
    });

    toggleTranslationBtn.addEventListener('click', () => {
        if (hebrewTranslation.style.display === 'none') {
            hebrewTranslation.style.display = 'block';
        } else {
            hebrewTranslation.style.display = 'none';
        }
    });

    backToIntroBtn.addEventListener('click', () => {
        window.location.href = '/story-intro.html';
    });
});
