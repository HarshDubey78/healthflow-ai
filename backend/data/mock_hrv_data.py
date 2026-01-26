from datetime import datetime, timedelta
import random

def generate_mock_hrv_data(days=7):
    """
    Generate realistic mock HRV data for testing
    """
    baseline_hrv = 55  # Healthy baseline
    data = []
    
    for i in range(days):
        date = datetime.now() - timedelta(days=days-i-1)
        
        # Simulate realistic variations
        if i == days - 1:  # Today - simulate low HRV
            hrv = baseline_hrv * 0.76  # 24% below baseline
            resting_hr = 72  # Elevated
            sleep_hours = 6.0  # Poor sleep
        else:
            hrv = baseline_hrv + random.uniform(-5, 5)
            resting_hr = random.randint(58, 65)
            sleep_hours = random.uniform(7, 8.5)
        
        data.append({
            'date': date.strftime('%Y-%m-%d'),
            'hrv_ms': round(hrv, 1),
            'baseline_hrv': baseline_hrv,
            'resting_hr': int(resting_hr),
            'sleep_hours': round(sleep_hours, 1)
        })
    
    return data

def get_today_hrv():
    """Get today's HRV reading"""
    all_data = generate_mock_hrv_data(7)
    return all_data[-1]  # Return today's data