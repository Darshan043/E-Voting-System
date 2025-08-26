import db, { initializeDatabase } from '../database/connection.js';

// Student data from the existing context
const initialStudents = [
  { id: '2117240020001', name: 'AAKASH B K', department: 'CSE', year: '2' },
  { id: '2117240020002', name: 'AARTHI M', department: 'CSE', year: '2' },
  { id: '2117240020003', name: 'AASHIDA V', department: 'CSE', year: '2' },
  { id: '2117240020004', name: 'ABHILASH M', department: 'CSE', year: '2' },
  { id: '2117240020005', name: 'M ABIMANYUE', department: 'CSE', year: '2' },
  { id: '2117240020006', name: 'ABINA JERLIN M', department: 'CSE', year: '2' },
  { id: '2117240020007', name: 'ABINAYA S G', department: 'CSE', year: '2' },
  { id: '2117240020008', name: 'ABINESH S', department: 'CSE', year: '2' },
  { id: '2117240020010', name: 'S ABISHEK', department: 'CSE', year: '2' },
  { id: '2117240020011', name: 'ADARSH H', department: 'CSE', year: '2' },
  { id: '2117240020012', name: 'ADITYA PARTHASARATHY', department: 'CSE', year: '2' },
  { id: '2117240020013', name: 'AFSA R', department: 'CSE', year: '2' },
  { id: '2117240020014', name: 'AISWARYAA BABU', department: 'CSE', year: '2' },
  { id: '2117240020015', name: 'A AKASH', department: 'CSE', year: '2' },
  { id: '2117240020016', name: 'AKSHARA P', department: 'CSE', year: '2' },
  { id: '2117240020017', name: 'AKSHAY V', department: 'CSE', year: '2' },
  { id: '2117240020018', name: 'AKSHAYA K', department: 'CSE', year: '2' },
  { id: '2117240020019', name: 'AKSHAYA M', department: 'CSE', year: '2' },
  { id: '2117240020020', name: 'AKSHAYA R L', department: 'CSE', year: '2' },
  { id: '2117240020021', name: 'AKSHAYA DARSHINI N', department: 'CSE', year: '2' },
  { id: '2117240020022', name: 'AKSHITHA P', department: 'CSE', year: '2' },
  { id: '2117240020023', name: 'AKSHITHA S', department: 'CSE', year: '2' },
  { id: '2117240020024', name: 'AMBATI JYOTHITHA', department: 'CSE', year: '2' },
  { id: '2117240020025', name: 'AMUDHAN M', department: 'CSE', year: '2' },
  { id: '2117240020026', name: 'ANISHA PATHAK', department: 'CSE', year: '2' },
  { id: '2117240020027', name: 'ANISKA S P', department: 'CSE', year: '2' },
  { id: '2117240020028', name: 'ANJASRI V', department: 'CSE', year: '2' },
  { id: '2117240020029', name: 'ANUSHA B', department: 'CSE', year: '2' },
  { id: '2117240020030', name: 'ANUSHRI R', department: 'CSE', year: '2' },
  { id: '2117240020031', name: 'ARAVINDRAJ D', department: 'CSE', year: '2' },
  { id: '2117240020032', name: 'ARNAV KUMAR R', department: 'CSE', year: '2' },
  { id: '2117240020033', name: 'ARVIND N', department: 'CSE', year: '2' },
  { id: '2117240020034', name: 'ASANTHIKA A', department: 'CSE', year: '2' },
  { id: '2117240020035', name: 'ASEEMA S', department: 'CSE', year: '2' },
  { id: '2117240020036', name: 'ASHA A', department: 'CSE', year: '2' },
  { id: '2117240020037', name: 'ASHWIN G', department: 'CSE', year: '2' },
  { id: '2117240020038', name: 'ASIN D', department: 'CSE', year: '2' },
  { id: '2117240020039', name: 'ASWANTHAR M', department: 'CSE', year: '2' },
  { id: '2117240020040', name: 'ASWIN R', department: 'CSE', year: '2' },
  { id: '2117240020041', name: 'ASWIN KUMAR E N', department: 'CSE', year: '2' },
  { id: '2117240020042', name: 'ASWINI M', department: 'CSE', year: '2' },
  { id: '2117240020043', name: 'ATHISHWAN J', department: 'CSE', year: '2' },
  { id: '2117240020044', name: 'AUSTIN JOSHUA M', department: 'CSE', year: '2' },
  { id: '2117240020045', name: 'AVINESHWARAN A', department: 'CSE', year: '2' },
  { id: '2117240020046', name: 'BALAJI M R', department: 'CSE', year: '2' },
  { id: '2117240020047', name: 'BALAJI P', department: 'CSE', year: '2' },
  { id: '2117240020048', name: 'BASKAR J', department: 'CSE', year: '2' },
  { id: '2117240020049', name: 'BAYATHARINI R', department: 'CSE', year: '2' },
  { id: '2117240020050', name: 'BHARANIDHARAN R', department: 'CSE', year: '2' },
  { id: '2117240020051', name: 'BHUVANESHWARAN S', department: 'CSE', year: '2' },
  { id: '2117240020052', name: 'CATHERIN JENIRA I', department: 'CSE', year: '2' },
  { id: '2117240020053', name: 'CHARUMATHI K', department: 'CSE', year: '2' },
  { id: '2117240020054', name: 'CHRIS ALAN', department: 'CSE', year: '2' },
  { id: '2117240020055', name: 'CHRIS MELVYN RAJ P', department: 'CSE', year: '2' },
  { id: '2117240020056', name: 'CHRISTOPHER J', department: 'CSE', year: '2' },
  { id: '2117240020057', name: 'DARSHAN A R', department: 'CSE', year: '2' },
  { id: '2117240020058', name: 'DARSHAN B', department: 'CSE', year: '2' },
  { id: '2117240020059', name: 'DEBORHAL L', department: 'CSE', year: '2' },
  { id: '2117240020060', name: 'DEEPA SHREE C', department: 'CSE', year: '2' },
  { id: '2117240020061', name: 'DEEPESH V', department: 'CSE', year: '2' },
  { id: '2117240020062', name: 'DEEPIKA P', department: 'CSE', year: '2' }
];

