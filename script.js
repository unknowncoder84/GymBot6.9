document.addEventListener('DOMContentLoaded', () => {
    const formSection = document.getElementById('user-form');
    const form = document.getElementById('fitnessForm');
    const planSection = document.getElementById('plan');
    const dietSection = document.getElementById('diet-section');
    const benefitsSection = document.getElementById('benefits');

    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    const usersSection = document.getElementById('users');

    // User storage management
    let storedUsers = JSON.parse(localStorage.getItem('ironforge_users') || '[]');
    let currentSelectedUser = null;

    // AI-related variables
    let chatbotOpen = false;
    let aiModalOpen = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Fetch values from form
        const formData = new FormData(form);
        const name = formData.get('name');
        const age = formData.get('age');
        const weight = formData.get('weight');
        const height = formData.get('height');
        const goal = formData.get('goal');
        const knowledge = formData.get('knowledge');
        const access = formData.get('access');
        const equipment = formData.get('equipment');
        const diet = formData.get('diet');
        const split = formData.get('split');
        const budget = formData.get('budget');

        // Store user data globally for access by other functions
        window.userData = {
            name, age, weight, height, goal, knowledge, access, equipment, diet, split, budget
        };

        // Store user data locally
        storeUserData(window.userData);

        try {
            // Save user data to MongoDB
            const response = await fetch('/api/save-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name, age, weight, height, goal, knowledge, access, equipment, diet, split, budget
                })
            });

            const result = await response.json();

            if (response.ok) {
                console.log('User data saved successfully:', result);
                
                // Show and update plan
                updatePlanSection(planSection, name, goal, split, access, equipment, knowledge);
                planSection.classList.remove('hidden');

                // Show and update diet plan
                updateDietSection(dietSection, diet, budget, goal);
                dietSection.classList.remove('hidden');

                // Show benefits
                benefitsSection.classList.remove('hidden');



                // Hide form and show success message
                formSection.classList.add('hidden');
                
                // Redirect to plan section immediately
                showSection('plan');
            } else {
                alert('Error saving data: ' + result.message);
            }
        } catch (error) {
            console.error('Error saving user data:', error);
            alert('Failed to save data. Please try again.');
        }
    });

    // Show the user form on button click
    window.showForm = () => {
        // Hide all sections first
        const sections = [homeSection, formSection, planSection, dietSection, benefitsSection, aboutSection, usersSection];
        sections.forEach(section => section.classList.add('hidden'));
        
        // Show form section
        formSection.classList.remove('hidden');
        
        // Update nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
    };

    // Toggle home equipment visibility
    window.toggleEquipment = () => {
        const access = document.getElementById('access');
        const homeEquipment = document.getElementById('home-equipment');
        if (access.value === 'home') {
            homeEquipment.classList.remove('hidden');
        } else {
            homeEquipment.classList.add('hidden');
        }
    };



    // Show section function
    window.showSection = (sectionName) => {
        // Hide all sections
        const sections = [homeSection, formSection, planSection, dietSection, benefitsSection, aboutSection, usersSection];
        sections.forEach(section => {
            if (section) section.classList.add('hidden');
        });

        // Update nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // Show selected section
        let targetSection;
        switch(sectionName) {
            case 'home':
                targetSection = homeSection;
                break;
            case 'plan':
                targetSection = planSection;
                if (window.userData) {
                    updatePlanSection(planSection, window.userData.name, window.userData.goal, window.userData.split, window.userData.access, window.userData.equipment, window.userData.knowledge);
                }
                break;
            case 'diet':
                targetSection = dietSection;
                if (window.userData) {
                    updateDietSection(dietSection, window.userData.diet, window.userData.budget, window.userData.goal);
                }
                break;
            case 'benefits':
                targetSection = benefitsSection;
                updateBenefitsSection();
                break;
            case 'users':
                targetSection = usersSection;
                displayStoredUsers();
                break;
            case 'about':
                targetSection = aboutSection;
                break;
        }

        if (targetSection) {
            targetSection.classList.remove('hidden');
            
            // Update active nav link
            const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            // No scrolling - just show the section as overlay
        }
    };

    // Enhanced Exercise database with more variety and images
    const exercises = {
        chest: [
            { name: 'Push-ups', benefits: 'Builds chest, shoulders, triceps', days: 30, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
            { name: 'Bench Press', benefits: 'Builds massive chest strength', days: 45, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop' },
            { name: 'Incline Press', benefits: 'Upper chest development', days: 45, image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop' },
            { name: 'Dips', benefits: 'Lower chest and triceps', days: 35, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
            { name: 'Flyes', benefits: 'Chest isolation and shape', days: 40, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop' },
            { name: 'Decline Press', benefits: 'Lower chest emphasis', days: 40, image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop' },
            { name: 'Cable Crossovers', benefits: 'Chest definition and shape', days: 35, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
            { name: 'Diamond Push-ups', benefits: 'Inner chest and triceps', days: 30, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
            { name: 'Chest Press Machine', benefits: 'Controlled chest development', days: 35, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop' },
            { name: 'Pec Deck', benefits: 'Chest isolation', days: 35, image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop' }
        ],
        back: [
            { name: 'Pull-ups', benefits: 'V-taper and width', days: 40, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' },
            { name: 'Deadlifts', benefits: 'Overall back thickness', days: 50, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' },
            { name: 'Rows', benefits: 'Mid-back strength', days: 35, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' },
            { name: 'Lat Pulldowns', benefits: 'Lat width and definition', days: 35, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' },
            { name: 'Face Pulls', benefits: 'Rear delts and posture', days: 30, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' },
            { name: 'T-Bar Rows', benefits: 'Back thickness', days: 40, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' },
            { name: 'Cable Rows', benefits: 'Mid-back development', days: 35, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' },
            { name: 'Wide Grip Pulldowns', benefits: 'Lat width', days: 35, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' },
            { name: 'Reverse Flyes', benefits: 'Rear delt strength', days: 30, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' },
            { name: 'Single Arm Rows', benefits: 'Unilateral back strength', days: 35, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' }
        ],
        legs: [
            { name: 'Squats', benefits: 'Overall leg development', days: 45, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop' },
            { name: 'Lunges', benefits: 'Unilateral strength', days: 30, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
            { name: 'Leg Press', benefits: 'Quad development', days: 35, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop' },
            { name: 'Romanian Deadlifts', benefits: 'Hamstring strength', days: 40, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' },
            { name: 'Calf Raises', benefits: 'Calf definition', days: 60, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
            { name: 'Bulgarian Split Squats', benefits: 'Single leg strength', days: 35, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop' },
            { name: 'Leg Curls', benefits: 'Hamstring isolation', days: 30, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' },
            { name: 'Leg Extensions', benefits: 'Quad isolation', days: 30, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop' },
            { name: 'Walking Lunges', benefits: 'Functional leg strength', days: 30, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
            { name: 'Hip Thrusts', benefits: 'Glute development', days: 35, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop' }
        ],
        shoulders: [
            { name: 'Overhead Press', benefits: 'Shoulder strength', days: 40 },
            { name: 'Lateral Raises', benefits: 'Shoulder width', days: 35 },
            { name: 'Front Raises', benefits: 'Front delt development', days: 35 },
            { name: 'Rear Delt Flyes', benefits: 'Rear delt strength', days: 30 },
            { name: 'Shrugs', benefits: 'Trap development', days: 30 },
            { name: 'Arnold Press', benefits: 'Complete shoulder development', days: 40 },
            { name: 'Upright Rows', benefits: 'Shoulder and trap strength', days: 35 },
            { name: 'Pike Push-ups', benefits: 'Shoulder strength bodyweight', days: 30 },
            { name: 'Cable Lateral Raises', benefits: 'Consistent shoulder tension', days: 35 },
            { name: 'Handstand Push-ups', benefits: 'Advanced shoulder strength', days: 45 }
        ],
        arms: [
            { name: 'Bicep Curls', benefits: 'Bicep peak and size', days: 35 },
            { name: 'Tricep Dips', benefits: 'Tricep strength', days: 30 },
            { name: 'Hammer Curls', benefits: 'Forearm and bicep', days: 35 },
            { name: 'Close-Grip Push-ups', benefits: 'Tricep definition', days: 30 },
            { name: 'Chin-ups', benefits: 'Bicep and back', days: 40 },
            { name: 'Tricep Extensions', benefits: 'Tricep isolation', days: 30 },
            { name: 'Preacher Curls', benefits: 'Bicep peak', days: 35 },
            { name: 'Overhead Tricep Extension', benefits: 'Long head tricep', days: 30 },
            { name: 'Cable Curls', benefits: 'Constant bicep tension', days: 35 },
            { name: 'Diamond Push-ups', benefits: 'Tricep focus', days: 30 }
        ],
        core: [
            { name: 'Planks', benefits: 'Core stability', days: 21 },
            { name: 'Crunches', benefits: 'Ab definition', days: 30 },
            { name: 'Russian Twists', benefits: 'Oblique strength', days: 25 },
            { name: 'Mountain Climbers', benefits: 'Core endurance', days: 20 },
            { name: 'Dead Bug', benefits: 'Core control', days: 25 },
            { name: 'Bicycle Crunches', benefits: 'Ab and oblique', days: 25 },
            { name: 'Leg Raises', benefits: 'Lower ab strength', days: 30 },
            { name: 'Side Planks', benefits: 'Oblique stability', days: 25 },
            { name: 'Hollow Body Hold', benefits: 'Core endurance', days: 30 },
            { name: 'Ab Wheel Rollouts', benefits: 'Advanced core strength', days: 40 }
        ],
        cardio: [
            { name: 'Running', benefits: 'Cardiovascular health', days: 14 },
            { name: 'Cycling', benefits: 'Low-impact cardio', days: 14 },
            { name: 'Swimming', benefits: 'Full-body cardio', days: 21 },
            { name: 'Jumping Jacks', benefits: 'Quick cardio boost', days: 7 },
            { name: 'Burpees', benefits: 'Full-body conditioning', days: 14 },
            { name: 'Jump Rope', benefits: 'Coordination and cardio', days: 14 },
            { name: 'High Knees', benefits: 'Lower body cardio', days: 7 },
            { name: 'Rowing', benefits: 'Full-body cardio', days: 14 },
            { name: 'Stair Climbing', benefits: 'Leg and cardio strength', days: 14 },
            { name: 'Dancing', benefits: 'Fun cardio workout', days: 14 }
        ]
    };

    // Function to get random exercises from a category
    const getRandomExercises = (category, count = 5) => {
        const categoryExercises = exercises[category] || [];
        const shuffled = [...categoryExercises].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, categoryExercises.length));
    };

    // Enhanced workout plans with user-input based randomization
    const generateRandomWorkoutPlan = (split, goal, knowledge, access, equipment) => {
        let exerciseCount;
        
        // Adjust exercise count based on experience level
        switch(knowledge) {
            case 'beginner':
                exerciseCount = { main: 3, secondary: 2 };
                break;
            case 'intermediate':
                exerciseCount = { main: 4, secondary: 3 };
                break;
            case 'expert':
                exerciseCount = { main: 5, secondary: 4 };
                break;
            default:
                exerciseCount = { main: 4, secondary: 3 };
        }
        
        // Filter exercises based on goal
        const getGoalSpecificExercises = (category) => {
            let allExercises = exercises[category] || [];
            
            // Goal-specific exercise preferences
            if (goal === 'bulk' || goal === 'gain') {
                // Prefer compound movements for muscle building
                const compoundMoves = {
                    chest: ['Bench Press', 'Incline Press', 'Dips'],
                    back: ['Deadlifts', 'Pull-ups', 'Rows'],
                    legs: ['Squats', 'Romanian Deadlifts', 'Leg Press'],
                    shoulders: ['Overhead Press', 'Arnold Press'],
                    arms: ['Chin-ups', 'Tricep Dips']
                };
                
                if (compoundMoves[category]) {
                    allExercises = allExercises.filter(ex => 
                        compoundMoves[category].includes(ex.name) ||
                        Math.random() < 0.3 // 30% chance for other exercises
                    );
                }
            } else if (goal === 'cut' || goal === 'shredded' || goal === 'weightloss') {
                // Prefer high-rep, metabolic exercises
                const metabolicMoves = {
                    chest: ['Push-ups', 'Diamond Push-ups'],
                    back: ['Pull-ups', 'Face Pulls'],
                    legs: ['Lunges', 'Bulgarian Split Squats', 'Walking Lunges'],
                    core: ['Mountain Climbers', 'Burpees', 'Russian Twists'],
                    cardio: ['Burpees', 'Jumping Jacks', 'High Knees']
                };
                
                if (metabolicMoves[category]) {
                    allExercises = allExercises.filter(ex => 
                        metabolicMoves[category].includes(ex.name) ||
                        Math.random() < 0.4 // 40% chance for other exercises
                    );
                }
            }
            
            return allExercises;
        };
        
        // Get random exercises from filtered list
        const getRandomFilteredExercises = (category, count = 5) => {
            const categoryExercises = getGoalSpecificExercises(category);
            const shuffled = [...categoryExercises].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.min(count, categoryExercises.length));
        };
        
        const plans = {
            'upper-lower': {
                'Day 1 - Upper': [
                    ...getRandomFilteredExercises('chest', exerciseCount.main).map(ex => ex.name),
                    ...getRandomFilteredExercises('back', exerciseCount.secondary).map(ex => ex.name),
                    ...getRandomFilteredExercises('shoulders', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('arms', 1).map(ex => ex.name)
                ],
                'Day 2 - Lower': [
                    ...getRandomFilteredExercises('legs', exerciseCount.main).map(ex => ex.name),
                    ...getRandomFilteredExercises('core', knowledge === 'beginner' ? 1 : 2).map(ex => ex.name)
                ],
                'Day 3 - Upper': [
                    ...getRandomFilteredExercises('chest', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('back', exerciseCount.secondary).map(ex => ex.name),
                    ...getRandomFilteredExercises('shoulders', exerciseCount.secondary).map(ex => ex.name),
                    ...getRandomFilteredExercises('arms', 1).map(ex => ex.name)
                ],
                'Day 4 - Lower': [
                    ...getRandomFilteredExercises('legs', exerciseCount.secondary).map(ex => ex.name),
                    ...getRandomFilteredExercises('core', exerciseCount.secondary).map(ex => ex.name)
                ]
            },
            'bro-split': {
                'Day 1 - Chest': getRandomFilteredExercises('chest', exerciseCount.main + 1).map(ex => ex.name),
                'Day 2 - Back': getRandomFilteredExercises('back', exerciseCount.main + 1).map(ex => ex.name),
                'Day 3 - Shoulders': getRandomFilteredExercises('shoulders', exerciseCount.main + 1).map(ex => ex.name),
                'Day 4 - Arms': getRandomFilteredExercises('arms', exerciseCount.main + 1).map(ex => ex.name),
                'Day 5 - Legs': getRandomFilteredExercises('legs', exerciseCount.main + 1).map(ex => ex.name)
            },
            'ppl': {
                'Day 1 - Push': [
                    ...getRandomFilteredExercises('chest', exerciseCount.secondary).map(ex => ex.name),
                    ...getRandomFilteredExercises('shoulders', exerciseCount.secondary).map(ex => ex.name),
                    ...getRandomFilteredExercises('arms', 1).map(ex => ex.name)
                ],
                'Day 2 - Pull': [
                    ...getRandomFilteredExercises('back', exerciseCount.main).map(ex => ex.name),
                    ...getRandomFilteredExercises('arms', exerciseCount.secondary).map(ex => ex.name)
                ],
                'Day 3 - Legs': [
                    ...getRandomFilteredExercises('legs', exerciseCount.main).map(ex => ex.name),
                    ...getRandomFilteredExercises('core', 1).map(ex => ex.name)
                ]
            },
            '3-day-full': {
                'Day 1 - Full Body': [
                    ...getRandomFilteredExercises('legs', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('chest', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('back', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('shoulders', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('core', 1).map(ex => ex.name)
                ],
                'Day 2 - Full Body': [
                    ...getRandomFilteredExercises('legs', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('chest', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('back', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('arms', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('core', 1).map(ex => ex.name)
                ],
                'Day 3 - Full Body': [
                    ...getRandomFilteredExercises('legs', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('chest', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('back', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('shoulders', 1).map(ex => ex.name),
                    ...getRandomFilteredExercises('arms', 1).map(ex => ex.name)
                ]
            }
        };
        return plans[split] || plans['3-day-full'];
    };

    // Enhanced diet plans with user input based randomization
    const getRandomDietPlan = (dietType, goal, budget) => {
        const dietOptions = {
            veg: {
                breakfast: [
                    { name: 'Poha with curry leaves and lemon', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
                    { name: 'Upma with vegetables', image: 'https://images.unsplash.com/photo-1630383249896-424e482df922?w=400&h=300&fit=crop' },
                    { name: 'Idli sambar with coconut chutney', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop' },
                    { name: 'Dosa with sambar and chutney', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop' },
                    { name: 'Paratha with curd and pickle', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
                    { name: 'Vegetable uttapam', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop' },
                    { name: 'Daliya with milk and dry fruits', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
                    { name: 'Stuffed paratha with butter', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
                    { name: 'Masala chai with biscuits', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' }
                ],
                lunch: [
                    { name: 'Dal rice with sabzi and roti', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
                    { name: 'Rajma rice with papad', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Chole bhature with onion salad', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Paneer butter masala with naan', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
                    { name: 'Mixed dal tadka with jeera rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Aloo gobi with roti and raita', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
                    { name: 'Palak paneer with rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Baingan bharta with roti', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
                    { name: 'Kadhi pakora with rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' }
                ],
                dinner: [
                    { name: 'Khichdi with ghee and pickle', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Dal chawal with sabzi', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Roti sabzi with dal', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Vegetable pulao with raita', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Sambar rice with appalam', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Methi thepla with curd', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Moong dal with rice', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Vegetable curry with chapati', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Paneer tikka with roti', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' }
                ],
                snacks: [
                    { name: 'Samosa with green chutney', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Dhokla with coriander chutney', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Paneer pakoda with tea', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Aloo tikki with sweet chutney', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Bhel puri with sev', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Masala chai with biscuits', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Fruit chaat with black salt', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Roasted makhana with spices', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Moong dal cheela roll', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' }
                ]
            },
            'non-veg': {
                breakfast: [
                    { name: 'Egg paratha with curd', image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop' },
                    { name: 'Chicken keema with pav', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop' },
                    { name: 'Masala scrambled eggs with toast', image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop' },
                    { name: 'Chicken sausage with upma', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop' },
                    { name: 'Fish curry with appam', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
                    { name: 'Egg bhurji with roti', image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop' },
                    { name: 'Chicken sandwich with chai', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop' },
                    { name: 'Mutton keema with puri', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
                    { name: 'Egg dosa with sambar', image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop' }
                ],
                lunch: [
                    { name: 'Chicken curry with rice and roti', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Mutton biryani with raita', image: 'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=400&h=300&fit=crop' },
                    { name: 'Fish curry with rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Butter chicken with naan', image: 'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=400&h=300&fit=crop' },
                    { name: 'Chicken tikka masala with rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Prawn curry with coconut rice', image: 'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=400&h=300&fit=crop' },
                    { name: 'Lamb curry with chapati', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Chicken chettinad with rice', image: 'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=400&h=300&fit=crop' },
                    { name: 'Fish fry with sambar rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' }
                ],
                dinner: [
                    { name: 'Chicken dal with rice', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Mutton curry with roti', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Fish curry with rice', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Chicken pulao with raita', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Egg curry with chapati', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Prawn masala with rice', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Chicken soup with bread', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Mutton keema with rice', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Fish tikka with roti', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' }
                ],
                snacks: [
                    { name: 'Chicken pakora with chutney', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Fish cutlet with tea', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Egg rolls with sauce', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Chicken tikka bites', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Mutton seekh kebab', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Boiled eggs with masala', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Chicken salad bowl', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Fish fingers with dip', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Chicken soup', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' }
                ]
            },
            vegan: {
                breakfast: [
                    { name: 'Vegetable poha with curry leaves', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
                    { name: 'Coconut milk upma with vegetables', image: 'https://images.unsplash.com/photo-1630383249896-424e482df922?w=400&h=300&fit=crop' },
                    { name: 'Plain dosa with coconut chutney', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop' },
                    { name: 'Vegetable daliya with lemon', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
                    { name: 'Moong dal cheela with vegetables', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
                    { name: 'Quinoa porridge with coconut milk', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
                    { name: 'Vegetable ragi dosa', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop' },
                    { name: 'Oats upma with nuts', image: 'https://images.unsplash.com/photo-1630383249896-424e482df922?w=400&h=300&fit=crop' },
                    { name: 'Coconut milk smoothie bowl', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop' }
                ],
                lunch: [
                    { name: 'Mixed dal with coconut rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Vegetable sambar with rice', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
                    { name: 'Chana masala with rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Baingan bharta with roti', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
                    { name: 'Aloo gobi with chapati', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Vegetable curry with coconut', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
                    { name: 'Bhindi masala with rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' },
                    { name: 'Mixed vegetable curry', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
                    { name: 'Rajma without dairy with rice', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop' }
                ],
                dinner: [
                    { name: 'Simple dal with rice', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Vegetable soup with bread', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Quinoa vegetable pulao', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Mixed dal khichdi', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Vegetable curry with roti', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Coconut vegetable stew', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Lentil vegetable soup', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Stuffed roti with vegetables', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' },
                    { name: 'Brown rice with dal', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop' }
                ],
                snacks: [
                    { name: 'Roasted chana with spices', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Mixed nuts and seeds', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Coconut water with fruits', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Vegetable salad with lemon', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Roasted makhana (fox nuts)', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Fresh fruit chaat', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Herbal tea with jaggery', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Coconut laddu (sugar-free)', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
                    { name: 'Sprouted moong salad', image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' }
                ]
            }
        };
        
        const selectedPlan = dietOptions[dietType] || dietOptions['veg'];
        
        // Adjust portions and selections based on goal
        let mealCounts = { breakfast: 3, lunch: 3, dinner: 3, snacks: 2 };
        
        if (goal === 'bulk' || goal === 'gain') {
            mealCounts = { breakfast: 4, lunch: 4, dinner: 4, snacks: 3 };
        } else if (goal === 'cut' || goal === 'shredded' || goal === 'weightloss') {
            mealCounts = { breakfast: 2, lunch: 3, dinner: 2, snacks: 1 };
        }
        
        // Budget-based filtering
        let filteredPlan = { ...selectedPlan };
        if (budget < 50) {
            // Low budget - prefer simple, cost-effective options
            const budgetFriendly = {
                breakfast: ['Oatmeal', 'Eggs', 'Protein smoothie'],
                lunch: ['Rice and beans', 'Pasta', 'Sandwich'],
                dinner: ['Rice dishes', 'Pasta', 'Simple proteins'],
                snacks: ['Nuts', 'Fruit', 'Yogurt']
            };
            
            Object.keys(filteredPlan).forEach(meal => {
                filteredPlan[meal] = filteredPlan[meal].filter(option => 
                    budgetFriendly[meal].some(budget => option.toLowerCase().includes(budget.toLowerCase())) ||
                    Math.random() < 0.3
                );
            });
        }
        
        return {
            breakfast: filteredPlan.breakfast.sort(() => 0.5 - Math.random()).slice(0, mealCounts.breakfast),
            lunch: filteredPlan.lunch.sort(() => 0.5 - Math.random()).slice(0, mealCounts.lunch),
            dinner: filteredPlan.dinner.sort(() => 0.5 - Math.random()).slice(0, mealCounts.dinner),
            snacks: filteredPlan.snacks.sort(() => 0.5 - Math.random()).slice(0, mealCounts.snacks)
        };
    };

    // Home workout alternatives
    const homeAlternatives = {
        'none': {
            'Bench Press': 'Push-ups',
            'Incline Press': 'Incline Push-ups',
            'Pull-ups': 'Pike Push-ups',
            'Rows': 'Inverted Rows (table)',
            'Lat Pulldowns': 'Towel Lat Pulls',
            'Overhead Press': 'Pike Push-ups',
            'Squats': 'Bodyweight Squats',
            'Deadlifts': 'Single Leg Deadlifts',
            'Leg Press': 'Jump Squats',
            'Romanian Deadlifts': 'Single Leg RDL'
        },
        'dumbbells': {
            'Bench Press': 'Dumbbell Press',
            'Incline Press': 'Incline Dumbbell Press',
            'Pull-ups': 'Dumbbell Rows',
            'Rows': 'Dumbbell Rows',
            'Lat Pulldowns': 'Dumbbell Pullovers',
            'Overhead Press': 'Dumbbell Press',
            'Squats': 'Dumbbell Squats',
            'Deadlifts': 'Dumbbell Deadlifts',
            'Leg Press': 'Dumbbell Lunges'
        }
    };

    // Update plan section with randomized exercises based on user input
    const updatePlanSection = (section, name, goal, split, access, equipment, knowledge) => {
        const workoutPlan = document.getElementById('workout-plan');
        const plan = generateRandomWorkoutPlan(split, goal, knowledge, access, equipment);
        
        let planHTML = `<h3>Welcome ${name}! Here's your ${goal} plan:</h3>`;
        
        if (access === 'home') {
            planHTML += `<p style="color: #ff0000; font-weight: bold;">🏠 Home Workout Plan - Equipment: ${equipment || 'Bodyweight'}</p>`;
        } else {
            planHTML += `<p style="color: #ff0000; font-weight: bold;">🏋️ Gym Workout Plan</p>`;
        }
        
        planHTML += `<div class="workout-refresh">
            <button onclick="refreshWorkoutPlan('${split}', '${goal}', '${knowledge}', '${access}', '${equipment}')" class="refresh-btn">
                <i class="fas fa-sync-alt"></i> Get New Random Plan
            </button>
        </div>`;
        
        Object.entries(plan).forEach(([day, exercises]) => {
            planHTML += `
                <div class="workout-day">
                    <h3>${day}</h3>
                    <ul class="exercise-list">
                        ${exercises.map(exercise => {
                            let actualExercise = exercise;
                            if (access === 'home' && equipment !== 'full') {
                                const alternatives = homeAlternatives[equipment] || homeAlternatives['none'];
                                actualExercise = alternatives[exercise] || exercise;
                            }
                            return `<li>${actualExercise} - 3 sets x 8-12 reps</li>`;
                        }).join('')}
                    </ul>
                </div>
            `;
        });
        
        workoutPlan.innerHTML = planHTML;
        
        // Update benefits section
        updateBenefitsSection();
    };

    // Function to refresh workout plan with user input
    window.refreshWorkoutPlan = (split, goal, knowledge, access, equipment) => {
        const workoutPlan = document.getElementById('workout-plan');
        const plan = generateRandomWorkoutPlan(split, goal, knowledge, access, equipment);
        
        let planHTML = `<h3>Here's your refreshed ${goal} plan (${knowledge} level):</h3>`;
        
        if (access === 'home') {
            planHTML += `<p style="color: #ff0000; font-weight: bold;">🏠 Home Workout Plan - Equipment: ${equipment || 'Bodyweight'}</p>`;
        } else {
            planHTML += `<p style="color: #ff0000; font-weight: bold;">🏋️ Gym Workout Plan</p>`;
        }
        
        planHTML += `<div class="workout-refresh">
            <button onclick="refreshWorkoutPlan('${split}', '${goal}', '${knowledge}', '${access}', '${equipment}')" class="refresh-btn">
                <i class="fas fa-sync-alt"></i> Get New Random Plan
            </button>
        </div>`;
        
        Object.entries(plan).forEach(([day, exercises]) => {
            planHTML += `
                <div class="workout-day">
                    <h3>${day}</h3>
                    <ul class="exercise-list">
                        ${exercises.map(exercise => {
                            let actualExercise = exercise;
                            if (access === 'home' && equipment !== 'full') {
                                const alternatives = homeAlternatives[equipment] || homeAlternatives['none'];
                                actualExercise = alternatives[exercise] || exercise;
                            }
                            return `<li>${actualExercise} - 3 sets x 8-12 reps</li>`;
                        }).join('')}
                    </ul>
                </div>
            `;
        });
        
        workoutPlan.innerHTML = planHTML;
    };

    // Update diet plan section with randomized meals based on user input
    const updateDietSection = (section, diet, budget, goal) => {
        const dietPlan = document.getElementById('diet-plan');
        const plan = getRandomDietPlan(diet, goal, budget);
        
        let dietHTML = `<h3>Your ${diet} diet plan for ${goal} (Budget: ₹${budget}/day):</h3>`;
        
        dietHTML += `<div class="diet-refresh">
            <button onclick="refreshDietPlan('${diet}', '${goal}', '${budget}')" class="refresh-btn">
                <i class="fas fa-sync-alt"></i> Get New Random Diet Plan
            </button>
        </div>`;
        
        Object.entries(plan).forEach(([meal, options]) => {
            const mealImages = {
                breakfast: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
                lunch: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
                dinner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
                snacks: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop'
            };
            
            dietHTML += `
                <div class="diet-meal">
                    <img src="${mealImages[meal]}" alt="${meal}" class="diet-meal-image" onerror="this.src='https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'">
                    <div class="diet-meal-content">
                        <h4>${meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                        <ul>
                            ${options.map(option => `<li>${typeof option === 'object' ? option.name : option}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });
        
        dietPlan.innerHTML = dietHTML;
    };

    // Function to refresh diet plan with user input
    window.refreshDietPlan = (diet, goal, budget) => {
        const dietPlan = document.getElementById('diet-plan');
        const plan = getRandomDietPlan(diet, goal, budget);
        
        let dietHTML = `<h3>Your refreshed ${diet} diet plan for ${goal} (Budget: ₹${budget}/day):</h3>`;
        
        dietHTML += `<div class="diet-refresh">
            <button onclick="refreshDietPlan('${diet}', '${goal}', '${budget}')" class="refresh-btn">
                <i class="fas fa-sync-alt"></i> Get New Random Diet Plan
            </button>
        </div>`;
        
        Object.entries(plan).forEach(([meal, options]) => {
            const mealImages = {
                breakfast: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
                lunch: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
                dinner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
                snacks: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop'
            };
            
            dietHTML += `
                <div class="diet-meal">
                    <img src="${mealImages[meal]}" alt="${meal}" class="diet-meal-image" onerror="this.src='https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'">
                    <div class="diet-meal-content">
                        <h4>${meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                        <ul>
                            ${options.map(option => `<li>${typeof option === 'object' ? option.name : option}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });
        
        dietPlan.innerHTML = dietHTML;
    };

    // Update benefits section
    const updateBenefitsSection = () => {
        const benefitsContent = document.getElementById('benefits-content');
        let benefitsHTML = '<h3>Exercise Benefits & Timeline:</h3>';
        
        Object.entries(exercises).forEach(([category, exerciseList]) => {
            benefitsHTML += `<h4>${category.charAt(0).toUpperCase() + category.slice(1)} Exercises:</h4>`;
            exerciseList.forEach(exercise => {
                benefitsHTML += `
                    <div class="exercise">
                        <img src="${exercise.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'}" alt="${exercise.name}" class="exercise-image" onerror="this.src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'">
                        <div class="exercise-content">
                            <h3>${exercise.name}</h3>
                            <p><strong>Benefits:</strong> ${exercise.benefits}</p>
                            <p><strong>Visible Results:</strong> ${exercise.days} days</p>
                        </div>
                    </div>
                `;
            });
        });
        
        benefitsContent.innerHTML = benefitsHTML;
    };

    // AI Chatbot Functions
    window.toggleChatbot = () => {
        const chatbot = document.getElementById('ai-chatbot');
        chatbotOpen = !chatbotOpen;
        
        if (chatbotOpen) {
            chatbot.classList.remove('hidden');
            document.getElementById('chatbot-input').focus();
        } else {
            chatbot.classList.add('hidden');
        }
    };

    window.sendChatMessage = async () => {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        addChatMessage(message, 'user');
        input.value = '';
        
        // Show loading
        showChatLoading(true);
        
        try {
            console.log('Sending chat message to AI:', message);
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: message,
                    userContext: window.userData || null
                })
            });
            
            const data = await response.json();
            console.log('AI Chat response:', data);
            
            if (response.ok) {
                addChatMessage(data.response, 'bot');
            } else {
                console.error('AI Chat error:', data);
                addChatMessage('Sorry, I\'m having trouble right now: ' + (data.message || 'Unknown error'), 'bot');
            }
        } catch (error) {
            console.error('Chat error:', error);
            addChatMessage('Sorry, I\'m having trouble connecting. Please check your internet connection and try again.', 'bot');
        } finally {
            showChatLoading(false);
        }
    };

    window.handleChatKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendChatMessage();
        }
    };

    const addChatMessage = (message, sender) => {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <i class="fas fa-robot"></i>
                <p>${message}</p>
            `;
        } else {
            messageDiv.innerHTML = `
                <p>${message}</p>
                <i class="fas fa-user"></i>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const showChatLoading = (show) => {
        const loading = document.getElementById('chatbot-loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    };

    // User Storage Functions
    const storeUserData = (userData) => {
        const userWithId = {
            ...userData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            workoutPlan: generateRandomWorkoutPlan(userData.split, userData.goal, userData.knowledge, userData.access, userData.equipment),
            dietPlan: getRandomDietPlan(userData.diet, userData.goal, userData.budget)
        };
        
        // Remove existing user with same name if exists
        storedUsers = storedUsers.filter(user => user.name.toLowerCase() !== userData.name.toLowerCase());
        
        // Add new user
        storedUsers.unshift(userWithId);
        
        // Save to localStorage
        localStorage.setItem('ironforge_users', JSON.stringify(storedUsers));
        
        console.log('User stored:', userWithId.name);
    };

    const displayStoredUsers = () => {
        const usersList = document.getElementById('stored-users-list');
        const usersCount = document.getElementById('users-count');
        const clearBtn = document.getElementById('clear-users-btn');
        
        // Ensure modal is hidden when displaying users
        const modal = document.getElementById('user-detail-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        
        usersCount.textContent = `${storedUsers.length} Users Stored`;
        
        if (storedUsers.length === 0) {
            usersList.innerHTML = `
                <div class="no-users-message">
                    <i class="fas fa-user-plus"></i>
                    <p>No users stored yet. Create a fitness plan to add users!</p>
                </div>
            `;
            clearBtn.style.display = 'none';
        } else {
            clearBtn.style.display = 'inline-block';
            usersList.innerHTML = storedUsers.map(user => `
                <div class="user-card" onclick="openUserDetail('${user.id}')">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p><strong>Goal:</strong> ${user.goal}</p>
                        <p><strong>Diet:</strong> ${user.diet}</p>
                        <p><strong>Split:</strong> ${user.split}</p>
                        <div class="user-meta">
                            <span><i class="fas fa-calendar"></i> ${new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="user-actions">
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
            `).join('');
        }
    };

    window.openUserDetail = (userId) => {
        const user = storedUsers.find(u => u.id === userId);
        if (!user) return;
        
        currentSelectedUser = user;
        const modal = document.getElementById('user-detail-modal');
        const modalUserName = document.getElementById('modal-user-name');
        const content = document.getElementById('user-detail-content');
        
        modalUserName.innerHTML = `<i class="fas fa-user"></i> ${user.name}'s Details`;
        
        content.innerHTML = `
            <div class="user-detail-info">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> Personal Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="label">Name:</span>
                            <span class="value">${user.name}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Age:</span>
                            <span class="value">${user.age} years</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Weight:</span>
                            <span class="value">${user.weight} kg</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Height:</span>
                            <span class="value">${user.height} cm</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Goal:</span>
                            <span class="value">${user.goal}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Experience:</span>
                            <span class="value">${user.knowledge}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Location:</span>
                            <span class="value">${user.access}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Equipment:</span>
                            <span class="value">${user.equipment || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Diet:</span>
                            <span class="value">${user.diet}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Budget:</span>
                            <span class="value">₹${user.budget}/day</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-dumbbell"></i> Workout Plan</h4>
                    <div class="workout-plan-detail">
                        ${Object.entries(user.workoutPlan).map(([day, exercises]) => `
                            <div class="workout-day-detail">
                                <h5>${day}</h5>
                                <ul>
                                    ${exercises.map(exercise => {
                                        let actualExercise = exercise;
                                        if (user.access === 'home' && user.equipment !== 'full') {
                                            const alternatives = homeAlternatives[user.equipment] || homeAlternatives['none'];
                                            actualExercise = alternatives[exercise] || exercise;
                                        }
                                        return `<li>${actualExercise}</li>`;
                                    }).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-utensils"></i> Diet Plan</h4>
                    <div class="diet-plan-detail">
                        ${Object.entries(user.dietPlan).map(([meal, options]) => `
                            <div class="diet-meal-detail">
                                <h5>${meal.charAt(0).toUpperCase() + meal.slice(1)}</h5>
                                <ul>
                                    ${options.map(option => `<li>${typeof option === 'object' ? option.name : option}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-calendar"></i> Created</h4>
                    <p>${new Date(user.createdAt).toLocaleString()}</p>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    };

    window.closeUserDetailModal = () => {
        const modal = document.getElementById('user-detail-modal');
        modal.classList.add('hidden');
        currentSelectedUser = null;
    };

    window.deleteStoredUser = () => {
        if (!currentSelectedUser) return;
        
        if (confirm(`Are you sure you want to delete ${currentSelectedUser.name}'s data?`)) {
            storedUsers = storedUsers.filter(user => user.id !== currentSelectedUser.id);
            localStorage.setItem('ironforge_users', JSON.stringify(storedUsers));
            displayStoredUsers();
            closeUserDetailModal();
        }
    };

    window.clearAllStoredUsers = () => {
        if (confirm('Are you sure you want to delete all stored user data? This cannot be undone.')) {
            storedUsers = [];
            localStorage.setItem('ironforge_users', JSON.stringify(storedUsers));
            displayStoredUsers();
        }
    };

    window.filterStoredUsers = () => {
        const searchTerm = document.getElementById('user-search').value.toLowerCase();
        const userCards = document.querySelectorAll('.user-card');
        
        userCards.forEach(card => {
            const userName = card.querySelector('h3').textContent.toLowerCase();
            if (userName.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Initialize stored users display on page load
    if (storedUsers.length > 0) {
        console.log('Loaded stored users:', storedUsers.length);
    }

    // Ensure all modals are hidden on page load
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => {
        modal.classList.add('hidden');
    });

});

