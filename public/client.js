const audioInput = document.getElementById('audioInput');
const transcribeBtn = document.getElementById('transcribeBtn');
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const transcriptionOutput = document.getElementById('transcriptionOutput');
const statusDiv = document.getElementById('status');
const copyBtn = document.getElementById('copyBtn');
const fileLabel = document.querySelector('.custom-file-upload');

let mediaRecorder;
let audioChunks = [];

// Update file label when selected
audioInput.addEventListener('change', () => {
    if (audioInput.files.length > 0) {
        fileLabel.textContent = audioInput.files[0].name;
        fileLabel.style.borderColor = 'var(--primary)';
        fileLabel.style.color = 'var(--text)';
    }
});

// File Upload Logic
transcribeBtn.addEventListener('click', async () => {
    const file = audioInput.files[0];
    if (!file) {
        updateStatus('Please select an audio file first.', 'var(--danger)');
        return;
    }
    await sendAudio(file);
});

// Recording Logic
recordBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            // Create a File object from the Blob
            const file = new File([audioBlob], "recording.webm", { type: 'audio/webm' });
            console.log('file', file)
            await sendAudio(file);
            
            // Stop all tracks to release the microphone
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        recordBtn.disabled = true;
        stopBtn.disabled = false;
        transcribeBtn.disabled = true;
        updateStatus('Recording...', 'var(--danger)');
    } catch (error) {
        console.error('Error accessing microphone:', error);
        updateStatus('Error accessing microphone. Please allow permissions.', 'var(--danger)');
    }
});

stopBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        recordBtn.disabled = false;
        stopBtn.disabled = true;
        transcribeBtn.disabled = false;
        updateStatus('Processing recording...', 'var(--primary)');
    }
});

// Copy Logic
copyBtn.addEventListener('click', () => {
    transcriptionOutput.select();
    document.execCommand('copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = originalText, 2000);
});

function updateStatus(text, color) {
    statusDiv.textContent = text;
    statusDiv.style.color = color || 'var(--text-muted)';
}

async function sendAudio(file) {
    const formData = new FormData();
    formData.append('audio', file);

    transcribeBtn.disabled = true;
    recordBtn.disabled = true;
    updateStatus('Transcribing...', 'var(--primary)');
    transcriptionOutput.value = '';
    console.log('formData', formData)

    try {
        // Updated URL to match smart-odsc-ai route pattern
        const response = await fetch('/api/v1/speech/transcribe', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'error') {
            throw new Error(result.message || 'Unknown error');
        }

        // Handle the smart-odsc-ai response format
        const transcription = result.data.transcription;
        transcriptionOutput.value = transcription;
        updateStatus('Done!', 'var(--success)');
    } catch (error) {
        console.error('Error:', error);
        updateStatus(`Error: ${error.message}`, 'var(--danger)');
    } finally {
        transcribeBtn.disabled = false;
        recordBtn.disabled = false;
    }
}
