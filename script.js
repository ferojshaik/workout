class JumpRopeTracker {
    constructor() {
        // Initialize variables
        this.jumpCount = this.loadSavedData('jumpCount', 0);
        this.totalSeconds = this.loadSavedData('totalSeconds', 0);
        this.isRunning = false;
        this.startTime = null;
        this.timer = null;
        
        // Get DOM elements
        this.jumpCountDisplay = document.getElementById('count');
        this.totalTimeDisplay = document.getElementById('totalTime');
        this.timerDisplay = document.getElementById('timer');
        this.speedDisplay = document.getElementById('speed');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Input elements
        this.jumpInput = document.getElementById('jumpInput');
        this.timeInput = document.getElementById('timeInput');
        this.addJumpsBtn = document.getElementById('addJumpsBtn');
        this.decreaseJumpsBtn = document.getElementById('decreaseJumpsBtn');
        this.addTimeBtn = document.getElementById('addTimeBtn');
        this.decreaseTimeBtn = document.getElementById('decreaseTimeBtn');
        
        // Initialize displays
        this.updateDisplays();
        this.stopBtn.disabled = true;
        
        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startBtn.onclick = () => this.start();
        this.stopBtn.onclick = () => this.stop();
        this.resetBtn.onclick = () => this.reset();
        
        this.addJumpsBtn.onclick = () => this.modifyJumps(1);
        this.decreaseJumpsBtn.onclick = () => this.modifyJumps(-1);
        this.addTimeBtn.onclick = () => this.modifyTime(1);
        this.decreaseTimeBtn.onclick = () => this.modifyTime(-1);
        
        // Input validation
        [this.jumpInput, this.timeInput].forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        });
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    loadSavedData(key, defaultValue) {
        const saved = localStorage.getItem(key);
        return saved ? parseInt(saved) : defaultValue;
    }

    saveData() {
        localStorage.setItem('jumpCount', this.jumpCount.toString());
        localStorage.setItem('totalSeconds', this.totalSeconds.toString());
    }

    modifyJumps(multiplier) {
        const jumps = parseInt(this.jumpInput.value);
        if (isNaN(jumps) || jumps < 0) {
            alert('Please enter a valid number of jumps');
            return;
        }

        const newCount = this.jumpCount + (jumps * multiplier);
        if (newCount < 0) {
            alert('Jump count cannot be negative');
            return;
        }

        this.jumpCount = newCount;
        this.updateDisplays();
        this.jumpInput.value = '';
    }

    modifyTime(multiplier) {
        const minutes = parseInt(this.timeInput.value);
        if (isNaN(minutes) || minutes < 0) {
            alert('Please enter a valid number of minutes');
            return;
        }

        const newSeconds = this.totalSeconds + (minutes * 60 * multiplier);
        if (newSeconds < 0) {
            alert('Total time cannot be negative');
            return;
        }

        this.totalSeconds = newSeconds;
        this.updateDisplays();
        this.timeInput.value = '';
    }

    updateDisplays() {
        this.jumpCountDisplay.textContent = this.jumpCount;
        this.totalTimeDisplay.textContent = this.formatTime(this.totalSeconds);
        this.calculateSpeed();
        this.saveData();
    }

    start() {
        this.isRunning = true;
        this.startTime = Date.now() - (this.totalSeconds * 1000);
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.startTimer();
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
            clearInterval(this.timer);
            
            // Update total seconds from timer
            const currentSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            this.totalSeconds = currentSeconds;
            this.updateDisplays();
        }
    }

    reset() {
        if (confirm('Are you sure you want to reset? This will clear all saved data.')) {
            this.stop();
            this.jumpCount = 0;
            this.totalSeconds = 0;
            this.startTime = null;
            this.timerDisplay.textContent = '00:00';
            this.speedDisplay.textContent = '0';
            this.jumpInput.value = '';
            this.timeInput.value = '';
            localStorage.clear();
            this.updateDisplays();
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            const currentSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerDisplay.textContent = this.formatTime(currentSeconds);
            this.totalTimeDisplay.textContent = this.formatTime(currentSeconds);
            this.calculateSpeed();
        }, 1000);
    }

    calculateSpeed() {
        if (this.totalSeconds > 0) {
            // Simple division: total jumps divided by total minutes
            const totalMinutes = this.totalSeconds / 60;
            const averageSpeed = Math.round(this.jumpCount / totalMinutes);
            this.speedDisplay.textContent = averageSpeed;
        } else {
            this.speedDisplay.textContent = '0';
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const tracker = new JumpRopeTracker();
}); 