export interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  hasVoted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: number;
  name: string;
  position: string;
  department: string;
  year: string;
  manifesto: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: number;
  studentId: string;
  candidateId: number;
  timestamp: string;
  department: string;
  year: string;
}

export interface VotingSettings {
  id: number;
  votingEnabled: boolean;
  electionTitle: string;
  electionDescription: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
}

export const createTablesSQL = `
  -- Students table
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    hasVoted BOOLEAN DEFAULT FALSE,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Candidates table
  CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    manifesto TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Votes table
  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId TEXT NOT NULL,
    candidateId INTEGER NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    FOREIGN KEY (studentId) REFERENCES students(id),
    FOREIGN KEY (candidateId) REFERENCES candidates(id),
    UNIQUE(studentId) -- Ensure one vote per student
  );

  -- Voting settings table
  CREATE TABLE IF NOT EXISTS votingSettings (
    id INTEGER PRIMARY KEY,
    votingEnabled BOOLEAN DEFAULT TRUE,
    electionTitle TEXT DEFAULT 'Student Council Election',
    electionDescription TEXT DEFAULT 'Vote for your student representatives',
    startDate TEXT,
    endDate TEXT,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Insert default voting settings
  INSERT OR IGNORE INTO votingSettings (id, votingEnabled, electionTitle, electionDescription)
  VALUES (1, TRUE, 'Student Council Election 2024', 'Vote for your student council representatives');

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
  CREATE INDEX IF NOT EXISTS idx_students_hasVoted ON students(hasVoted);
  CREATE INDEX IF NOT EXISTS idx_candidates_position ON candidates(position);
  CREATE INDEX IF NOT EXISTS idx_votes_studentId ON votes(studentId);
  CREATE INDEX IF NOT EXISTS idx_votes_candidateId ON votes(candidateId);
  CREATE INDEX IF NOT EXISTS idx_votes_timestamp ON votes(timestamp);
`;