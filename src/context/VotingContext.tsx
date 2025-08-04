import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  hasVoted: boolean;
}

interface Candidate {
  id: number;
  name: string;
  position: string;
  department: string;
  year: string;
  manifesto: string;
  votes: number;
}

interface Vote {
  studentId: string;
  candidateId: number;
  timestamp: string;
  department: string;
  year: string;
}

interface VotingContextType {
  students: Student[];
  candidates: Candidate[];
  votes: Vote[];
  currentUser: Student | null;
  votingEnabled: boolean;
  setCurrentUser: (user: Student | null) => void;
  addVote: (vote: Vote) => void;
  toggleVoting: () => void;
  resetVotes: () => void;
  authenticateStudent: (id: string, name: string, department: string, year: string) => Student | null;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

const initialStudents: Student[] = [
  { id: '2117240020001', name: 'AAKASH B K', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020002', name: 'AARTHI M', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020003', name: 'AASHIDA V', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020004', name: 'ABHILASH M', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020005', name: 'M ABIMANYUE', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020006', name: 'ABINA JERLIN M', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020007', name: 'ABINAYA S G', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020008', name: 'ABINESH S', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020010', name: 'S ABISHEK', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020011', name: 'ADARSH H', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020012', name: 'ADITYA PARTHASARATHY', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020013', name: 'AFSA R', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020014', name: 'AISWARYAA BABU', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020015', name: 'A AKASH', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020016', name: 'AKSHARA P', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020017', name: 'AKSHAY V', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020018', name: 'AKSHAYA K', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020019', name: 'AKSHAYA M', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020020', name: 'AKSHAYA R L', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020021', name: 'AKSHAYA DARSHINI N', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020022', name: 'AKSHITHA P', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020023', name: 'AKSHITHA S', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020024', name: 'AMBATI JYOTHITHA', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020025', name: 'AMUDHAN M', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020026', name: 'ANISHA PATHAK', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020027', name: 'ANISKA S P', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020028', name: 'ANJASRI V', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020029', name: 'ANUSHA B', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020030', name: 'ANUSHRI R', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020031', name: 'ARAVINDRAJ D', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020032', name: 'ARNAV KUMAR R', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020033', name: 'ARVIND N', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020034', name: 'ASANTHIKA A', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020035', name: 'ASEEMA S', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020036', name: 'ASHA A', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020037', name: 'ASHWIN G', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020038', name: 'ASIN D', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020039', name: 'ASWANTHAR M', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020040', name: 'ASWIN R', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020041', name: 'ASWIN KUMAR E N', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020042', name: 'ASWINI M', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020043', name: 'ATHISHWAN J', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020044', name: 'AUSTIN JOSHUA M', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020045', name: 'AVINESHWARAN A', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020046', name: 'BALAJI M R', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020047', name: 'BALAJI P', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020048', name: 'BASKAR J', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020049', name: 'BAYATHARINI R', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020050', name: 'BHARANIDHARAN R', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020051', name: 'BHUVANESHWARAN S', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020052', name: 'CATHERIN JENIRA I', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020053', name: 'CHARUMATHI K', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020054', name: 'CHRIS ALAN', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020055', name: 'CHRIS MELVYN RAJ P', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020056', name: 'CHRISTOPHER J', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020057', name: 'DARSHAN A R', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020058', name: 'DARSHAN B', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020059', name: 'DEBORHAL L', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020060', name: 'DEEPA SHREE C', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020061', name: 'DEEPESH V', department: 'CSE', year: '2', hasVoted: false },
  { id: '2117240020062', name: 'DEEPIKA P', department: 'CSE', year: '2', hasVoted: false },
];

const initialCandidates: Candidate[] = [
  {
    id: 1,
    name: 'B.Dharshan',
    position: 'Student Council President',
    department: 'Computer Science Engineering',
    year: '2nd Year',
    manifesto: 'Committed to improving campus facilities, enhancing student welfare, and creating a more inclusive environment for all students.',
    votes: 0
  },
  {
    id: 2,
    name: 'Aravind Raj',
    position: 'Student Council President',
    department: 'Information Technology',
    year: '2nd Year',
    manifesto: 'Focused on digital transformation, innovation in education, and bridging the gap between academia and industry.',
    votes: 0
  },
  {
    id: 3,
    name: 'Aswin R',
    position: 'Student Council President',
    department: 'Electronics & Communication',
    year: '2nd Year',
    manifesto: 'Dedicated to enhancing student-faculty relationships, improving communication, and fostering academic excellence.',
    votes: 0
  },
  {
    id: 4,
    name: 'Assema',
    position: 'Student Council President',
    department: 'Mechanical Engineering',
    year: '2nd Year',
    manifesto: 'Advocating for sustainable campus development, environmental consciousness, and modern infrastructure upgrades.',
    votes: 0
  }
];

export function VotingProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [votingEnabled, setVotingEnabled] = useState(true);

  const authenticateStudent = (id: string, name: string, department: string, year: string): Student | null => {
    const student = students.find(s => s.id === id);
    
    if (!student) return null;
    if (student.name.toLowerCase() !== name.toLowerCase()) return null;
    if (student.department !== department || student.year !== year) return null;
    if (student.hasVoted) return null;
    
    return student;
  };

  const addVote = (vote: Vote) => {
    setVotes(prev => [...prev, vote]);
    setCandidates(prev => prev.map(c => 
      c.id === vote.candidateId ? { ...c, votes: c.votes + 1 } : c
    ));
    setStudents(prev => prev.map(s => 
      s.id === vote.studentId ? { ...s, hasVoted: true } : s
    ));
  };

  const toggleVoting = () => {
    setVotingEnabled(prev => !prev);
  };

  const resetVotes = () => {
    setVotes([]);
    setCandidates(prev => prev.map(c => ({ ...c, votes: 0 })));
    setStudents(prev => prev.map(s => ({ ...s, hasVoted: false })));
  };

  const value = {
    students,
    candidates,
    votes,
    currentUser,
    votingEnabled,
    setCurrentUser,
    addVote,
    toggleVoting,
    resetVotes,
    authenticateStudent
  };

  return (
    <VotingContext.Provider value={value}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
}