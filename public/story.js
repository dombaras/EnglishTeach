document.addEventListener('DOMContentLoaded', () => {
    const startReadingBtn = document.getElementById('start-reading');
    startReadingBtn.addEventListener('click', () => {
        window.location.href = '/read-story';
    });
});
