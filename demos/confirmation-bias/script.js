// Data storage for the experiment
let experimentData = {
    examples: [],
    totalExamples: 0,
    positiveExamples: 0,
    negativeExamples: 0
};

// The actual rule: a < b < c
function checkActualRule(a, b, c) {
    return a < b && b < c;
}

// Check if example follows hypothesized rule
function checkHypothesizedRule(hypothesis, a, b, c) {
    switch(hypothesis) {
        case 'arithmetic':
            return b === a + 2 && c === a + 4;
        case 'geometric':
            return b === 2 * a && c === 3 * a;
        case 'fibonacci':
            return c === a + b;
        case 'consecutive':
            return a % 2 === 0 && b === a + 2 && c === a + 4;
        case 'multiples':
            return a % 2 === 0 && b === a + 2 && c === a + 4;
        default:
            return false;
    }
}

// Get hypothesis display name
function getHypothesisName(hypothesis) {
    const names = {
        'arithmetic': 'Arithmetic: (a, a+2, a+4)',
        'geometric': 'Geometric: (a, 2a, 3a)',
        'fibonacci': 'Fibonacci: (a, b, a+b)',
        'consecutive': 'Consecutive evens: (a, a+2, a+4) where a is even',
        'multiples': 'Multiples of 2: (2a, 2a+2, 2a+4)'
    };
    return names[hypothesis] || hypothesis;
}

// Update the chart
function updateChart() {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.resultsChart) {
        window.resultsChart.destroy();
    }
    
    // Group data by hypothesis
    const hypothesisData = {};
    experimentData.examples.forEach(example => {
        if (!hypothesisData[example.hypothesis]) {
            hypothesisData[example.hypothesis] = { positive: 0, negative: 0 };
        }
        if (example.followsHypothesis) {
            hypothesisData[example.hypothesis].positive++;
        } else {
            hypothesisData[example.hypothesis].negative++;
        }
    });
    
    const labels = Object.keys(hypothesisData).map(h => getHypothesisName(h));
    const positiveData = Object.values(hypothesisData).map(d => d.positive);
    const negativeData = Object.values(hypothesisData).map(d => d.negative);
    
    window.resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Positive Examples (Follows Hypothesis)',
                    data: positiveData,
                    backgroundColor: 'rgba(86, 171, 47, 0.8)',
                    borderColor: 'rgba(86, 171, 47, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Negative Examples (Doesn\'t Follow Hypothesis)',
                    data: negativeData,
                    backgroundColor: 'rgba(255, 65, 108, 0.8)',
                    borderColor: 'rgba(255, 65, 108, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Examples Submitted by Hypothesis Type',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Update statistics display
function updateStats() {
    document.getElementById('totalExamples').textContent = experimentData.totalExamples;
    document.getElementById('positiveExamples').textContent = experimentData.positiveExamples;
    document.getElementById('negativeExamples').textContent = experimentData.negativeExamples;
}

// Display result message
function displayResult(example) {
    const resultDiv = document.getElementById('result');
    
    let message, className;
    
    if (example.followsActualRule) {
        if (example.followsHypothesis) {
            message = `✅ CORRECT!<br>The example (${example.a}, ${example.b}, ${example.c}) follows both your hypothesis and the actual rule.`;
            className = 'result-positive';
        } else {
            message = `✅ FOLLOWS ACTUAL RULE!<br>The example (${example.a}, ${example.b}, ${example.c}) follows the actual rule but not your hypothesis.`;
            className = 'result-positive';
        }
    } else {
        if (example.followsHypothesis) {
            message = `❌ FOLLOWS HYPOTHESIS ONLY<br>The example (${example.a}, ${example.b}, ${example.c}) follows your hypothesis but not the actual rule.`;
            className = 'result-negative';
        } else {
            message = `❌ FOLLOWS NEITHER<br>The example (${example.a}, ${example.b}, ${example.c}) follows neither your hypothesis nor the actual rule.`;
            className = 'result-negative';
        }
    }
    
    resultDiv.innerHTML = message;
    resultDiv.className = `result-message ${className}`;
}

// Handle form submission
document.getElementById('exampleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const hypothesis = document.getElementById('hypothesis').value;
    const a = parseInt(document.getElementById('a').value);
    const b = parseInt(document.getElementById('b').value);
    const c = parseInt(document.getElementById('c').value);
    
    if (!hypothesis) {
        alert('Please select a hypothesized rule!');
        return;
    }
    
    // Check if example follows actual rule
    const followsActualRule = checkActualRule(a, b, c);
    
    // Check if example follows hypothesized rule
    const followsHypothesis = checkHypothesizedRule(hypothesis, a, b, c);
    
    // Create example object
    const example = {
        hypothesis: hypothesis,
        a: a,
        b: b,
        c: c,
        followsActualRule: followsActualRule,
        followsHypothesis: followsHypothesis,
        timestamp: new Date()
    };
    
    // Store the example
    experimentData.examples.push(example);
    experimentData.totalExamples++;
    
    if (followsActualRule) {
        experimentData.positiveExamples++;
    } else {
        experimentData.negativeExamples++;
    }
    
    // Display result
    displayResult(example);
    
    // Update chart and stats
    updateChart();
    updateStats();
    
    // Clear form
    document.getElementById('exampleForm').reset();
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    
    // Initialize chart with empty data
    const ctx = document.getElementById('resultsChart').getContext('2d');
    window.resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Positive Examples (Follows Hypothesis)',
                    data: [],
                    backgroundColor: 'rgba(86, 171, 47, 0.8)',
                    borderColor: 'rgba(86, 171, 47, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Negative Examples (Doesn\'t Follow Hypothesis)',
                    data: [],
                    backgroundColor: 'rgba(255, 65, 108, 0.8)',
                    borderColor: 'rgba(255, 65, 108, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Examples Submitted by Hypothesis Type',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
});
