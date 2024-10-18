document.addEventListener('DOMContentLoaded', () => {
    let beginBtn = document.getElementById('begin-btn');

    if (beginBtn) {
        beginBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '/read-story';
        });
    } else {
        console.error('Begin button not found');
    }
});
