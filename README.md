# IronForge Pro - Elite Fitness Training

## Overview
IronForge Pro is a comprehensive fitness application designed to help users achieve their training goals. It offers personalized workout plans and nutritional guidance, all centered around a sleek, professionally styled interface with red and black themes and a bodybuilder background.

## Key Features
1. **Modern User Interface**: Designed with red and black themes for a striking appearance and an engaging background with a bodybuilder theme.
2. **Authentication System**: Users are required to log in to access the application. This ensures data privacy and personalized experience.
3. **Personalized Plans**: Based on user input, customized workout and diet plans are crafted.
4. **Home vs Gym Workouts**: Smart workout adaptation based on available equipment.
5. **Notifications**: Popup alerts notify users when their plans are ready.
6. **Floating Animations**: Dumbbell animations and interactive elements.

## Technology Stack
- **Node.js and Express**: Backend services and APIs
- **MongoDB Atlas**: Cloud database for storing user data, fitness plans, and preferences
- **JWT**: Used for authentication tokens
- **bcryptjs**: Password hashing for security
- **HTML/CSS/JavaScript**: Frontend technologies for structure, styling, and interactivity
- **Font Awesome**: Icons and visual elements

## Getting Started

### Prerequisites
- Node.js (v14 or higher) and npm installed on your system
- MongoDB Atlas account (or local MongoDB instance)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ironforge-pro-gym-trainer.git
   cd ironforge-pro-gym-trainer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup (MongoDB Atlas)**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account if you don't have one
   - Create a new cluster
   - Get your connection string (it should look like the one provided)
   - Create a database user with read/write permissions
   - Whitelist your IP address in Network Access

4. **Environment Configuration**:
   - Open the `.env` file in the root directory
   - Replace `<db_username>` and `<db_password>` in the MONGODB_URI with your actual credentials:
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster55.nr7mjpz.mongodb.net/gym-trainer?retryWrites=true&w=majority&appName=Cluster55
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   ```

5. **Run the Application**:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

6. **Access the Application**:
   - Open your browser and go to: [http://localhost:3000](http://localhost:3000)
   - You should see the login page with red and black styling

## How to Use the Application

### First Time Setup
1. **Registration**: Since there's currently only a login page, you'll need to register via API first or modify the frontend to include registration
2. **Login**: Use your credentials to log in
3. **Fill out fitness form**: Complete your personal information, goals, and preferences
4. **Get your plan**: The system will generate personalized workout and diet plans
5. **Navigate sections**: Use the top navigation to view different sections

### Features Explanation
- **Home Workouts**: If you select "Home" as your workout location, the system will ask about available equipment and adapt exercises accordingly
- **Equipment Options**: None, Dumbbells, Barbell & Weights, or Full Home Gym
- **Diet Plans**: Vegetarian, Non-Vegetarian, or Vegan options with budget considerations
- **Workout Splits**: Upper-Lower, Bro Split, Push-Pull-Legs, or 3-Day Full Body

## API Endpoints

### Authentication
- **POST /api/register**: Register new user
  ```json
  {
    "username": "your_username",
    "email": "your_email@example.com",
    "password": "your_password"
  }
  ```

- **POST /api/login**: User login
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

### Fitness Data
- **POST /api/fitness-data**: Save user fitness data (requires authentication)
- **GET /api/profile**: Get user profile (requires authentication)

## Testing the Application

### Manual Testing
1. Start the server with `npm start`
2. Check console for "✅ Connected to MongoDB" message
3. Visit `http://localhost:3000`
4. Test login functionality (you may need to register a user first via API)
5. Test form submission and plan generation
6. Test navigation between sections

### Creating a Test User (via API)
You can use a tool like Postman or curl to create a test user:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Check your MONGODB_URI in .env file
2. **"Cannot find module" Error**: Run `npm install` again
3. **Port Already in Use**: Change PORT in .env file or kill process using port 3000
4. **Authentication Issues**: Check JWT_SECRET in .env file

### Database Issues
1. **Connection Timeout**: Check MongoDB Atlas network access settings
2. **Authentication Failed**: Verify username/password in connection string
3. **IP Not Whitelisted**: Add your IP to MongoDB Atlas network access

## File Structure
```
ironforge-pro-gym-trainer/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── index.html             # Main HTML file
├── styles.css             # Styling (red/black theme)
├── script.js              # Frontend JavaScript
├── localDataStore.js      # Local JSON storage (backup)
└── README.md              # This file
```

## Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Input validation
- CORS protection
- Environment variable protection

## Future Enhancements
- User registration form on frontend
- Email notifications
- Mobile responsive improvements
- Exercise video integration
- Social features

## Support
If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all dependencies are installed
3. Verify environment variables are set correctly
4. Check MongoDB Atlas connection and permissions

## License
MIT License - feel free to use and modify as needed.

## About
- **Owner**: Alex Rodriguez, Certified Personal Trainer & Fitness App Developer
- **Email**: alex.rodriguez@ironforge.pro
- **Version**: 1.0.0
