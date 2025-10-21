const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// SQLite Database Setup
const dbPath = path.join(__dirname, 'fitness_app.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        // Create users table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                weight REAL NOT NULL,
                height INTEGER NOT NULL,
                goal TEXT NOT NULL,
                knowledge TEXT NOT NULL,
                access TEXT NOT NULL,
                equipment TEXT DEFAULT 'none',
                diet TEXT NOT NULL,
                split TEXT NOT NULL,
                budget INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
});



// DeepSeek AI Service
class DeepSeekService {
    constructor() {
        this.apiKey = process.env.DEEPSEEK_API_KEY;
        this.baseUrl = 'https://api.deepseek.com';
        console.log('✅ DeepSeek API initialized with key:', this.apiKey ? 'Present' : 'Missing');
    }

    async makeRequest(prompt, maxTokens = 1000) {
        try {
            console.log('🤖 Making DeepSeek API request...');
            const response = await axios.post(`${this.baseUrl}/v1/chat/completions`, {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert fitness trainer and nutritionist with years of experience in creating personalized workout plans and diet recommendations. Provide detailed, safe, and effective fitness advice.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: maxTokens,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ DeepSeek API response received');
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('❌ DeepSeek API Error:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                throw new Error('Invalid API key. Please check your DeepSeek API key.');
            } else if (error.response?.status === 429) {
                throw new Error('API rate limit exceeded. Please try again later.');
            } else {
                throw new Error('AI service temporarily unavailable: ' + (error.response?.data?.error?.message || error.message));
            }
        }
    }

    async generateWorkoutPlan(userdata) {
        const prompt = `Create a personalized workout plan for:
- Name: ${userdata.name}
- Age: ${userdata.age}
- Weight: ${userdata.weight}kg
- Height: ${userdata.height}cm
- Goal: ${userdata.goal}
- Experience: ${userdata.knowledge}
- Location: ${userdata.access}
- Equipment: ${userdata.equipment}
- Split: ${userdata.split}

Provide a detailed 7-day workout plan with specific exercises, sets, reps, and rest periods. Include warm-up and cool-down instructions. Format as JSON with days as keys.`;
        
        return await this.makeRequest(prompt, 1500);
    }

    async generateDietPlan(userdata) {
        const prompt = `Create a personalized diet plan for:
- Name: ${userdata.name}
- Age: ${userdata.age}
- Weight: ${userdata.weight}kg
- Height: ${userdata.height}cm
- Goal: ${userdata.goal}
- Diet preference: ${userdata.diet}
- Budget: ₹${userdata.budget}/day

Provide a detailed meal plan with:
- Daily calorie targets
- Macronutrient breakdown
- 3 main meals + 2 snacks per day
- Shopping list
- Meal prep tips
Format as detailed text with clear sections.`;
        
        return await this.makeRequest(prompt, 1500);
    }

    async answerFitnessQuestion(question, userContext = null) {
        let prompt = `Answer this fitness question: "${question}"

Provide a helpful, accurate, and safe response. Include practical tips and actionable advice.`;
        
        if (userContext) {
            prompt += `

User context:
- Goal: ${userContext.goal}
- Experience: ${userContext.knowledge}
- Location: ${userContext.access}
- Diet: ${userContext.diet}`;
        }
        
        return await this.makeRequest(prompt, 800);
    }
}

const deepSeekService = new DeepSeekService();

// Routes

// Save user data route - using SQLite
app.post('/api/save-user', async (req, res) => {
    try {
        const { name, age, weight, height, goal, knowledge, access, equipment, diet, split, budget } = req.body;

        // Validation
        if (!name || !age || !weight || !height || !goal || !knowledge || !access || !diet || !split || !budget) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Insert new user data
        const stmt = db.prepare(`
            INSERT INTO users (name, age, weight, height, goal, knowledge, access, equipment, diet, split, budget)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
            name, 
            parseInt(age), 
            parseFloat(weight), 
            parseInt(height), 
            goal, 
            knowledge, 
            access, 
            equipment || 'none', 
            diet, 
            split, 
            parseInt(budget)
        ], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            
            res.status(201).json({
                message: 'User data saved successfully',
                user: {
                    id: this.lastID,
                    name,
                    age: parseInt(age),
                    weight: parseFloat(weight),
                    height: parseInt(height),
                    goal,
                    knowledge,
                    access,
                    equipment: equipment || 'none',
                    diet,
                    split,
                    budget: parseInt(budget)
                }
            });
        });
        
        stmt.finalize();

    } catch (error) {
        console.error('Save user data error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all users route (for user selection)
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Get users error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        res.json({
            message: 'Users retrieved successfully',
            count: rows.length,
            users: rows
        });
    });
});

// Get specific user by ID
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error('Get user error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (!row) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'User retrieved successfully',
            user: row
        });
    });
});

// Delete user by ID
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
            console.error('Delete user error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'User deleted successfully',
            deletedUserId: userId
        });
    });
});

// AI-Powered Workout Plan Generation
app.post('/api/ai-workout', async (req, res) => {
    try {
        const userdata = req.body;
        
        if (!userdata.name || !userdata.goal || !userdata.knowledge) {
            return res.status(400).json({ message: 'Required user data missing' });
        }

        const aiWorkoutPlan = await deepSeekService.generateWorkoutPlan(userdata);
        
        res.json({
            message: 'AI workout plan generated successfully',
            workoutPlan: aiWorkoutPlan,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('AI Workout generation error:', error);
        res.status(500).json({ 
            message: 'Failed to generate AI workout plan', 
            error: error.message 
        });
    }
});

// AI-Powered Diet Plan Generation
app.post('/api/ai-diet', async (req, res) => {
    try {
        const userdata = req.body;
        
        if (!userdata.name || !userdata.goal || !userdata.diet) {
            return res.status(400).json({ message: 'Required user data missing' });
        }

        const aiDietPlan = await deepSeekService.generateDietPlan(userdata);
        
        res.json({
            message: 'AI diet plan generated successfully',
            dietPlan: aiDietPlan,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('AI Diet generation error:', error);
        res.status(500).json({ 
            message: 'Failed to generate AI diet plan', 
            error: error.message 
        });
    }
});

// AI Fitness Coaching Chatbot
app.post('/api/ai-chat', async (req, res) => {
    try {
        const { question, userContext } = req.body;
        
        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        // Try AI first, fallback to predefined responses if API key fails
        try {
            const aiResponse = await deepSeekService.answerFitnessQuestion(question, userContext);
            
            res.json({
                message: 'AI response generated successfully',
                response: aiResponse,
                question: question,
                timestamp: new Date().toISOString(),
                source: 'AI'
            });
        } catch (aiError) {
            console.log('AI service failed, using fallback responses:', aiError.message);
            
            // Fallback to predefined fitness responses
            const fallbackResponse = getFallbackFitnessResponse(question.toLowerCase());
            
            res.json({
                message: 'Fallback response generated',
                response: fallbackResponse,
                question: question,
                timestamp: new Date().toISOString(),
                source: 'Fallback'
            });
        }
    } catch (error) {
        console.error('AI Chat error:', error);
        res.status(500).json({ 
            message: 'Failed to get response', 
            error: error.message 
        });
    }
});

// Fallback fitness responses function
function getFallbackFitnessResponse(question) {
    const responses = {
        // Greetings
        'hello': 'Hello! I\'m your AI fitness coach. How can I help you with your fitness journey today?',
        'hi': 'Hi there! Ready to crush your fitness goals? What would you like to know?',
        'hey': 'Hey! I\'m here to help you with all your fitness questions. What\'s on your mind?',
        
        // Weight Loss
        'weight loss': 'For weight loss, focus on creating a caloric deficit through a combination of cardio exercises (like running, cycling) and strength training. Aim for 150 minutes of moderate cardio per week plus 2-3 strength sessions. Don\'t forget about nutrition - it\'s 70% of weight loss!',
        'lose weight': 'To lose weight effectively: 1) Create a caloric deficit (burn more than you eat), 2) Combine cardio and strength training, 3) Focus on whole foods, 4) Stay hydrated, 5) Get adequate sleep (7-9 hours). Consistency is key!',
        'fat loss': 'Fat loss requires patience and consistency. Try HIIT workouts 2-3x per week, strength training to preserve muscle, and maintain a moderate caloric deficit. Avoid crash diets - sustainable changes work best!',
        
        // Muscle Building
        'build muscle': 'To build muscle: 1) Progressive overload in your workouts, 2) Eat adequate protein (0.8-1g per lb bodyweight), 3) Get 7-9 hours of sleep, 4) Allow recovery time between sessions, 5) Focus on compound movements like squats, deadlifts, bench press.',
        'muscle gain': 'Muscle gain requires consistent strength training, adequate protein intake, and patience. Focus on compound exercises, progressive overload, and eating in a slight caloric surplus. Results typically show after 6-8 weeks of consistent training.',
        'bulk': 'For bulking: Eat in a moderate caloric surplus (300-500 calories), prioritize protein, lift heavy with compound movements, and be patient. Clean bulking is better than dirty bulking for quality muscle gain.',
        
        // Nutrition
        'diet': 'A good fitness diet includes: lean proteins, complex carbs, healthy fats, plenty of vegetables, and adequate hydration. Meal timing matters less than total daily intake. Focus on whole, unprocessed foods.',
        'nutrition': 'Nutrition fundamentals: 1) Eat adequate protein, 2) Don\'t completely eliminate carbs or fats, 3) Stay hydrated, 4) Eat plenty of vegetables, 5) Practice portion control. Remember: you can\'t out-train a bad diet!',
        'protein': 'Aim for 0.8-1g of protein per pound of bodyweight. Good sources include: chicken, fish, eggs, Greek yogurt, beans, lentils, and protein powder. Spread intake throughout the day for optimal muscle protein synthesis.',
        
        // Workouts
        'workout': 'A good workout routine includes: 1) Compound movements (squats, deadlifts, push-ups), 2) Progressive overload, 3) Adequate rest between sessions, 4) Both strength and cardio components. Consistency beats perfection!',
        'exercise': 'Start with basic compound exercises: squats, push-ups, pull-ups, and planks. These work multiple muscle groups efficiently. Aim for 3-4 workouts per week, allowing rest days for recovery.',
        'training': 'Training principles: 1) Progressive overload, 2) Consistency, 3) Proper form over heavy weight, 4) Adequate recovery, 5) Variety to prevent plateaus. Listen to your body and adjust as needed.',
        
        // Recovery
        'rest': 'Rest is crucial for fitness progress! Aim for 7-9 hours of sleep, take 1-2 complete rest days per week, and listen to your body. Overtraining can actually hinder progress.',
        'recovery': 'Recovery strategies: 1) Adequate sleep, 2) Proper nutrition, 3) Hydration, 4) Light activity on rest days, 5) Stress management. Your muscles grow during recovery, not during workouts!',
        'sleep': 'Sleep is when your body repairs and builds muscle. Aim for 7-9 hours per night. Poor sleep can hurt your performance, recovery, and even weight loss efforts.',
        
        // Motivation
        'motivation': 'Stay motivated by: 1) Setting realistic, specific goals, 2) Tracking progress, 3) Finding activities you enjoy, 4) Having a workout buddy, 5) Celebrating small wins. Remember why you started!',
        'consistency': 'Consistency is more important than perfection. It\'s better to work out 3 times a week consistently than to go all-out for a week and then quit. Small, sustainable changes lead to big results.',
        
        // Beginner
        'beginner': 'Welcome to fitness! Start with: 1) Basic bodyweight exercises, 2) 20-30 minute sessions, 3) 3 workouts per week, 4) Focus on learning proper form, 5) Gradually increase intensity. You\'ve got this!',
        'start': 'Starting your fitness journey? Begin with bodyweight exercises like push-ups, squats, and planks. Start small - even 15 minutes a day makes a difference. Focus on building the habit first!'
    };
    
    // Find matching response
    for (const [key, response] of Object.entries(responses)) {
        if (question.includes(key)) {
            return response;
        }
    }
    
    // Default response if no match found
    return `I understand you're asking about "${question}". While I'd love to give you a detailed answer, I recommend consulting with fitness professionals for personalized advice. In general, remember that consistency, proper form, adequate nutrition, and rest are the foundations of any successful fitness journey. What specific aspect would you like to know more about?`;
}

// Database management routes
app.post('/api/clear-database', (req, res) => {
    db.run('DELETE FROM users', [], function(err) {
        if (err) {
            console.error('Clear database error:', err);
            return res.status(500).json({ message: 'Failed to clear database' });
        }
        
        res.json({ 
            message: 'Database cleared successfully',
            deletedRows: this.changes
        });
    });
});

// Database viewer route
app.get('/database', (req, res) => {
    res.sendFile(path.join(__dirname, 'database_viewer.html'));
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error:', error);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Database connection event handlers - removed MongoDB handlers

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${__dirname}`);
    console.log(`📊 Database file: ${dbPath}`);
});

module.exports = app;

