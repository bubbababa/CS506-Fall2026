document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const sampleDataBtn = document.getElementById('sample-data-btn');
    const resultsSection = document.getElementById('results-section');
    
    // Timer functionality
    const startTimerBtn = document.getElementById('start-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const timerSeconds = document.getElementById('timer-seconds');
    const timerStatus = document.getElementById('timer-status');
    
    let timerInterval;
    let timeLeft = 10;
    let isRunning = false;



    // Timer event listeners
    startTimerBtn.addEventListener('click', function() {
        if (!isRunning) {
            startTimer();
        }
    });
    
    resetTimerBtn.addEventListener('click', function() {
        resetTimer();
    });
    
    // Timer functions
    function startTimer() {
        isRunning = true;
        startTimerBtn.disabled = true;
        startTimerBtn.textContent = 'Running...';
        timerStatus.textContent = 'Timer running - count your heart beats/breaths!';
        timerStatus.className = 'timer-status timer-running';
        
        timerInterval = setInterval(function() {
            timeLeft--;
            timerSeconds.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerFinished();
            }
        }, 1000);
    }
    
    function resetTimer() {
        clearInterval(timerInterval);
        timeLeft = 10;
        isRunning = false;
        timerSeconds.textContent = timeLeft;
        startTimerBtn.disabled = false;
        startTimerBtn.textContent = 'Start Timer';
        timerStatus.textContent = 'Ready to start';
        timerStatus.className = 'timer-status';
    }
    
    function timerFinished() {
        isRunning = false;
        startTimerBtn.disabled = false;
        startTimerBtn.textContent = 'Start Timer';
        timerStatus.textContent = 'Time\'s up! Record your count.';
        timerStatus.className = 'timer-status timer-finished';
        
        // Play a sound or show a notification
        showNotification('Timer finished! Record your heart beats and breaths.', 'success');
        
        // Auto-reset after 3 seconds
        setTimeout(function() {
            resetTimer();
        }, 3000);
    }

    // Generate random data
    sampleDataBtn.addEventListener('click', function() {
        generateRandomData();
        showNotification('Random data generated! Each attribute uses a different realistic distribution.', 'success');
    });

    // Random data generation functions
    function generateRandomData() {
        const beforeData = generateRandomDataset('before');
        const afterData = generateRandomDataset('after');
        
        // Load the generated data into the form
        loadGeneratedData(beforeData, afterData);
    }

    function generateRandomDataset(type) {
        const data = {};
        
        // Define realistic distributions for each attribute
        const distributions = {
            heart_beats: { mean: 12.5, std: 1.2, min: 8, max: 18 },    // Normal heart rate variation
            breaths: { mean: 3.0, std: 0.4, min: 2, max: 5 },          // Normal breathing rate
            happiness: { mean: 6.5, std: 1.5, min: 1, max: 10 },       // Happiness scale
            confidence: { mean: 6.0, std: 1.8, min: 1, max: 10 },      // Confidence scale
            focus: { mean: 7.0, std: 1.3, min: 1, max: 10 },           // Focus scale
            comfort: { mean: 6.8, std: 1.2, min: 1, max: 10 }          // Comfort scale
        };

        // Generate data for each student
        for (let student = 1; student <= 5; student++) {
            Object.keys(distributions).forEach(attr => {
                const dist = distributions[attr];
                let value;
                
                // Generate value from normal distribution with bounds
                do {
                    value = generateNormalRandom(dist.mean, dist.std);
                } while (value < dist.min || value > dist.max);
                
                // Round to appropriate decimal places
                if (attr === 'heart_beats' || attr === 'breaths') {
                    value = Math.round(value * 10) / 10; // 1 decimal place
                } else {
                    value = Math.round(value * 10) / 10; // 1 decimal place for consistency
                }
                
                data[`student_${student}_${attr}`] = value;
            });
        }
        
        return data;
    }

    function generateNormalRandom(mean, std) {
        // Box-Muller transform to generate normal distribution
        let u1 = 0, u2 = 0;
        do {
            u1 = Math.random();
            u2 = Math.random();
        } while (u1 === 0);
        
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return mean + z0 * std;
    }

    function loadGeneratedData(beforeData, afterData) {
        // Load before data
        Object.keys(beforeData).forEach(key => {
            const input = document.getElementById(key + '_before');
            if (input) {
                input.value = beforeData[key];
            }
        });

        // Load after data (with slight variations from before)
        Object.keys(afterData).forEach(key => {
            const input = document.getElementById(key + '_after');
            if (input) {
                // Add small random variation to create realistic "change"
                const baseValue = afterData[key];
                const variation = (Math.random() - 0.5) * 0.8; // ±0.4 variation
                let newValue = baseValue + variation;
                
                // Ensure bounds are respected
                const attr = key.split('_').pop();
                if (attr === 'heart_beats' || attr === 'breaths') {
                    newValue = Math.max(0, Math.min(20, newValue));
                } else {
                    newValue = Math.max(1, Math.min(10, newValue));
                }
                
                input.value = Math.round(newValue * 10) / 10;
            }
        });
    }

    // Analyze results
    analyzeBtn.addEventListener('click', function() {
        const data = collectData();
        if (validateData(data)) {
            analyzeData(data);
        } else {
            showNotification('Please fill in all fields before analyzing.', 'error');
        }
    });



    function collectData() {
        const before = {};
        const after = {};

        // Collect before data
        for (let i = 1; i <= 5; i++) {
            const attributes = ['heart_beats', 'breaths', 'happiness', 'confidence', 'focus', 'comfort'];
            attributes.forEach(attr => {
                const input = document.getElementById(`student_${i}_${attr}_before`);
                if (input) {
                    before[`student_${i}_${attr}`] = input.value;
                }
            });
        }

        // Collect after data
        for (let i = 1; i <= 5; i++) {
            const attributes = ['heart_beats', 'breaths', 'happiness', 'confidence', 'focus', 'comfort'];
            attributes.forEach(attr => {
                const input = document.getElementById(`student_${i}_${attr}_after`);
                if (input) {
                    after[`student_${i}_${attr}`] = input.value;
                }
            });
        }

        return { before, after };
    }

    function validateData(data) {
        const beforeValues = Object.values(data.before);
        const afterValues = Object.values(data.after);
        
        return beforeValues.every(val => val !== '') && afterValues.every(val => val !== '');
    }

    function analyzeData(data) {
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = '🔬 Analyzing...';

        fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            displayResults(result);
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            showNotification('Analysis complete! Check the results below.', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred during analysis. Please try again.', 'error');
        })
        .finally(() => {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = '🔬 Analyze Results';
        });
    }

    function displayResults(result) {
        // Update summary stats
        document.getElementById('total-tests').textContent = result.total_tests;
        document.getElementById('significant-count').textContent = result.significant_count;
        
        const falsePositiveRate = ((result.significant_count / result.total_tests) * 100).toFixed(1);
        document.getElementById('false-positive-rate').textContent = falsePositiveRate + '%';

        // Update results table
        const tbody = document.getElementById('results-tbody');
        tbody.innerHTML = '';

        result.results.forEach(row => {
            const tr = document.createElement('tr');
            const isSignificant = Boolean(row.is_significant); // Convert int back to boolean
            tr.className = isSignificant ? 'significant-result' : 'non-significant-result';
            
            tr.innerHTML = `
                <td><strong>${row.attribute}</strong></td>
                <td>${row.before_mean}</td>
                <td>${row.after_mean}</td>
                <td>${row.mean_change > 0 ? '+' : ''}${row.mean_change}</td>
                <td>${row.p_value}</td>
                <td>${isSignificant ? '✅ Yes' : '❌ No'}</td>
            `;
            
            tbody.appendChild(tr);
        });

        // Update significant count styling
        const significantCard = document.querySelector('.stat-card.significant');
        if (result.significant_count > 0) {
            significantCard.style.display = 'block';
        } else {
            significantCard.style.display = 'none';
        }
    }

    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;

        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
        }

        // Add animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Add input validation
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);
            
            if (this.value !== '' && (value < min || value > max)) {
                this.style.borderColor = '#f56565';
                this.style.backgroundColor = '#fed7d7';
            } else {
                this.style.borderColor = '#e2e8f0';
                this.style.backgroundColor = 'white';
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'Enter') {
                e.preventDefault();
                analyzeBtn.click();
            }
        }
        
        // Timer keyboard shortcuts
        if (e.code === 'Space') {
            e.preventDefault();
            if (!isRunning) {
                startTimer();
            } else {
                resetTimer();
            }
        }
        
        // 'T' key to start timer
        if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (!isRunning) {
                startTimer();
            }
        }
        
        // 'R' key to reset timer
        if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            resetTimer();
        }
    });
});

