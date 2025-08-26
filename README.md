# Digital Voting System

A comprehensive digital voting system built with React, TypeScript, Express.js, and SQLite. This system provides secure student authentication, real-time vote tracking, analytics, and administrative controls.

## Features

### 🗳️ Core Voting Features
- **Secure Authentication**: Student ID, name, department, and year verification
- **Real-time Voting**: Live vote casting with immediate updates
- **Vote Validation**: Prevents duplicate voting and validates eligibility
- **Anonymous Voting**: Vote records don't expose individual choices publicly

### 📊 Analytics & Reporting
- **Live Analytics**: Real-time voting statistics and trends
- **Department Breakdown**: Voting participation by department
- **Turnout Tracking**: Monitor voting participation rates
- **Election Results**: Comprehensive result views with percentages

### 🔧 Administration
- **Admin Panel**: Full administrative control interface
- **Voting Control**: Enable/disable voting system
- **Data Management**: Add/edit students and candidates
- **System Reset**: Reset votes while preserving base data
- **Data Export**: Export voting data in JSON/CSV formats

### 💾 Database Storage
- **Persistent Data**: SQLite database for reliable data storage
- **Automatic Migration**: Initial data setup on first run
- **Backup-friendly**: File-based database for easy backups
- **Performance Optimized**: Indexed queries for fast responses

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: SQLite with better-sqlite3
- **API**: RESTful API with comprehensive error handling
- **Build Tools**: Vite, ESLint, PostCSS

## Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd voting-system
   npm install
   ```

2. **Start the Application**
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 5000) and frontend development server (port 5173).

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/health

## Database Schema

The system automatically creates the following tables:

### Students Table
- `id` (PRIMARY KEY): Student ID number
- `name`: Full student name
- `department`: Student's department (CSE, IT, ECE, etc.)
- `year`: Academic year
- `hasVoted`: Boolean flag for voting status
- `createdAt`, `updatedAt`: Timestamps

### Candidates Table
- `id` (AUTO INCREMENT): Unique candidate identifier
- `name`: Candidate's full name
- `position`: Electoral position (e.g., "Student Council President")
- `department`: Candidate's department
- `year`: Candidate's academic year
- `manifesto`: Campaign manifesto/description
- `votes`: Current vote count
- `createdAt`, `updatedAt`: Timestamps

### Votes Table
- `id` (AUTO INCREMENT): Unique vote identifier
- `studentId`: Reference to voting student
- `candidateId`: Reference to chosen candidate
- `timestamp`: When the vote was cast
- `department`, `year`: Voter demographics
- **Constraints**: One vote per student (UNIQUE constraint)

### Voting Settings Table
- `id`: Settings identifier (always 1)
- `votingEnabled`: Global voting system toggle
- `electionTitle`: Current election title
- `electionDescription`: Election description
- `startDate`, `endDate`: Election schedule
- `updatedAt`: Last modified timestamp

## API Endpoints

### Students API (`/api/students`)
- `GET /` - Get all students
- `GET /:id` - Get student by ID
- `POST /` - Add new student
- `PUT /:id` - Update student
- `DELETE /:id` - Delete student
- `POST /authenticate` - Authenticate student login
- `GET /stats` - Get voting statistics

### Candidates API (`/api/candidates`)
- `GET /` - Get all candidates
- `GET /:id` - Get candidate by ID
- `POST /` - Add new candidate
- `PUT /:id` - Update candidate
- `DELETE /:id` - Delete candidate
- `GET /results` - Get election results
- `POST /reset-votes` - Reset all votes

### Votes API (`/api/votes`)
- `POST /` - Cast a vote
- `GET /` - Get all votes (admin)
- `GET /analytics` - Get vote analytics
- `GET /real-time` - Get real-time data
- `GET /status/:studentId` - Check if student voted

### Settings API (`/api/settings`)
- `GET /` - Get current settings
- `PUT /` - Update settings
- `POST /toggle-voting` - Toggle voting on/off
- `GET /stats` - Get system statistics
- `POST /reset` - Reset entire system
- `GET /export` - Export data

## Usage Guide

### For Students

1. **Authentication**
   - Navigate to the authentication page
   - Enter your student ID, full name, department, and year
   - All details must match exactly as registered

2. **Voting**
   - After authentication, you'll see available candidates
   - Review candidate manifestos
   - Select your preferred candidate
   - Confirm your vote (this action is irreversible)

3. **Verification**
   - After voting, you'll receive confirmation
   - You cannot vote again in the same election

### For Administrators

1. **Access Admin Panel**
   - Navigate to `/admin` in your browser
   - Use the admin interface for system management

2. **Manage Students**
   - Add new students with ID, name, department, year
   - Edit existing student information
   - View voting status of all students

3. **Manage Candidates**
   - Add candidates with position, department, manifesto
   - Edit candidate information
   - Remove candidates (only if no votes cast)

4. **Monitor Elections**
   - View real-time voting statistics
   - Track turnout by department
   - Monitor voting trends

5. **System Control**
   - Enable/disable voting system
   - Reset votes while keeping student/candidate data
   - Export data for external analysis

## Data Migration

The system includes automatic data migration that runs on first startup:

- **Initial Students**: 62 pre-configured CSE students
- **Initial Candidates**: 4 Student Council President candidates
- **Default Settings**: Election configured and voting enabled

To manually run migration:
```bash
npx tsx server/scripts/migrateData.ts
```

## Database Management

### Backup
The SQLite database file is located at `/voting_system.db`. To backup:
```bash
cp voting_system.db voting_system_backup_$(date +%Y%m%d).db
```

### Reset Database
To completely reset the database:
```bash
rm voting_system.db
npm run server  # Will recreate and migrate data
```

### View Database
Use any SQLite browser or command line:
```bash
sqlite3 voting_system.db
.tables
.schema
```

## Development

### Project Structure
```
├── src/                     # Frontend React application
│   ├── components/          # Reusable UI components
│   ├── context/            # React context providers
│   ├── pages/              # Application pages/routes
│   ├── services/           # API service layer
│   └── styles/             # CSS and styling
├── server/                 # Backend Express application
│   ├── controllers/        # Request handlers
│   ├── database/           # Database models and connection
│   ├── routes/             # API route definitions
│   └── scripts/            # Utility scripts
└── voting_system.db       # SQLite database file
```

### Adding New Features

1. **Database Changes**: Update `server/database/models.ts` and migration scripts
2. **API Endpoints**: Add controllers and routes in respective server folders
3. **Frontend Integration**: Update `src/services/api.ts` and relevant components
4. **State Management**: Modify `src/context/VotingContext.tsx` as needed

### Available Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run client` - Start only frontend (Vite dev server)
- `npm run server` - Start only backend (Express server)
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint checks

## Security Considerations

1. **Input Validation**: All API endpoints validate input data
2. **SQL Injection Protection**: Prepared statements used throughout
3. **Vote Integrity**: Database constraints prevent duplicate voting
4. **Error Handling**: Graceful error responses without exposing internals
5. **Transaction Safety**: Critical operations use database transactions

## Troubleshooting

### Common Issues

1. **"Cannot connect to server"**
   - Ensure backend is running on port 5000
   - Check for port conflicts
   - Verify API proxy configuration in vite.config.ts

2. **"Database locked" errors**
   - Close any open database connections
   - Restart the server
   - Check file permissions on voting_system.db

3. **"Student not found" during authentication**
   - Verify exact name spelling (case-sensitive)
   - Ensure student exists in database
   - Check department and year values

4. **Votes not updating in real-time**
   - Check browser console for API errors
   - Verify backend server is responding
   - Refresh the page to reload data

### Development Tips

1. **Database Inspection**: Use DB Browser for SQLite for GUI access
2. **API Testing**: Use tools like Postman or curl for API testing
3. **Logging**: Check browser console and server terminal for error details
4. **Hot Reload**: Both frontend and backend support hot reload in development

## License

This project is developed for educational purposes. Please ensure compliance with your institution's guidelines when deploying for actual elections.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server and browser console logs
3. Verify database connectivity and data integrity
4. Ensure all dependencies are properly installed