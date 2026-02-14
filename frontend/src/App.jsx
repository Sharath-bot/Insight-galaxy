import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';

// Layout Portals
import AdminPortal from './admin/AdminPortal';
import ResearcherPortal from './researcher/ResearcherPortal';
import UserPortal from './user/UserPortal';

// Admin-Specific Tables
import Astronauts from './admin/Astronauts';
import AdminDiscoveries from './admin/Discoveries';
import Spacecraft from './admin/Spacecraft';
import Agencies from './admin/Agencies';
import UserList from './admin/UserList';
import Roles from './admin/Roles';
import Countries from './admin/Countries';
import Instruments from './admin/Instruments';
import AdminCelestialObjects from './admin/CelestialObject';
import AdminObservatories from './admin/Observatories';
import Telescopes from './admin/Telescopes';

// Researcher & Shared Tables
import Missions from './researcher/Missions';
import Discoveries from './researcher/Discoveries';
import Observations from './researcher/Observations';
import ResearchAnalytics from './researcher/Analytics';

// User-Specific Components
import Favorites from './user/Favorites';
import UserDashboard from './user/UserDashboard'; 

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('insight_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  const handleLogout = () => {
    localStorage.removeItem('insight_user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          !user ? <Login setUser={setUser} /> : (
            user.role_id === 1 ? <Navigate to="/admin" /> : 
            user.role_id === 2 ? <Navigate to="/researcher" /> : 
            <Navigate to="/user" />
          )
        } />

        {/* ADMIN CLUSTER (Role 1) */}
        <Route path="/admin" element={<AdminPortal user={user} setUser={handleLogout} />}>
          <Route index element={<div className="p-8 font-mono font-black uppercase">Main Command Center</div>} />
          <Route path="users" element={<UserList user={user} />} />
          <Route path="roles" element={<Roles user={user} />} />
          <Route path="missions" element={<Missions user={user} />} />
          <Route path="celestialobjects" element={<AdminCelestialObjects user={user} />} />
          <Route path="astronauts" element={<Astronauts user={user} />} />
          <Route path="discoveries" element={<AdminDiscoveries user={user} />} />
          <Route path="agencies" element={<Agencies user={user} />} />
          <Route path="spacecraft" element={<Spacecraft user={user} />} />
          <Route path="observatories" element={<AdminObservatories user={user} />} />
          <Route path="telescopes" element={<Telescopes user={user} />} />
          <Route path="instruments" element={<Instruments user={user} />} />
          <Route path="observations" element={<Observations user={user} />} />
          <Route path="countries" element={<Countries user={user} />} />
        </Route>

        {/* RESEARCHER CLUSTER (Role 2) */}
        <Route path="/researcher" element={<ResearcherPortal user={user} setUser={handleLogout} />}>
          <Route index element={<ResearchAnalytics />} />
          <Route path="analytics" element={<ResearchAnalytics />} />
          <Route path="missions" element={<Missions user={user} />} />
          <Route path="telescopes" element={<Telescopes user={user} />} />
          <Route path="discoveries" element={<Discoveries user={user} />} />
          <Route path="observations" element={<Observations user={user} />} />
          <Route path="celestial_objects" element={<AdminCelestialObjects user={user} />} />
          <Route path="astronauts" element={<Astronauts user={user} />} />
          <Route path="spacecraft" element={<Spacecraft user={user} />} />
          <Route path="agencies" element={<Agencies user={user} />} />
          <Route path="observatories" element={<AdminObservatories user={user} />} />
          <Route path="instruments" element={<Instruments user={user} />} />
        </Route>

        {/* USER CLUSTER (Role 3) */}
        <Route path="/user" element={<UserPortal user={user} setUser={handleLogout} />}>
          <Route index element={<UserDashboard />} />
          <Route path="missions" element={<Missions user={user} />} />
          <Route path="agencies" element={<Agencies user={user} />} />
          <Route path="objects" element={<AdminCelestialObjects user={user} />} />
          <Route path="favorites" element={<Favorites user={user} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;