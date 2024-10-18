document.addEventListener('DOMContentLoaded', () => {
    const startReadingBtn = document.getElementById('start-reading');
    startReadingBtn.addEventListener('click', () => {
        console.log('Read a Story button clicked');
        window.location.href = '/story';
    });
});
