/**
 * MAXIMIZE Configuration File
 * 
 * Update this file with your Make webhook URL and other settings
 */

// const MAXIMIZE_CONFIG = {
//   // Make Webhook Configuration
//   make: {
//     // Replace 'YOUR_WEBHOOK_URL_HERE' with your Make webhook URL
//     // Example: 'https://hook.make.com/abcd1234efgh5678ijkl9012mnop3456'
//     webhookUrl: "https://hook.us1.make.com/abc123xyz456",
//     apiKey: "MAXIMIZE_V1_PRIVATE_KEY_9f3a7c"
    
//     // Enable/disable Make integration
//     enabled: true,
    
//     // Timeout for Make webhook (in milliseconds)
//     timeout: 10000
//   },

//   // Stage Configuration
//   stages: {
//     '1': {
//       name: 'Foundation',
//       emoji: '🏗️',
//       description: 'Building your foundation. Clarity, consistency, and creating habits that carry you forward.'
//     },
//     '2': {
//       name: 'Awakening',
//       emoji: '🌅',
//       description: 'Awakening to new possibilities. Reframing your mindset and expanding your beliefs.'
//     },
//     '3': {
//       name: 'Leadership',
//       emoji: '🦁',
//       description: 'Stepping into leadership. Multiplying impact through others and creating meaningful influence.'
//     },
//     '4': {
//       name: 'Execution',
//       emoji: '⚡',
//       description: 'Executing with purpose. Mastering systems, optimizing processes, and scaling what works.'
//     },
//     '5': {
//       name: 'Legacy',
//       emoji: '👑',
//       description: 'Creating lasting impact that will outlive your direct efforts. Thinking in terms of legacy.'
//     }
//   },

//   // Assessment Questions
//   questions: {
//     q1: {
//       title: 'What best describes your current role?',
//       type: 'radio',
//       options: ['Student', 'Professional', 'Founder / Entrepreneur', 'Leader / Manager', 'Other (text)']
//     },
//     q2: {
//       title: 'What feels most challenging right now?',
//       type: 'checkbox',
//       options: [
//         'Clarity & direction',
//         'Confidence & self-belief',
//         'Consistency & discipline',
//         'Emotional regulation',
//         'Leadership influence',
//         'Purpose & meaning'
//       ]
//     },
//     q3: {
//       title: 'In your own words, what feels most stuck or unresolved right now?',
//       type: 'textarea'
//     },
//     q4: {
//       title: 'How would you describe your current growth posture?',
//       type: 'radio',
//       options: [
//         'Searching for clarity',
//         'Reframing my mindset',
//         'Stepping into leadership',
//         'Executing with purpose',
//         'Thinking long-term impact'
//       ]
//     }
//   }
// };

const MAXIMIZE_CONFIG = {
  make: {
    webhookUrl: "https://hook.us2.make.com/rwtspcnxlz6md6a36lyeoacdfp28bgl1",
    apiKey: "FFtbtptZ-NnWNy7"
  }
};


/**
 * SETUP INSTRUCTIONS
 * 
 * 1. Go to Make.com and create a new Scenario
 * 2. Add an Webhook trigger and set it to "POST"
 * 3. Copy the webhook URL and paste it here in webhookUrl
 * 4. Configure your Make scenario to process the assessment data
 * 
 * The webhook will receive assessment data in this format:
 * {
 *   "timestamp": "2026-02-10T10:30:00.000Z",
 *   "answers": {
 *     "role": "Professional",
 *     "challenges": ["Clarity & direction", "Confidence & self-belief"],
 *     "stuck": "I feel overwhelmed by too many priorities",
 *     "growth-posture": "Searching for clarity"
 *   },
 *   "stage": "Stage 1: Foundation"
 * }
 */
