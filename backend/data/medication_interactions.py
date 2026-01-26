# Common medication-food interactions database
MEDICATION_INTERACTIONS = {
    'warfarin': {
        'interacts_with': ['spinach', 'kale', 'broccoli', 'brussels sprouts', 'cabbage'],
        'nutrient': 'Vitamin K',
        'severity': 'moderate',
        'message': 'Contains Vitamin K which affects warfarin. Maintain consistent intake - eat similar portions each time.'
    },
    'simvastatin': {
        'interacts_with': ['grapefruit', 'grapefruit juice'],
        'nutrient': 'Bergamottin',
        'severity': 'high',
        'message': 'Grapefruit increases statin levels significantly. Avoid completely while on this medication.'
    },
    'atorvastatin': {
        'interacts_with': ['grapefruit', 'grapefruit juice'],
        'nutrient': 'Bergamottin',
        'severity': 'high',
        'message': 'Grapefruit increases statin levels significantly. Avoid completely while on this medication.'
    },
    'ciprofloxacin': {
        'interacts_with': ['milk', 'yogurt', 'cheese', 'calcium'],
        'nutrient': 'Calcium',
        'severity': 'moderate',
        'message': 'Dairy reduces antibiotic absorption by up to 50%. Take medication 2 hours before or 6 hours after dairy.'
    },
    'levothyroxine': {
        'interacts_with': ['soy', 'walnuts', 'fiber', 'coffee'],
        'nutrient': 'Various',
        'severity': 'moderate',
        'message': 'These foods can reduce thyroid medication absorption. Take medication on empty stomach, wait 30-60 minutes before eating.'
    }
}

def check_interaction(medication, food_items):
    """
    Check if food items interact with medication
    Returns list of interactions found
    """
    med_lower = medication.lower()
    interactions_found = []
    
    for med_name, details in MEDICATION_INTERACTIONS.items():
        if med_name in med_lower:
            for food in food_items:
                food_lower = food.lower()
                for interacting_food in details['interacts_with']:
                    if interacting_food in food_lower:
                        interactions_found.append({
                            'medication': medication,
                            'food': food,
                            'severity': details['severity'],
                            'message': details['message']
                        })
    
    return interactions_found