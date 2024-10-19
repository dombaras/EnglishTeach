document.addEventListener('DOMContentLoaded', () => {
    const storyContent = document.getElementById('story-content');
    const hebrewTranslation = document.getElementById('hebrew-translation');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const toggleTranslationBtn = document.getElementById('toggle-translation-btn');
    const goToSummaryBtn = document.getElementById('go-to-summary-btn');
    const backToIntroBtn = document.getElementById('back-to-intro');
    const readAloudBtn = document.getElementById('read-aloud-btn');
    const feedbackArea = document.getElementById('feedback-area');
    const feedbackContent = document.getElementById('feedbackContent');
    const closeFeedback = document.getElementById('closeFeedback');

    if (!storyContent || !hebrewTranslation || !prevBtn || !nextBtn || !toggleTranslationBtn || !goToSummaryBtn || !backToIntroBtn || !readAloudBtn || !feedbackArea || !feedbackContent || !closeFeedback) {
        console.error('One or more required elements are missing from the DOM');
        return;
    }
    let storyPairs = [];
    let currentSentence = 0;
    let startTime = Date.now();

    // Initialize fresh statistics for each session
    let statistics = {
        totalSentences: 0,
        sentencesRead: 0,
        translationShownCount: 0,
        readingTime: 0
    };

    console.log('Initial statistics:', statistics);

    function showFeedback() {
        feedbackArea.classList.remove('hidden');
    }

    function hideFeedback() {
        feedbackArea.classList.add('hidden');
    }

    function compareWords(spoken, expected) {
        const spokenWords = spoken.split(' ');
        const expectedWords = expected.split(' ');
        let result = '';
        let spokenIndex = 0;
        let expectedIndex = 0;
    
        while (expectedIndex < expectedWords.length) {
            if (spokenIndex >= spokenWords.length) {
                // We've run out of spoken words, mark the rest as incorrect
                result += `<span class="incorrect-word">${expectedWords[expectedIndex]}</span> `;
                expectedIndex++;
            } else if (spokenWords[spokenIndex] === expectedWords[expectedIndex]) {
                // Words match, mark as correct
                result += `<span class="correct-word">${spokenWords[spokenIndex]}</span> `;
                spokenIndex++;
                expectedIndex++;
            } else {
                // Words don't match, check if it's an extra or missing word
                const nextMatchIndex = expectedWords.indexOf(spokenWords[spokenIndex], expectedIndex);
                if (nextMatchIndex !== -1) {
                    // It's a missing word(s), mark them as incorrect
                    while (expectedIndex < nextMatchIndex) {
                        result += `<span class="incorrect-word">${expectedWords[expectedIndex]}</span> `;
                        expectedIndex++;
                    }
                } else {
                    // It's an extra word, ignore it
                    spokenIndex++;
                }
            }
        }
    
        return result.trim();
    }

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
            statistics.totalSentences = storyPairs.length;
            console.log('Story loaded, statistics:', statistics);
            saveStatistics();
            displaySentence();
            // Hide the "Go to Summary" button initially
            goToSummaryBtn.classList.add('hidden');
        })
        .catch(error => {
            console.error('Error loading story:', error);
            storyContent.innerText = 'Error loading story. Please try again later.';
        });

    let recognition;
    let recognitionTimer;
    let pauseTimer;
    const MAX_RECOGNITION_TIME = 30000; // 30 seconds
    const RECOGNITION_PAUSE = 1500; // 1.5 seconds pause to consider speech final
    let isListening = false;
    let finalTranscript = '';
    let interimTranscript = '';
    
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
    } else {
        console.error('Speech recognition not supported');
        readAloudBtn.disabled = true;
    }
    
    readAloudBtn.addEventListener('click', toggleRecognition);
    
    function toggleRecognition() {
        if (!isListening) {
            startRecognition();
        } else {
            stopRecognition();
        }
    }
    
    function startRecognition() {
        if (recognition) {
            isListening = true;
            readAloudBtn.textContent = 'Stop Listening';
            finalTranscript = '';
            interimTranscript = '';
            recognition.start();
    
            recognitionTimer = setTimeout(() => {
                stopRecognition();
            }, MAX_RECOGNITION_TIME);
        }
    }
    
    function stopRecognition() {
        clearTimeout(recognitionTimer);
        clearTimeout(pauseTimer);
        isListening = false;
        recognition.stop();
        readAloudBtn.textContent = 'Read Aloud';
        processFinalResult();
    }
    
    function processFinalResult() {
        const spokenText = (finalTranscript + interimTranscript).toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const expectedText = storyPairs[currentSentence].english.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        
        console.log('Final spoken text:', spokenText);
        console.log('Expected text:', expectedText);
        
        const comparisonResult = compareWords(spokenText, expectedText);
        
        feedbackContent.innerHTML = comparisonResult;
        showFeedback();
    
        finalTranscript = '';
        interimTranscript = '';
    }
    
    recognition.onresult = (event) => {
        clearTimeout(pauseTimer);
    
        interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
    
        console.log('Interim transcript:', interimTranscript);
    
        pauseTimer = setTimeout(() => {
            if (finalTranscript || interimTranscript) {
                stopRecognition();
            }
        }, RECOGNITION_PAUSE);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        stopRecognition();
    };
    
    recognition.onend = () => {
        if (isListening) {
            recognition.start();
        }
    };
        
    // Display current sentence
    function displaySentence() {
        const words = storyPairs[currentSentence].english.split(' ');
        const hebrewWords = storyPairs[currentSentence].hebrew.split(' ');
        const wrappedWords = words.map((word, index) => 
            `<span class="hoverable-word" data-translation="${hebrewWords[index] || ''}">${word}</span>`
        );
        storyContent.innerHTML = `
            <div class="sentence-container">
                <div class="english-container">
                    <span class="sentence-text">${wrappedWords.join(' ')}</span>
                    <button class="speak-sentence-btn" aria-label="Speak sentence">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <p id="hebrew-translation" class="hebrew-translation hidden">${storyPairs[currentSentence].hebrew}</p>
            </div>
        `;
    console.log('Current Hebrew text:', storyPairs[currentSentence].hebrew); // Debug log

        //hideFeedback();
        updateButtons();
        statistics.sentencesRead = Math.max(statistics.sentencesRead, currentSentence + 1);
        saveStatistics();
    
        // Add event listeners to the words
        document.querySelectorAll('.hoverable-word').forEach(wordSpan => {
            wordSpan.addEventListener('mouseenter', showTranslation);
            wordSpan.addEventListener('mouseenter', speakWord);
        });

        const speakButton = document.querySelector('.speak-sentence-btn');
        if (speakButton) {
            speakButton.addEventListener('click', speakSentence);
        }
    }

    function speakWord(event) {
        const word = event.target.textContent;
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US'; // Set the language
        speechSynthesis.speak(utterance);
    }

    function stopSpeech() {
        speechSynthesis.cancel();
    }

    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentSentence === 0;
        nextBtn.disabled = currentSentence === storyPairs.length - 1;
        if (currentSentence === storyPairs.length - 1) {
            goToSummaryBtn.classList.remove('hidden');
        } else {
            goToSummaryBtn.classList.add('hidden');
        }
    }

    // Save statistics
    function saveStatistics() {
        const currentTime = Date.now();
        statistics.readingTime += (currentTime - startTime) / 1000; // Convert to seconds
        startTime = currentTime; // Reset start time
        localStorage.setItem('storyStatistics', JSON.stringify(statistics));
        console.log('Saved statistics:', JSON.parse(JSON.stringify(statistics))); // Deep copy for logging
    }

    function speakSentence() {
        const sentence = storyPairs[currentSentence].english;
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'en-US';
        utterance.rate = 0.7;
        
        const speakBtn = document.querySelector('.speak-sentence-btn');
        speakBtn.disabled = true;
        speakBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        utterance.onend = () => {
            speakBtn.disabled = false;
            speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        };
        
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }

    function showTranslation(event) {
        const word = event.target;
        const translation = word.dataset.translation;
        
        if (!translation) return;
    
        const bubble = document.createElement('div');
        bubble.className = 'translation-bubble';
        bubble.textContent = translation;
        
        // Position the bubble
        const rect = word.getBoundingClientRect();
        bubble.style.left = `${rect.left}px`;
        bubble.style.top = `${rect.bottom + window.scrollY}px`;
    
        document.body.appendChild(bubble);
    
        word.addEventListener('mouseleave', () => {
            document.body.removeChild(bubble);
        }, { once: true });
    }

    // Event listeners for navigation
    prevBtn.addEventListener('click', () => {
        if (currentSentence > 0) {
            stopSpeech();
            currentSentence--;
            displaySentence();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSentence < storyPairs.length - 1) {
            stopSpeech();
            currentSentence++;
            displaySentence();
        }
    });

    toggleTranslationBtn.addEventListener('click', () => {
        const hebrewTranslation = document.getElementById('hebrew-translation');
        if (hebrewTranslation) {
            hebrewTranslation.classList.toggle('hidden');
            if (!hebrewTranslation.classList.contains('hidden')) {
                statistics.translationShownCount = (statistics.translationShownCount || 0) + 1;
                saveStatistics();
            }
            console.log('Hebrew translation visibility:', !hebrewTranslation.classList.contains('hidden')); // Debug log
        } else {
            console.error('Hebrew translation element not found');
        }
    });

    goToSummaryBtn.addEventListener('click', () => {
        saveStatistics();
        window.location.href = '/story-summary.html';
    });

    backToIntroBtn.addEventListener('click', () => {
        saveStatistics();
        window.location.href = '/story-intro.html';
    });

    // Save statistics when leaving the page
    window.addEventListener('beforeunload', saveStatistics);

    closeFeedback.addEventListener('click', hideFeedback);

    // Ensure the feedback is hidden initially
    hideFeedback();
});
