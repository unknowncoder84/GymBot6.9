# Database Access Guide - IronForge Pro

## Overview
Your IronForge Pro application now uses **SQLite database** instead of MongoDB. This provides better local storage, easier access, and no need for external database services.

## Database File Location
The SQLite database file is located at:
```
c:\Users\91859\Downloads\GT\fitness_app.db
```

## Methods to View and Access Database

### 1. Built-in Web Database Viewer (Recommended)
**Access URL**: http://localhost:8080/database

**Features**:
- ✅ Real-time data viewing
- ✅ User statistics dashboard
- ✅ Filter and search functionality
- ✅ Export data to CSV
- ✅ Clear database option
- ✅ Auto-refresh every 30 seconds
- ✅ Red/black theme matching your app

**How to Access**:
1. Make sure your server is running (`npm start`)
2. Open browser and go to: `http://localhost:8080/database`
3. View all user data in a professional interface

### 2. DB Browser for SQLite (Free Desktop Tool)

**Download**: https://sqlitebrowser.org/

**Steps**:
1. Download and install DB Browser for SQLite
2. Open the application
3. Click "Open Database"
4. Navigate to: `c:\Users\91859\Downloads\GT\fitness_app.db`
5. Click "Browse Data" tab to view user records

**Features**:
- Browse all data in table format
- Execute SQL queries
- Export data to various formats
- Edit data directly
- View database structure

### 3. Visual Studio Code Extension

**Extension**: SQLite Viewer

**Steps**:
1. Install "SQLite Viewer" extension in VS Code
2. Open your project folder in VS Code
3. Right-click on `fitness_app.db` file
4. Select "Open with SQLite Viewer"

### 4. Command Line Access

**Using SQLite3 CLI**:
```bash
# Navigate to your project directory
cd "c:\Users\91859\Downloads\GT"

# Open database with SQLite3
sqlite3 fitness_app.db

# View all tables
.tables

# View all user data
SELECT * FROM users;

# View user count
SELECT COUNT(*) FROM users;

# View recent users
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

# Exit
.quit
```

### 5. API Endpoints for Data Access

**Get All Users**:
```
GET http://localhost:8080/api/users
```

**Clear Database**:
```
POST http://localhost:8080/api/clear-database
```

## Database Schema

### Users Table Structure
```sql
CREATE TABLE users (
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
);
```

### Sample Data Structure
```json
{
  "id": 1,
  "name": "John Doe",
  "age": 25,
  "weight": 75.5,
  "height": 180,
  "goal": "bulk",
  "knowledge": "intermediate",
  "access": "gym",
  "equipment": "none",
  "diet": "non-veg",
  "split": "ppl",
  "budget": 100,
  "created_at": "2024-01-20 10:30:00"
}
```

## Useful SQL Queries

### User Statistics
```sql
-- Total users
SELECT COUNT(*) as total_users FROM users;

-- Users by goal
SELECT goal, COUNT(*) as count 
FROM users 
GROUP BY goal 
ORDER BY count DESC;

-- Users by diet preference
SELECT diet, COUNT(*) as count 
FROM users 
GROUP BY diet;

-- Average age and weight
SELECT 
    AVG(age) as avg_age,
    AVG(weight) as avg_weight,
    AVG(height) as avg_height
FROM users;

-- Recent registrations (last 7 days)
SELECT * FROM users 
WHERE created_at >= datetime('now', '-7 days')
ORDER BY created_at DESC;
```

### Data Management
```sql
-- Find specific user
SELECT * FROM users WHERE name LIKE '%John%';

-- Update user data
UPDATE users SET weight = 80 WHERE id = 1;

-- Delete specific user
DELETE FROM users WHERE id = 1;

-- Clear all data
DELETE FROM users;
```

## Backup and Restore

### Create Backup
```bash
# Copy the database file
copy "c:\Users\91859\Downloads\GT\fitness_app.db" "c:\Users\91859\Downloads\GT\backup_fitness_app.db"
```

### Restore from Backup
```bash
# Replace current database with backup
copy "c:\Users\91859\Downloads\GT\backup_fitness_app.db" "c:\Users\91859\Downloads\GT\fitness_app.db"
```

### Export to SQL
```bash
# Export database to SQL file
sqlite3 fitness_app.db .dump > backup.sql

# Import from SQL file
sqlite3 new_fitness_app.db < backup.sql
```

## Security Notes

1. **Local Storage**: Database is stored locally, no external dependencies
2. **File Access**: Only accessible to local system users
3. **No Authentication**: Built-in viewer has no authentication (add if needed for production)
4. **Backup Important**: Regular backups recommended for production use

## Troubleshooting

### Database Locked Error
```bash
# If database is locked, restart the server
# Make sure no other applications are accessing the database
```

### Database Not Found
```bash
# Database is created automatically when server starts
# If missing, restart the server and it will recreate
```

### Permission Issues
```bash
# Ensure the application has write permissions to the directory
# Run terminal as administrator if needed
```

## Monitoring and Maintenance

### Best Practices
1. **Regular Backups**: Copy database file weekly
2. **Monitor Size**: Check database file size periodically
3. **Clean Old Data**: Remove test data periodically
4. **Performance**: SQLite handles thousands of records efficiently

### Performance Tips
- SQLite is fast for read operations
- Batch inserts for better performance
- Regular VACUUM operations for optimization
- Index on frequently queried columns

## Quick Access Summary

| Method | URL/Command | Description |
|--------|-------------|-------------|
| **Web Viewer** | `http://localhost:8080/database` | **Best option** - Built-in web interface |
| **API** | `http://localhost:8080/api/users` | JSON data via API |
| **File Location** | `c:\Users\91859\Downloads\GT\fitness_app.db` | Direct file access |
| **DB Browser** | Download from sqlitebrowser.org | Desktop application |
| **VS Code** | SQLite Viewer extension | IDE integration |

---

**Recommended**: Use the built-in web viewer at `http://localhost:8080/database` for the best experience with real-time updates and filtering capabilities.