// Candidate data from the existing context
const initialCandidates = [
  {
    name: 'B.Dharshan',
    position: 'Student Council President',
    department: 'Computer Science Engineering',
    year: '2nd Year',
    manifesto: 'Committed to improving campus facilities, enhancing student welfare, and creating a more inclusive environment for all students.'
  },
  {
    name: 'Aravind Raj',
    position: 'Student Council President',
    department: 'Information Technology',
    year: '2nd Year',
    manifesto: 'Focused on digital transformation, innovation in education, and bridging the gap between academia and industry.'
  },
  {
    name: 'Aswin R',
    position: 'Student Council President',
    department: 'Electronics & Communication',
    year: '2nd Year',
    manifesto: 'Dedicated to enhancing student-faculty relationships, improving communication, and fostering academic excellence.'
  },
  {
    name: 'Assema',
    position: 'Student Council President',
    department: 'Mechanical Engineering',
    year: '2nd Year',
    manifesto: 'Advocating for sustainable campus development, environmental consciousness, and modern infrastructure upgrades.'
  }
];

export async function migrateData() {
  try {
    console.log('🔄 Starting data migration...');
    
    // Initialize database first
    initializeDatabase();
    
    // Check if data already exists
    const existingStudents = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };
    const existingCandidates = db.prepare('SELECT COUNT(*) as count FROM candidates').get() as { count: number };
    
    if (existingStudents.count > 0 || existingCandidates.count > 0) {
      console.log('📊 Data already exists in database:');
      console.log(`   Students: ${existingStudents.count}`);
      console.log(`   Candidates: ${existingCandidates.count}`);
      console.log('⚠️  Skipping migration to prevent duplicates');
      return;
    }

    // Migrate students
    console.log('👥 Migrating students...');
    const insertStudent = db.prepare(`
      INSERT INTO students (id, name, department, year, hasVoted)
      VALUES (?, ?, ?, ?, FALSE)
    `);

    const insertStudents = db.transaction((students) => {
      for (const student of students) {
        insertStudent.run(student.id, student.name, student.department, student.year);
      }
    });

    insertStudents(initialStudents);
    console.log(`✅ Migrated ${initialStudents.length} students`);

    // Migrate candidates
    console.log('🗳️  Migrating candidates...');
    const insertCandidate = db.prepare(`
      INSERT INTO candidates (name, position, department, year, manifesto, votes)
      VALUES (?, ?, ?, ?, ?, 0)
    `);

    const insertCandidates = db.transaction((candidates) => {
      for (const candidate of candidates) {
        insertCandidate.run(
          candidate.name,
          candidate.position,
          candidate.department,
          candidate.year,
          candidate.manifesto
        );
      }
    });

    insertCandidates(initialCandidates);
    console.log(`✅ Migrated ${initialCandidates.length} candidates`);

    // Verify migration
    const finalStudentCount = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };
    const finalCandidateCount = db.prepare('SELECT COUNT(*) as count FROM candidates').get() as { count: number };

    console.log('\n📈 Migration Summary:');
    console.log(`   Students in database: ${finalStudentCount.count}`);
    console.log(`   Candidates in database: ${finalCandidateCount.count}`);
    console.log('🎉 Data migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData()
    .then(() => {
      console.log('Migration completed, closing database...');
      db.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      db.close();
      process.exit(1);
    });
}