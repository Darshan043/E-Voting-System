import { Request, Response } from 'express';
import db from '../database/connection.js';
import { VotingSettings } from '../database/models.js';

export class SettingsController {
  // Get current voting settings
  static getSettings(req: Request, res: Response) {
    try {
      const settings = db.prepare('SELECT * FROM votingSettings WHERE id = 1').get() as VotingSettings;
      
      if (!settings) {
        // Create default settings if none exist
        const defaultSettings = {
          votingEnabled: true,
          electionTitle: 'Student Council Election 2024',
          electionDescription: 'Vote for your student council representatives',
          startDate: null,
          endDate: null
        };
        
        db.prepare(`
          INSERT INTO votingSettings (id, votingEnabled, electionTitle, electionDescription, startDate, endDate)
          VALUES (1, ?, ?, ?, ?, ?)
        `).run(
          defaultSettings.votingEnabled,
          defaultSettings.electionTitle,
          defaultSettings.electionDescription,
          defaultSettings.startDate,
          defaultSettings.endDate
        );
        
        const newSettings = db.prepare('SELECT * FROM votingSettings WHERE id = 1').get() as VotingSettings;
        return res.json(newSettings);
      }
      
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  // Update voting settings
  static updateSettings(req: Request, res: Response) {
    try {
      const { 
        votingEnabled, 
        electionTitle, 
        electionDescription, 
        startDate, 
        endDate 
      } = req.body;

      const updateSettings = db.prepare(`
        UPDATE votingSettings 
        SET votingEnabled = COALESCE(?, votingEnabled),
            electionTitle = COALESCE(?, electionTitle),
            electionDescription = COALESCE(?, electionDescription),
            startDate = COALESCE(?, startDate),
            endDate = COALESCE(?, endDate),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = 1
      `);

      const result = updateSettings.run(
        votingEnabled, 
        electionTitle, 
        electionDescription, 
        startDate, 
        endDate
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Settings not found' });
      }

      const updatedSettings = db.prepare('SELECT * FROM votingSettings WHERE id = 1').get() as VotingSettings;
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }

  // Toggle voting status
  static toggleVoting(req: Request, res: Response) {
    try {
      const currentSettings = db.prepare('SELECT votingEnabled FROM votingSettings WHERE id = 1').get() as { votingEnabled: boolean };
      
      if (!currentSettings) {
        return res.status(404).json({ error: 'Settings not found' });
      }

      const newStatus = !currentSettings.votingEnabled;
      
      db.prepare(`
        UPDATE votingSettings 
        SET votingEnabled = ?, updatedAt = CURRENT_TIMESTAMP 
        WHERE id = 1
      `).run(newStatus);

      res.json({ 
        message: `Voting ${newStatus ? 'enabled' : 'disabled'} successfully`,
        votingEnabled: newStatus
      });
    } catch (error) {
      console.error('Error toggling voting:', error);
      res.status(500).json({ error: 'Failed to toggle voting status' });
    }
  }

  // Get system statistics
  static getSystemStats(req: Request, res: Response) {
    try {
      const stats = {
        database: {
          students: db.prepare('SELECT COUNT(*) as count FROM students').get(),
          candidates: db.prepare('SELECT COUNT(*) as count FROM candidates').get(),
          votes: db.prepare('SELECT COUNT(*) as count FROM votes').get(),
          votingSettings: db.prepare('SELECT COUNT(*) as count FROM votingSettings').get()
        },
        voting: {
          totalStudents: db.prepare('SELECT COUNT(*) as count FROM students').get(),
          studentsVoted: db.prepare('SELECT COUNT(*) as count FROM students WHERE hasVoted = TRUE').get(),
          studentsRemaining: db.prepare('SELECT COUNT(*) as count FROM students WHERE hasVoted = FALSE').get(),
          turnoutPercentage: db.prepare(`
            SELECT ROUND(
              COUNT(CASE WHEN hasVoted THEN 1 END) * 100.0 / COUNT(*), 2
            ) as percentage FROM students
          `).get(),
          votingEnabled: db.prepare('SELECT votingEnabled FROM votingSettings WHERE id = 1').get()
        },
        candidates: {
          total: db.prepare('SELECT COUNT(*) as count FROM candidates').get(),
          positions: db.prepare('SELECT COUNT(DISTINCT position) as count FROM candidates').get(),
          topCandidate: db.prepare(`
            SELECT name, votes 
            FROM candidates 
            ORDER BY votes DESC 
            LIMIT 1
          `).get()
        },
        timeline: {
          firstVote: db.prepare('SELECT MIN(timestamp) as timestamp FROM votes').get(),
          lastVote: db.prepare('SELECT MAX(timestamp) as timestamp FROM votes').get(),
          peakHour: db.prepare(`
            SELECT 
              strftime('%H', timestamp) as hour,
              COUNT(*) as votes
            FROM votes
            GROUP BY hour
            ORDER BY votes DESC
            LIMIT 1
          `).get()
        }
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching system stats:', error);
      res.status(500).json({ error: 'Failed to fetch system statistics' });
    }
  }

  // Reset entire system (admin only - dangerous operation)
  static resetSystem(req: Request, res: Response) {
    try {
      const { confirmReset } = req.body;
      
      if (confirmReset !== 'RESET_ALL_DATA') {
        return res.status(400).json({ 
          error: 'Invalid confirmation. Please provide confirmReset: "RESET_ALL_DATA"' 
        });
      }

      // Disable voting first
      db.prepare('UPDATE votingSettings SET votingEnabled = FALSE WHERE id = 1').run();

      // Reset all data in transaction
      const resetTransaction = db.transaction(() => {
        // Delete all votes
        db.prepare('DELETE FROM votes').run();
        
        // Reset candidate vote counts
        db.prepare('UPDATE candidates SET votes = 0, updatedAt = CURRENT_TIMESTAMP').run();
        
        // Reset student voting status
        db.prepare('UPDATE students SET hasVoted = FALSE, updatedAt = CURRENT_TIMESTAMP').run();
        
        // Reset settings to default
        db.prepare(`
          UPDATE votingSettings 
          SET votingEnabled = FALSE,
              electionTitle = 'Student Council Election 2024',
              electionDescription = 'Vote for your student council representatives',
              startDate = NULL,
              endDate = NULL,
              updatedAt = CURRENT_TIMESTAMP
          WHERE id = 1
        `).run();
      });

      resetTransaction();

      res.json({ 
        message: 'System reset successfully. All votes cleared and voting disabled.',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error resetting system:', error);
      res.status(500).json({ error: 'Failed to reset system' });
    }
  }

  // Export data (admin only)
  static exportData(req: Request, res: Response) {
    try {
      const { format = 'json' } = req.query;

      const data = {
        exportDate: new Date().toISOString(),
        settings: db.prepare('SELECT * FROM votingSettings WHERE id = 1').get(),
        students: db.prepare('SELECT * FROM students ORDER BY name').all(),
        candidates: db.prepare('SELECT * FROM candidates ORDER BY position, name').all(),
        votes: db.prepare(`
          SELECT 
            v.*,
            s.name as studentName,
            c.name as candidateName,
            c.position
          FROM votes v
          JOIN students s ON v.studentId = s.id
          JOIN candidates c ON v.candidateId = c.id
          ORDER BY v.timestamp
        `).all(),
        summary: {
          totalStudents: db.prepare('SELECT COUNT(*) as count FROM students').get(),
          totalCandidates: db.prepare('SELECT COUNT(*) as count FROM candidates').get(),
          totalVotes: db.prepare('SELECT COUNT(*) as count FROM votes').get(),
          turnout: db.prepare(`
            SELECT ROUND(
              COUNT(CASE WHEN hasVoted THEN 1 END) * 100.0 / COUNT(*), 2
            ) as percentage FROM students
          `).get()
        }
      };

      if (format === 'csv') {
        // For CSV, we'll return vote data in a simple format
        const csvData = data.votes.map(vote => ({
          timestamp: vote.timestamp,
          studentId: vote.studentId,
          studentName: vote.studentName,
          candidateName: vote.candidateName,
          position: vote.position,
          department: vote.department,
          year: vote.year
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=voting_data.csv');
        
        // Simple CSV conversion
        const csvHeader = Object.keys(csvData[0] || {}).join(',');
        const csvRows = csvData.map(row => Object.values(row).join(','));
        const csvContent = [csvHeader, ...csvRows].join('\n');
        
        return res.send(csvContent);
      }

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=voting_data.json');
      res.json(data);
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ error: 'Failed to export data' });
    }
  }
}