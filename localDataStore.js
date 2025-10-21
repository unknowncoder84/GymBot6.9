const fs = require('fs');
const path = require('path');

class LocalDataStore {
    constructor() {
        this.dataDir = path.join(__dirname, 'data');
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.initializeDataStore();
    }

    // Initialize data store and create necessary files/directories
    initializeDataStore() {
        try {
            // Create data directory if it doesn't exist
            if (!fs.existsSync(this.dataDir)) {
                fs.mkdirSync(this.dataDir, { recursive: true });
                console.log('📁 Created data directory');
            }

            // Create users.json file if it doesn't exist
            if (!fs.existsSync(this.usersFile)) {
                fs.writeFileSync(this.usersFile, JSON.stringify([], null, 2));
                console.log('📄 Created users.json file');
            }
        } catch (error) {
            console.error('❌ Error initializing data store:', error);
        }
    }

    // Read users from file
    getUsers() {
        try {
            const data = fs.readFileSync(this.usersFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('❌ Error reading users:', error);
            return [];
        }
    }

    // Write users to file
    saveUsers(users) {
        try {
            fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
            return true;
        } catch (error) {
            console.error('❌ Error saving users:', error);
            return false;
        }
    }

    // Find user by username
    findUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }

    // Find user by email
    findUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    // Find user by ID
    findUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    // Create new user
    createUser(userData) {
        try {
            const users = this.getUsers();
            const newUser = {
                id: this.generateId(),
                ...userData,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            
            if (this.saveUsers(users)) {
                return newUser;
            }
            return null;
        } catch (error) {
            console.error('❌ Error creating user:', error);
            return null;
        }
    }

    // Update user
    updateUser(id, updateData) {
        try {
            const users = this.getUsers();
            const userIndex = users.findIndex(user => user.id === id);
            
            if (userIndex === -1) {
                return null;
            }

            users[userIndex] = {
                ...users[userIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            if (this.saveUsers(users)) {
                return users[userIndex];
            }
            return null;
        } catch (error) {
            console.error('❌ Error updating user:', error);
            return null;
        }
    }

    // Delete user
    deleteUser(id) {
        try {
            const users = this.getUsers();
            const filteredUsers = users.filter(user => user.id !== id);
            
            if (filteredUsers.length === users.length) {
                return false; // User not found
            }

            return this.saveUsers(filteredUsers);
        } catch (error) {
            console.error('❌ Error deleting user:', error);
            return false;
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Check if user exists by username or email
    userExists(username, email) {
        const users = this.getUsers();
        return users.some(user => 
            user.username === username || user.email === email
        );
    }

    // Get all users (for admin purposes)
    getAllUsers() {
        return this.getUsers();
    }

    // Get user count
    getUserCount() {
        return this.getUsers().length;
    }

    // Backup data
    backupData() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path.join(this.dataDir, `backup-${timestamp}.json`);
            const users = this.getUsers();
            
            fs.writeFileSync(backupFile, JSON.stringify(users, null, 2));
            console.log(`✅ Data backed up to: ${backupFile}`);
            return backupFile;
        } catch (error) {
            console.error('❌ Error backing up data:', error);
            return null;
        }
    }

    // Clear all data (use with caution)
    clearAllData() {
        try {
            fs.writeFileSync(this.usersFile, JSON.stringify([], null, 2));
            console.log('🗑️ All user data cleared');
            return true;
        } catch (error) {
            console.error('❌ Error clearing data:', error);
            return false;
        }
    }
}

module.exports = LocalDataStore;
