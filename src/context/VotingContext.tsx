import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Student, 
  Candidate, 
  Vote,
  VotingSettings,
  studentAPI, 
  candidateAPI, 
  voteAPI, 
  settingsAPI 
} from '../services/api';

interface VotingContextType {
  students: Student[];
  candidates: Candidate[];
  votes: Vote[];
  currentUser: Student | null;
  votingEnabled: boolean;
  loading: boolean;
  error: string | null;
  settings: VotingSettings | null;
  setCurrentUser: (user: Student | null) => void;
  addVote: (vote: Vote) => Promise<void>;
  toggleVoting: () => Promise<void>;
  resetVotes: () => Promise<void>;
  authenticateStudent: (id: string, name: string, department: string, year: string) => Promise<Student | null>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export function VotingProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [votingEnabled, setVotingEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<VotingSettings | null>(null);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [studentsData, candidatesData, votesData, settingsData] = await Promise.all([
        studentAPI.getAll(),
        candidateAPI.getAll(),
        voteAPI.getAll(),
        settingsAPI.get()
      ]);

      setStudents(studentsData);
      setCandidates(candidatesData);
      setVotes(votesData);
      setSettings(settingsData);
      setVotingEnabled(settingsData.votingEnabled);

      console.log('✅ Data loaded successfully');
    } catch (err: any) {
      console.error('❌ Failed to load data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const authenticateStudent = async (id: string, name: string, department: string, year: string): Promise<Student | null> => {
    try {
      setError(null);
      const response = await studentAPI.authenticate({ id, name, department, year });
      return response.student;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Authentication failed';
      setError(errorMessage);
      console.error('❌ Authentication failed:', errorMessage);
      return null;
    }
  };

  const addVote = async (vote: Vote) => {
    try {
      setError(null);
      await voteAPI.cast(vote);
      
      // Refresh data to get updated vote counts
      await refreshData();
      
      console.log('✅ Vote cast successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to cast vote';
      setError(errorMessage);
      console.error('❌ Failed to cast vote:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const toggleVoting = async () => {
    try {
      setError(null);
      const response = await settingsAPI.toggleVoting();
      setVotingEnabled(response.votingEnabled);
      
      // Refresh settings
      const updatedSettings = await settingsAPI.get();
      setSettings(updatedSettings);
      
      console.log(`✅ Voting ${response.votingEnabled ? 'enabled' : 'disabled'}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to toggle voting';
      setError(errorMessage);
      console.error('❌ Failed to toggle voting:', errorMessage);
    }
  };

  const resetVotes = async () => {
    try {
      setError(null);
      await candidateAPI.resetVotes();
      
      // Refresh data to reflect the reset
      await refreshData();
      
      console.log('✅ Votes reset successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to reset votes';
      setError(errorMessage);
      console.error('❌ Failed to reset votes:', errorMessage);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    students,
    candidates,
    votes,
    currentUser,
    votingEnabled,
    loading,
    error,
    settings,
    setCurrentUser,
    addVote,
    toggleVoting,
    resetVotes,
    authenticateStudent,
    refreshData,
    clearError
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