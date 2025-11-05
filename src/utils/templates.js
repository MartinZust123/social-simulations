// Template definitions - shared with ParametersPanel
export const TEMPLATES = {
  'political-cultural': {
    name: 'Political-Cultural',
    features: [
      {
        name: 'Political Ideology',
        hasOrder: true,
        states: [
          { name: 'Far Left', color: '#e63946' },
          { name: 'Center Left', color: '#f4a261' },
          { name: 'Center', color: '#e9c46a' },
          { name: 'Center Right', color: '#8ecae6' },
          { name: 'Far Right', color: '#023047' }
        ]
      },
      {
        name: 'Religious Practice',
        hasOrder: true,
        states: [
          { name: 'Secular', color: '#2a9d8f' },
          { name: 'Occasionally Religious', color: '#8ab17d' },
          { name: 'Moderately Religious', color: '#f4a261' },
          { name: 'Very Religious', color: '#e76f51' }
        ]
      },
      {
        name: 'Language Family',
        hasOrder: false,
        states: [
          { name: 'Romance', color: '#d62828' },
          { name: 'Germanic', color: '#003049' },
          { name: 'Slavic', color: '#fcbf49' },
          { name: 'Asian', color: '#06a77d' }
        ]
      }
    ],
    correlations: {
      '0-1': -0.40
    }
  },
  'social-values': {
    name: 'Social Values',
    features: [
      {
        name: 'Environmental Concern',
        hasOrder: true,
        states: [
          { name: 'Low Priority', color: '#8d99ae' },
          { name: 'Some Concern', color: '#edf2f4' },
          { name: 'High Priority', color: '#90e0ef' },
          { name: 'Climate Activist', color: '#06d6a0' }
        ]
      },
      {
        name: 'Economic Policy',
        hasOrder: true,
        states: [
          { name: 'Free Market', color: '#f72585' },
          { name: 'Mixed Economy', color: '#7209b7' },
          { name: 'Planned Economy', color: '#3a0ca3' }
        ]
      },
      {
        name: 'Cultural Tradition',
        hasOrder: false,
        states: [
          { name: 'Western', color: '#4361ee' },
          { name: 'Eastern', color: '#f72585' },
          { name: 'African', color: '#ffbe0b' },
          { name: 'Indigenous', color: '#06a77d' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.35
    }
  },
  'technology-adoption': {
    name: 'Technology Adoption',
    features: [
      {
        name: 'Tech Adoption Rate',
        hasOrder: true,
        states: [
          { name: 'Late Majority', color: '#8d99ae' },
          { name: 'Early Majority', color: '#48cae4' },
          { name: 'Early Adopter', color: '#0096c7' },
          { name: 'Innovator', color: '#023e8a' }
        ]
      },
      {
        name: 'Privacy Awareness',
        hasOrder: true,
        states: [
          { name: 'Unaware', color: '#f4f1de' },
          { name: 'Somewhat Aware', color: '#e07a5f' },
          { name: 'Privacy Conscious', color: '#81b29a' },
          { name: 'Privacy Advocate', color: '#3d405b' }
        ]
      },
      {
        name: 'Platform Preference',
        hasOrder: false,
        states: [
          { name: 'Open Source', color: '#06a77d' },
          { name: 'Proprietary', color: '#d62828' },
          { name: 'Hybrid', color: '#f77f00' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.50
    }
  },
  'urban-rural': {
    name: 'Urban-Rural Divide',
    features: [
      {
        name: 'Population Density',
        hasOrder: true,
        states: [
          { name: 'Rural', color: '#8b4513' },
          { name: 'Suburban', color: '#d2691e' },
          { name: 'Urban', color: '#696969' },
          { name: 'Metropolitan', color: '#2f4f4f' }
        ]
      },
      {
        name: 'Digital Infrastructure',
        hasOrder: true,
        states: [
          { name: 'Limited', color: '#1a1a1a' },
          { name: 'Basic', color: '#4a4a4a' },
          { name: 'Good', color: '#808080' },
          { name: 'Advanced', color: '#c0c0c0' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.65
    }
  },
  'education-income': {
    name: 'Education-Income',
    features: [
      {
        name: 'Education Level',
        hasOrder: true,
        states: [
          { name: 'No Degree', color: '#1c1c1c' },
          { name: 'High School', color: '#4d4d4d' },
          { name: "Bachelor's", color: '#808080' },
          { name: 'Advanced', color: '#b3b3b3' }
        ]
      },
      {
        name: 'Income Level',
        hasOrder: true,
        states: [
          { name: 'Low', color: '#6a994e' },
          { name: 'Lower-Middle', color: '#a7c957' },
          { name: 'Upper-Middle', color: '#f2e8cf' },
          { name: 'High', color: '#bc6c25' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.70
    }
  },
  'tradition-innovation': {
    name: 'Tradition-Innovation',
    features: [
      {
        name: 'Cultural Openness',
        hasOrder: true,
        states: [
          { name: 'Traditional', color: '#0a0a0a' },
          { name: 'Conservative', color: '#404040' },
          { name: 'Moderate', color: '#808080' },
          { name: 'Progressive', color: '#d3d3d3' }
        ]
      },
      {
        name: 'Innovation Acceptance',
        hasOrder: true,
        states: [
          { name: 'Resistant', color: '#8b0000' },
          { name: 'Cautious', color: '#dc143c' },
          { name: 'Open', color: '#ff6347' },
          { name: 'Enthusiastic', color: '#ffa07a' }
        ]
      }
    ],
    correlations: {
      '0-1': 0.75
    }
  }
};

// Deep equality check for objects
function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Detect if current configuration exactly matches a template
export function detectTemplate(features, correlations) {
  for (const [key, template] of Object.entries(TEMPLATES)) {
    if (deepEqual(template.features, features) && deepEqual(template.correlations, correlations)) {
      return key;
    }
  }
  return null;
}
