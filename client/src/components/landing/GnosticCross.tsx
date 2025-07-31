import React from 'react';

interface GnosticCrossProps {
  onSectionClick: (section: string) => void;
}

export const GnosticCross: React.FC<GnosticCrossProps> = ({ onSectionClick }) => {
  return (
    <div className="gnostic-cross-container">
      <svg 
        width="400" 
        height="400" 
        viewBox="0 0 400 400" 
        className="gnostic-cross"
      >
        {/* Outer Circle */}
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="4"
          className="outer-circle"
        />
        
        {/* Cross Lines */}
        {/* Vertical Line */}
        <line
          x1="200"
          y1="20"
          x2="200"
          y2="380"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="4"
          className="cross-line"
        />
        
        {/* Horizontal Line */}
        <line
          x1="20"
          y1="200"
          x2="380"
          y2="200"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="4"
          className="cross-line"
        />
        
        {/* Quadrant Buttons */}
        {/* Top - Resources */}
        <g 
          className="quadrant-button" 
          onClick={() => onSectionClick('resources')}
          style={{ cursor: 'pointer' }}
        >
          <path
            d="M 200 20 A 180 180 0 0 1 370 200 L 200 200 Z"
            fill="rgba(255, 255, 255, 0.1)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            className="quadrant-area"
          />
          <text
            x="285"
            y="110"
            textAnchor="middle"
            className="quadrant-text"
            fill="white"
            fontSize="18"
            fontWeight="600"
          >
            RESOURCES
          </text>
          <text
            x="285"
            y="130"
            textAnchor="middle"
            className="quadrant-subtext"
            fill="rgba(255, 255, 255, 0.8)"
            fontSize="12"
          >
            Books • Radio • Videos
          </text>
        </g>
        
        {/* Right - Organizations */}
        <g 
          className="quadrant-button" 
          onClick={() => onSectionClick('organizations')}
          style={{ cursor: 'pointer' }}
        >
          <path
            d="M 370 200 A 180 180 0 0 1 200 380 L 200 200 Z"
            fill="rgba(255, 255, 255, 0.1)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            className="quadrant-area"
          />
          <text
            x="285"
            y="290"
            textAnchor="middle"
            className="quadrant-text"
            fill="white"
            fontSize="18"
            fontWeight="600"
          >
            ORGANIZATIONS
          </text>
          <text
            x="285"
            y="310"
            textAnchor="middle"
            className="quadrant-subtext"
            fill="rgba(255, 255, 255, 0.8)"
            fontSize="12"
          >
            Centers • Groups • Links
          </text>
        </g>
        
        {/* Bottom - Community */}
        <g 
          className="quadrant-button" 
          onClick={() => onSectionClick('community')}
          style={{ cursor: 'pointer' }}
        >
          <path
            d="M 200 380 A 180 180 0 0 1 30 200 L 200 200 Z"
            fill="rgba(255, 255, 255, 0.1)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            className="quadrant-area"
          />
          <text
            x="115"
            y="290"
            textAnchor="middle"
            className="quadrant-text"
            fill="white"
            fontSize="18"
            fontWeight="600"
          >
            COMMUNITY
          </text>
          <text
            x="115"
            y="310"
            textAnchor="middle"
            className="quadrant-subtext"
            fill="rgba(255, 255, 255, 0.8)"
            fontSize="12"
          >
            Forum • Groups • Connect
          </text>
        </g>
        
        {/* Left - Map */}
        <g 
          className="quadrant-button" 
          onClick={() => onSectionClick('map')}
          style={{ cursor: 'pointer' }}
        >
          <path
            d="M 30 200 A 180 180 0 0 1 200 20 L 200 200 Z"
            fill="rgba(255, 255, 255, 0.1)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            className="quadrant-area"
          />
          <text
            x="115"
            y="110"
            textAnchor="middle"
            className="quadrant-text"
            fill="white"
            fontSize="18"
            fontWeight="600"
          >
            MAP
          </text>
          <text
            x="115"
            y="130"
            textAnchor="middle"
            className="quadrant-subtext"
            fill="rgba(255, 255, 255, 0.8)"
            fontSize="12"
          >
            Find • Connect • Share
          </text>
        </g>
        
        {/* Center Circle */}
        <circle
          cx="200"
          cy="200"
          r="40"
          fill="rgba(255, 255, 255, 0.2)"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="3"
        />
        
        {/* Center Text */}
        <text
          x="200"
          y="195"
          textAnchor="middle"
          className="center-text"
          fill="white"
          fontSize="14"
          fontWeight="700"
        >
          AQUARIAN
        </text>
        <text
          x="200"
          y="210"
          textAnchor="middle"
          className="center-text"
          fill="white"
          fontSize="14"
          fontWeight="700"
        >
          GNOSIS
        </text>
      </svg>
    </div>
  );
};