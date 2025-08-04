import React from 'react';
import { GraduationCap } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showStatus?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "RIT E-Voting System",
  subtitle = "Rajalakshmi Institute of Technology - Student Council Elections 2025",
  showStatus = true 
}) => {
  return (
    <header className="header">
      <div className="logo-section">
        <div className="logo">
          <GraduationCap size={32} />
        </div>
        <div className="header-content">
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
          {showStatus && (
            <div className="election-status">
              <span className="status-indicator active"></span>
              <span>Elections Active</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;