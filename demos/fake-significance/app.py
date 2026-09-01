from flask import Flask, render_template, request, jsonify
import numpy as np
from scipy import stats
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    
    # Extract before and after data
    before_data = data['before']
    after_data = data['after']
    
    # Define the attributes
    attributes = ['heart_beats', 'breaths', 'happiness', 'confidence', 'focus', 'comfort']
    
    results = []
    
    for attr in attributes:
        before_values = [float(before_data[f'student_{i+1}_{attr}']) for i in range(5)]
        after_values = [float(after_data[f'student_{i+1}_{attr}']) for i in range(5)]
        
        # Perform paired t-test
        t_stat, p_value = stats.ttest_rel(before_values, after_values)
        
        # Calculate mean change
        mean_change = np.mean(after_values) - np.mean(before_values)
        
        # Determine if significant (p < 0.05)
        is_significant = p_value < 0.05
        
        results.append({
            'attribute': attr.replace('_', ' ').title(),
            'before_mean': round(np.mean(before_values), 2),
            'after_mean': round(np.mean(after_values), 2),
            'mean_change': round(mean_change, 2),
            'p_value': round(p_value, 4),
            'is_significant': int(is_significant),  # Convert boolean to int for JSON serialization
            't_stat': round(t_stat, 3)
        })
    
    # Count significant results
    significant_count = sum(1 for r in results if r['is_significant'])
    
    return jsonify({
        'results': results,
        'significant_count': significant_count,
        'total_tests': len(attributes)
    })

if __name__ == '__main__':
    app.run(debug=True)

