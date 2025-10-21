# AI Features Guide - IronForge Pro

## Overview
Your IronForge Pro fitness application now includes three powerful AI features powered by DeepSeek:

1. **AI-Powered Workout Recommendations**
2. **AI Diet Planning** 
3. **Fitness Coaching Chatbot**

## Setup Instructions

### 1. Get DeepSeek API Key
1. Visit [DeepSeek API](https://platform.deepseek.com/)
2. Sign up for an account
3. Generate an API key
4. Copy your API key

### 2. Configure Environment
1. Open the `.env` file in your project root
2. Replace `your-deepseek-api-key-here` with your actual API key:
   ```
   DEEPSEEK_API_KEY=your_actual_api_key_here
   ```

## How to Use the AI Features

### 1. AI-Powered Workout & Diet Plans

**Location**: User Information Form
- Fill out the fitness form as usual
- Click the **"Generate AI-Powered Plan"** button (green button)
- AI will generate personalized workout and diet plans based on your input
- View results in the AI modal with separate tabs for workout and diet plans

**Features**:
- Personalized 7-day workout plans
- Specific exercises, sets, reps, and rest periods
- Warm-up and cool-down instructions
- Detailed diet plans with calorie targets
- Macronutrient breakdown
- Shopping lists and meal prep tips

### 2. AI Fitness Coaching Chatbot

**Location**: Click the "AI Coach" button in the navigation bar
- Opens a floating chatbot in the bottom-right corner
- Ask any fitness, nutrition, or exercise questions
- Get personalized advice based on your profile (if you've filled out the form)

**Example Questions**:
- "How do I improve my bench press?"
- "What should I eat before a workout?"
- "How many calories should I eat to lose weight?"
- "What's the best exercise for abs?"
- "How can I build muscle faster?"

**Features**:
- Real-time AI responses
- Context-aware answers (uses your fitness profile)
- Professional fitness coaching advice
- Easy-to-use chat interface

### 3. Enhanced Regular Plans
The traditional workout and diet plan generation still works, but now you have the option to use AI for more sophisticated, personalized recommendations.

## AI Features Comparison

| Feature | Regular Plans | AI-Powered Plans |
|---------|---------------|------------------|
| Personalization | Basic template-based | Deep AI analysis |
| Detail Level | Standard exercises | Detailed instructions |
| Nutrition | Basic meal suggestions | Complete nutrition science |
| Coaching | Static information | Interactive Q&A |
| Updates | Fixed content | Dynamic, contextual |

## Technical Details

### API Endpoints
- `POST /api/ai-workout` - Generate AI workout plan
- `POST /api/ai-diet` - Generate AI diet plan  
- `POST /api/ai-chat` - Fitness coaching chatbot

### Security
- API key stored securely in environment variables
- All requests validated and sanitized
- Error handling for API failures

## Troubleshooting

### Common Issues

1. **"AI service temporarily unavailable"**
   - Check your DeepSeek API key in `.env`
   - Verify your internet connection
   - Ensure you have API credits remaining

2. **Chatbot not responding**
   - Check browser console for errors
   - Verify server is running on port 8080
   - Refresh the page and try again

3. **Modal not showing AI results**
   - Check if form is properly filled out
   - Look for error messages in browser console
   - Verify all required fields are completed

### Error Messages
- **"Required user data missing"**: Fill out all form fields
- **"Question is required"**: Type a question in the chatbot
- **"Failed to generate AI plans"**: Check API key and internet connection

## Mobile Responsiveness
All AI features are fully responsive:
- Chatbot adapts to smaller screens
- AI modal resizes for mobile devices
- Touch-friendly interface elements

## Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance Notes
- AI plan generation takes 10-30 seconds
- Chatbot responses typically take 3-10 seconds
- Large plans may take longer to generate
- Internet connection speed affects response times

## Getting the Most from AI Features

### Best Practices
1. **Be specific in form inputs** - More detailed info = better AI recommendations
2. **Ask detailed questions** - "How do I improve my squat form?" vs "Help with squats"
3. **Provide context** - Mention your experience level and goals
4. **Use follow-up questions** - Build on previous responses

### Tips
- The AI learns from your profile data for better responses
- Try both regular and AI plans to compare
- Use the chatbot for quick questions during workouts
- Save or screenshot AI plans for offline reference

## Future Enhancements
- Progress tracking integration with AI
- AI-powered form analysis
- Custom meal planning with dietary restrictions
- Workout video recommendations
- AI fitness assessments

---

**Need Help?** Use the AI chatbot - it's there to help with any fitness questions!