import React from 'react';
import { useNavigationStore } from '../stores/navigationStore';

export const OrganizationsPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { setIsNavigating, tabStates, setOrganizationsTab } = useNavigationStore();

  const activeTab = tabStates.organizations;

  const organizations = {
    major: [
      { id: 1, name: "Glorian", location: "International", description: "Official organization for Samael Aun Weor's teachings", url: "https://glorian.org/" },
      { id: 2, name: "AGEAC", location: "International", description: "Gnostic Cultural Association of Anthropological Studies", url: "https://ageac.org/en/" },
      { id: 3, name: "Samael Lakshmi", location: "International", description: "Gnostic teachings and spiritual development", url: "https://aeon13.org/" },
      { id: 4, name: "The New Gnostic Society Samael Aun Weor", location: "International", description: "Gnostic Society for Samael Aun Weor's teachings", url: "https://gnosistr.com" },
      { id: 5, name: "Koradi Radio", location: "International", description: "Community focused on practical gnostic teachings", url: "https://koradi.org/en/" },
      { id: 6, name: "Chicago Gnosis", location: "Chicago, USA", description: "Gnostic teachings and study groups in Chicago", url: "https://chicagognosis.org" }
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
          onClick={() => setOrganizationsTab('major')}
        >
          Major Organizations
        </button>
        <button
          className={activeTab === 'local' ? 'tab active' : 'tab'}
          onClick={() => setOrganizationsTab('local')}
        >
          Local Centers
        </button>
        <button
          className={activeTab === 'independent' ? 'tab active' : 'tab'}
          onClick={() => setOrganizationsTab('independent')}
        >
          Independent Groups
        </button>
      </div>

      <div className="organizations-content">
        {(activeTab === 'local' || activeTab === 'independent') && (
          <div className="development-message">
            <p>Organization listings for {activeTab === 'local' ? 'local centers' : 'independent groups'} are currently in development. Below are examples of planned functionality.</p>
          </div>
        )}
        <div className="organizations-list">
          {organizations[activeTab].map(org => (
            <div key={org.id} className="organization-item">
              <h3>{org.name}</h3>
              <p className="organization-location">{org.location}</p>
              <p className="organization-description">{org.description}</p>
              {(org as any).url ? (
                <a href={(org as any).url} target="_blank" rel="noopener noreferrer">
                  <button className="visit-button">Visit Website</button>
                </a>
              ) : (
                <button className="visit-button" disabled>Visit Website</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
