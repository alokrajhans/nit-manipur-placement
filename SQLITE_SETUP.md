# SQLite Database Setup Guide

This project now uses **SQLite by default** - a lightweight, file-based database with **zero external dependencies**.

## ✅ What is SQLite?

SQLite is:
- **Lightweight** - Single file database (automatic setup)
- **Self-contained** - No server to run or manage
- **Zero configuration** - Works out of the box
- **Perfect for development** - Ideal for small to medium projects
- **Production-ready** - Used by billions of applications

## 🚀 Quick Start

### No Setup Needed! 

SQLite works **automatically** when you start the server:

```bash
cd server
npm install
npm run build
npm start
```

**That's it!** Your database will be created automatically at:
```
server/data/nit-placement.db
```

## 📁 Project Structure

```
nit-manipur-placement/
├── server/
│   ├── src/
│   │   ├── datasources/
│   │   │   ├── sqlite.datasource.ts      ← SQLite configuration
│   │   │   └── mysql.datasource.ts       ← MySQL (optional)
│   │   └── ...
│   ├── data/
│   │   └── nit-placement.db              ← Your database (auto-created)
│   ├── .env
│   └── package.json
└── ...
```

## 🔧 Environment Variables

```env
# Database Type (sqlite or mysql)
DB_TYPE=sqlite

# That's all you need! SQLite requires no configuration.
# Database file: data/nit-placement.db (auto-created)
```

## 📊 Database Schema

The schema is automatically created from your models:

```
Models:
├── User
├── OngoingJobs
├── AppliedJobs
├── CompaniesVisited
├── InterestedStudents
└── SelectedStudents

Tables auto-created from models ✅
```

## 🔄 Database Migrations

### Initialize Database

```bash
# Run from server directory
npm run build

# Option 1: Alter existing schema (updates if exists)
npm run migrate

# Option 2: Rebuild from scratch (drops and recreates)
npm run migrate -- --rebuild
```

### What Happens

1. Reads all model definitions
2. Creates/updates SQLite database tables
3. Sets up relationships and constraints
4. Ready to use!

## 💾 Backing Up Your Data

### SQLite Database File

Your entire database is a single file:

```bash
# Backup
cp server/data/nit-placement.db server/data/nit-placement.db.backup

# Restore
cp server/data/nit-placement.db.backup server/data/nit-placement.db
```

### Using Git (Optional)

To version control your database:

```bash
# Add to .gitignore (recommended for dev)
echo "server/data/*.db" >> .gitignore
echo "!server/data/.gitkeep" >> .gitignore

# Or track it (optional)
git add server/data/nit-placement.db
git commit -m "Add database backup"
```

## 🔄 Switching to MySQL (Optional)

If you need a server-based database later:

### 1. Set Environment Variable

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=placement_db
DB_PORT=3306
```

### 2. Ensure MySQL is Running

```bash
# macOS (Homebrew)
brew services start mysql

# Docker
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password mysql:8.0

# Linux
sudo systemctl start mysql
```

### 3. Run Migrations

```bash
npm run migrate
```

### 4. Restart Server

```bash
npm start
```

## 🎯 SQLite vs MySQL

| Feature | SQLite | MySQL |
|---------|--------|-------|
| **Setup** | Automatic ✅ | Need server |
| **Config** | None ✅ | Requires connection string |
| **File Size** | ~1-50 MB | Remote |
| **Concurrent Users** | Low (~10-100) | High (unlimited) |
| **Performance** | Fast for < 100K records | Optimized for large data |
| **Backup** | Copy file | Database dump |
| **Best For** | Development | Production with many users |

## 📊 Database Inspection

### View Database with CLI

```bash
# Install SQLite CLI (macOS)
brew install sqlite

# Or Windows/Linux
# Download from: https://www.sqlite.org/download.html

# Open database
sqlite3 server/data/nit-placement.db

# List tables
.tables

# View table schema
.schema users

# Query data
SELECT * FROM users;

# Exit
.quit
```

### Using GUI Tools

Popular SQLite GUI tools:
- **DB Browser for SQLite** - Free, cross-platform
- **DBeaver** - Full-featured, supports many databases
- **VS Code SQLite Extension** - Direct in editor

## 🚀 Deployment

### To Render or Similar

1. **No database setup needed** - Just deploy!
2. Database file travels with your code
3. Data persists between deployments (if persistent storage enabled)

### For Production (Recommended)

For production, consider:
- **Persistent volume** - Keep database between deployments
- **Database backup service** - Automated backups
- **Consider MySQL** - For higher concurrency

## 🛡️ Important Notes

### File Permissions

SQLite needs write permission to the data folder:

```bash
# Ensure write permission
chmod 755 server/data
```

### Data Persistence

- **Local development**: Data persists automatically
- **Render/Heroku**: Use ephemeral file systems OR persistent volumes
- **Docker**: Mount volume or use SQLite with persistent storage

### Size Limits

- SQLite can handle millions of records
- Good up to ~100GB
- For larger projects, switch to MySQL/PostgreSQL

## 🔍 Troubleshooting

### "Database is locked"

```
Error: database is locked
```

**Cause**: Multiple processes accessing database

**Solution**:
```bash
# Stop running processes
# Restart your server
npm start
```

### "Can't find nit-placement.db"

```
Error: ENOENT: no such file or directory
```

**Cause**: Data folder doesn't exist

**Solution**:
```bash
# Create data folder
mkdir -p server/data

# Run migrations
npm run migrate

# Restart
npm start
```

### "Permission denied"

```
Error: EACCES: permission denied
```

**Solution**:
```bash
# Fix permissions
chmod 755 server/data
chmod 644 server/data/*.db
```

## 📈 Performance Tips

1. **Keep data folder on fast drive** - SSD recommended
2. **Regular backups** - Copy .db file daily
3. **Monitor file size** - Check monthly growth
4. **Use indexes** - Already set up in models
5. **Clear old data** - Archive old records periodically

## 🔄 Migration Examples

### Create New Table

Add a new model in `src/models/`:

```typescript
@model()
export class NewTable extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  name: string;
}
```

Then run:
```bash
npm run migrate
```

### Add New Column

Modify an existing model:

```typescript
@model()
export class User extends Entity {
  // ... existing properties

  @property({
    type: 'string',
  })
  newColumn?: string;  // ← Add this
}
```

Then run:
```bash
npm run migrate
```

## 📚 Learning Resources

- **SQLite Official**: https://www.sqlite.org/
- **LoopBack SQLite Connector**: https://loopback.io/doc/en/lb3/SQLite-connector.html
- **SQLite Tutorial**: https://www.sqlitetutorial.net/

## ✅ Checklist

- [ ] Database file auto-created ✅
- [ ] Tables auto-created from models ✅
- [ ] Can run migrations ✅
- [ ] Can switch to MySQL if needed ✅
- [ ] Data persists between restarts ✅
- [ ] No external database to manage ✅

## 🎯 Next Steps

1. **Start server**: `npm start`
2. **Check data folder**: `ls server/data/`
3. **Run migrations**: `npm run migrate`
4. **Create test data**: Use your API to add users
5. **Query data**: Use SQLite CLI or GUI tools

---

**Questions?** Check the troubleshooting section or review the SQLite documentation.

Enjoy your lightweight, zero-configuration database! 🎉
