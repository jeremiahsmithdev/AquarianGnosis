import React, { useState } from 'react';
import { useNavigationStore } from '../stores/navigationStore';

export const OrganizationsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { setIsNavigating } = useNavigationStore();
  const [activeTab, setActiveTab] = useState<'major' | 'local' | 'independent'>('major');

  const organizations = {
    major: [
      { id: 1, name: "Glorian Association", location: "International", description: "Official organization for Samael Aun Weor's teachings" },
      { id: 2, name: "Koradi Community", location: "International", description: "Community focused on practical gnostic teachings" },
      { id: 3, name: "Aquarian Gnosis Foundation", location: "International", description: "Dedicated to uniting gnostic traditions" }
    ],
    local: [
      { id: 1, name: "Gnostic Study Center - New York", location: "New York, USA", description: "Local study group and meditation center" },
      { id: 2, name: "Temple of Gnosis - London", location: "London, UK", description: "Community temple for gnostic practices" },
      { id: 3, name: "Gnostic Fellowship - Berlin", location: "Berlin, Germany", description: "Local fellowship for gnostic studies" }
    ],
    independent: [
      { id: 1, name: "The Gnostic Path", location: "Online", description: "Independent teacher and resource collection" },
      { id: 2, name: "Modern Gnosis", location: "Online", description: "Contemporary approach to gnostic teachings" }
    ]
  };

  return (
    <div className="organizations-page">
      <div className="page-header">
        <h1>Organizations</h1>
        <button onClick={() => onNavigate('landing')} className="back-button">
          Back to Home
        </button>
      </div>

      <div className="organizations-tabs">
        <button 
          className={activeTab === 'major' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('major')}
        >
          Major Organizations
        </button>
        <button 
          className={activeTab === 'local' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('local')}
        >
          Local Centers
        </button>
        <button 
          className={activeTab === 'independent' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('independent')}
        >
          Independent Groups
        </button>
      </div>

      <div className="organizations-content">
        <div className="organizations-list">
          {organizations[activeTab].map(org => (
            <div key={org.id} className="organization-item">
              <h3>{org.name}</h3>
              <p className="organization-location">{org.location}</p>
              <p className="organization-description">{org.description}</p>
              <button className="visit-button">Visit Website</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
