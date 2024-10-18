document.addEventListener('DOMContentLoaded', () => {
    let readStoryBtn = document.getElementById('read-story-btn');

    if (readStoryBtn) {
        readStoryBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '/story-intro';
        });
    } else {
        console.error('Read a Story button not found');
    }
});

// Log any errors that occur
window.addEventListener('error', (event) => {
    console.error('An error occurred:', event.error);
});
