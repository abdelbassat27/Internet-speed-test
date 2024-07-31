// scripts.js

let testInProgress = false;

document.getElementById('startTest').addEventListener('click', async function() {
    if (testInProgress) return;

    testInProgress = true;
    document.getElementById('startTest').disabled = true;
    document.getElementById('stopTest').disabled = false;

    const downloadSpeedElem = document.getElementById('downloadSpeed');
    const uploadSpeedElem = document.getElementById('uploadSpeed');
    const pingElem = document.getElementById('ping');

    // Function to measure download speed using a test image
    async function measureDownloadSpeed() {
        const imageUrl = 'https://picsum.photos/2000'; // Use a reliable test image
        const image = new Image();
        const startTime = performance.now();

        return new Promise((resolve, reject) => {
            image.onload = () => {
                const endTime = performance.now();
                const duration = (endTime - startTime) / 1000; // seconds
                const bitsLoaded = 2000 * 2000 * 8; // Assuming a 2000x2000 image, each pixel is 8 bits
                const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
                resolve(speedMbps);
            };

            image.onerror = () => {
                reject('Error loading image.');
            };

            image.src = `${imageUrl}?t=${new Date().getTime()}`; // Cache-busting
        });
    }

    // Function to measure ping using a small test image
    async function measurePing() {
        const startTime = performance.now();
        try {
            await fetch('https://picsum.photos/2000', { mode: 'no-cors' });
        } catch (error) {
            console.error('Error fetching ping image:', error);
        }
        const endTime = performance.now();
        const pingMs = (endTime - startTime).toFixed(2);
        return pingMs;
    }

    // Function to measure upload speed (simulation)
    async function measureUploadSpeed() {
        const startTime = performance.now();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // seconds
        const uploadSpeedMbps = (5 / duration).toFixed(2); // Simulated upload speed (5 MB for example)
        return uploadSpeedMbps;
    }

    try {
        // Measure download speed
        const downloadSpeed = await measureDownloadSpeed();
        downloadSpeedElem.textContent = `${downloadSpeed} Mbps`;
    } catch (error) {
        console.error('Error measuring download speed:', error);
        downloadSpeedElem.textContent = 'Error';
    }

    try {
        // Measure ping
        const ping = await measurePing();
        pingElem.textContent = `${ping} ms`;
    } catch (error) {
        console.error('Error measuring ping:', error);
        pingElem.textContent = 'Error';
    }

    try {
        // Measure upload speed
        const uploadSpeed = await measureUploadSpeed();
        uploadSpeedElem.textContent = `${uploadSpeed} Mbps`;
    } catch (error) {
        console.error('Error measuring upload speed:', error);
        uploadSpeedElem.textContent = 'Error';
    }

    testInProgress = false;
    document.getElementById('startTest').disabled = false;
    document.getElementById('stopTest').disabled = true;
});

document.getElementById('stopTest').addEventListener('click', function() {
    // Reset values
    document.getElementById('downloadSpeed').textContent = '0';
    document.getElementById('uploadSpeed').textContent = '0';
    document.getElementById('ping').textContent = '0';

    // Stop the test
    testInProgress = false;
    document.getElementById('startTest').disabled = false;
    document.getElementById('stopTest').disabled = true;
});

// Function to copy text to clipboard and show confirmation
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('نسخ إلى الحافظة');
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}

// Adding click event listeners to copy speeds
document.getElementById('downloadSpeed').addEventListener('click', function() {
    copyToClipboard(this.textContent);
});

document.getElementById('uploadSpeed').addEventListener('click', function() {
    copyToClipboard(this.textContent);
});

document.getElementById('ping').addEventListener('click', function() {
    copyToClipboard(this.textContent);
});
