import axios from 'axios';

// API base configuration
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle common errors
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to server. Is the backend running?');
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  hasVoted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Candidate {
  id: number;
  name: string;
  position: string;
  department: string;
  year: string;
  manifesto: string;
  votes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vote {
  id?: number;
  studentId: string;
  candidateId: number;
  timestamp?: string;
  department: string;
  year: string;
}

export interface VotingSettings {
  id: number;
  votingEnabled: boolean;
  electionTitle: string;
  electionDescription: string;
  startDate?: string;
  endDate?: string;
  updatedAt?: string;
}

// Student API
export const studentAPI = {
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/students');
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  authenticate: async (credentials: {
    id: string;
    name: string;
    department: string;
    year: string;
  }): Promise<{ message: string; student: Student }> => {
    const response = await api.post('/students/authenticate', credentials);
    return response.data;
  },

  add: async (student: Omit<Student, 'hasVoted' | 'createdAt' | 'updatedAt'>): Promise<Student> => {
    const response = await api.post('/students', student);
    return response.data;
  },

  update: async (id: string, updates: Partial<Student>): Promise<Student> => {
    const response = await api.put(`/students/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  getStats: async (): Promise<{
    total: number;
    voted: number;
    remaining: number;
    turnout: number;
    departmentBreakdown: any[];
  }> => {
    const response = await api.get('/students/stats');
    return response.data;
  },
};

// Candidate API
export const candidateAPI = {
  getAll: async (): Promise<Candidate[]> => {
    const response = await api.get('/candidates');
    return response.data;
  },

  getById: async (id: number): Promise<Candidate> => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  getByPosition: async (position: string): Promise<Candidate[]> => {
    const response = await api.get(`/candidates/position/${encodeURIComponent(position)}`);
    return response.data;
  },

  add: async (candidate: Omit<Candidate, 'id' | 'votes' | 'createdAt' | 'updatedAt'>): Promise<Candidate> => {
    const response = await api.post('/candidates', candidate);
    return response.data;
  },

  update: async (id: number, updates: Partial<Candidate>): Promise<Candidate> => {
    const response = await api.put(`/candidates/${id}`, updates);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },

  getResults: async (): Promise<{
    overall: any[];
    byPosition: any;
    summary: {
      totalCandidates: number;
      totalVotes: { count: number };
      positions: string[];
    };
  }> => {
    const response = await api.get('/candidates/results');
    return response.data;
  },

  resetVotes: async (): Promise<{ message: string }> => {
    const response = await api.post('/candidates/reset-votes');
    return response.data;
  },
};

// Vote API
export const voteAPI = {
  cast: async (vote: Vote): Promise<{ message: string; vote: Vote }> => {
    const response = await api.post('/votes', vote);
    return response.data;
  },

  getAll: async (): Promise<any[]> => {
    const response = await api.get('/votes');
    return response.data;
  },

  getAnalytics: async (): Promise<{
    summary: any;
    breakdown: any;
    topCandidates: any[];
  }> => {
    const response = await api.get('/votes/analytics');
    return response.data;
  },

  getRealTimeData: async (): Promise<{
    recentVotes: any[];
    currentStats: any;
    recentTurnout: any[];
    lastUpdated: string;
  }> => {
    const response = await api.get('/votes/real-time');
    return response.data;
  },

  checkStatus: async (studentId: string): Promise<{
    hasVoted: boolean;
    vote: any | null;
  }> => {
    const response = await api.get(`/votes/status/${studentId}`);
    return response.data;
  },
};

// Settings API
export const settingsAPI = {
  get: async (): Promise<VotingSettings> => {
    const response = await api.get('/settings');
    return response.data;
  },

  update: async (settings: Partial<VotingSettings>): Promise<VotingSettings> => {
    const response = await api.put('/settings', settings);
    return response.data;
  },

  toggleVoting: async (): Promise<{ message: string; votingEnabled: boolean }> => {
    const response = await api.post('/settings/toggle-voting');
    return response.data;
  },

  getStats: async (): Promise<{
    database: any;
    voting: any;
    candidates: any;
    timeline: any;
  }> => {
    const response = await api.get('/settings/stats');
    return response.data;
  },

  reset: async (confirmReset: string): Promise<{ message: string; timestamp: string }> => {
    const response = await api.post('/settings/reset', { confirmReset });
    return response.data;
  },

  exportData: async (format: 'json' | 'csv' = 'json'): Promise<any> => {
    const response = await api.get(`/settings/export?format=${format}`, {
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async (): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    version: string;
  }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;