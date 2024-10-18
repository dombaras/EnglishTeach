document.addEventListener('DOMContentLoaded', () => {
    const englishSentence = document.getElementById('english-sentence');
    const hebrewTranslation = document.getElementById('hebrew-translation');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const story = [
        { english: "Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin.", hebrew: "הנה דובי אדוארד, יורד במדרגות עכשיו, באמפ, באמפ, באמפ, על גב ראשו, מאחורי כריסטופר רובין." },
        { english: "It is, as far as he knows, the only way of coming downstairs, but sometimes he feels that there really is another way, if only he could stop bumping for a moment and think of it.", hebrew: "זו, ככל הידוע לו, הדרך היחידה לרדת במדרגות, אבל לפעמים הוא מרגיש שיש באמת דרך אחרת, אם רק היה יכול להפסיק להתנגש לרגע ולחשוב על זה." },
        { english: "And then he feels that perhaps there isn't.", hebrew: "ואז הוא מרגיש שאולי אין." }
    ];

    let currentSentence = 0;
    let sentencesRead = 0;

    function updateSentence() {
        englishSentence.textContent = story[currentSentence].english;
        hebrewTranslation.textContent = story[currentSentence].hebrew;
        prevBtn.disabled = currentSentence === 0;
        nextBtn.disabled = currentSentence === story.length - 1;
        
        if (currentSentence > sentencesRead) {
            sentencesRead = currentSentence;
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentSentence > 0) {
            currentSentence--;
            updateSentence();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSentence < story.length - 1) {
            currentSentence++;
            updateSentence();
        } else {
            // Store the number of sentences read in localStorage
            localStorage.setItem('sentencesRead', sentencesRead + 1);
            window.location.href = '/story-summary';
        }
    });

    updateSentence();
});
