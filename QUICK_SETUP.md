# Quick Setup Guide - IronForge Pro

## 🔑 API Key Configuration

### File Location: `.env` 
**Path**: `c:\Users\91859\Downloads\GT\.env`

### Line to Edit: **Line 25**
```env
DEEPSEEK_API_KEY=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
```

**Note**: Your API key is already configured and working! No changes needed.

## 📊 Database Access

### Method 1: Web Viewer (Easiest)
**URL**: http://localhost:8080/database

**Steps**:
1. Make sure server is running (`npm start`)
2. Open browser
3. Go to: `http://localhost:8080/database`
4. View all user data in real-time

### Method 2: Database File Location
**Path**: `c:\Users\91859\Downloads\GT\fitness_app.db`

**Tools to Open**:
- **DB Browser for SQLite** (Download: https://sqlitebrowser.org/)
- **VS Code with SQLite Viewer extension**
- **Command line**: `sqlite3 fitness_app.db`

## 🚀 Quick Start

1. **Start Server**:
   ```bash
   cd "c:\Users\91859\Downloads\GT"
   npm start
   ```

2. **Open App**: http://localhost:8080/

3. **View Database**: http://localhost:8080/database

4. **API Key Location**: Line 25 in `.env` file

## ✅ Current Status
- ✅ API Key: Already configured
- ✅ Database: SQLite running locally  
- ✅ AI Features: Fully functional
- ✅ Web Viewer: Available at /database