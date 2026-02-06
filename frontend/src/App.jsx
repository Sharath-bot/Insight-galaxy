import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';

// Portals
import AdminPortal from './admin/AdminPortal';
import ResearcherPortal from './researcher/ResearcherPortal';
import UserPortal from './user/UserPortal';

// Admin Table Components (Placeholders)
import Astronauts from './admin/Astronauts';
import Spacecraft from './admin/Spacecraft';
import Agencies from './admin/Agencies';
import CreateAccount from './admin/CreateAccount';
import UserList from './admin/UserList';
import Roles from './admin/Roles';
import Countries from './admin/Countries';
import Instruments from './admin/Instruments';
import Feedback from './admin/Feedback';

// ... ensure these match the filenames exactly!

// Researcher/Common Components
import CelestialObjects from './researcher/CelestialObjects';
import Missions from './researcher/Missions';
import Observatories from './researcher/Observatories';
import Telescopes from './researcher/Telescopes';
import Discoveries from './researcher/Discoveries';
import Observations from './researcher/Observations';
import AnalyticsDashboard from './researcher/AnalyticsDashboard';

// User Components
import Favorites from './user/Favorites';
import UserMissionLogs from './user/UserMissionLogs';
function App() {
  // 1. INITIALIZE FROM LOCALSTORAGE
  // This is the fix for auto-logout: it checks browser memory on load
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('insight_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('insight_user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/" element={
          !user ? <Login setUser={setUser} /> : <Navigate to={
            user.role_id === 1 ? "/admin" : 
            user.role_id === 2 ? "/researcher" : "/user"
          } />
        } />

        {/* ADMIN PORTAL (Role ID 1) */}
        <Route path="/admin" element={<AdminPortal user={user} setUser={handleLogout} />}>
          {/* Dashboard Default View */}
          <Route index element={<div className="p-8 text-slate-800">Welcome to Admin Command Center</div>} />
          
          {/* Sub-Routes for Sidebar Links */}
          <Route path="users" element={<UserList />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route path="astronauts" element={<Astronauts />} />
          <Route path="spacecraft" element={<Spacecraft />} />
          <Route path="agencies" element={<Agencies />} />
          <Route path="missions" element={<Missions />} />
          <Route path="objects" element={<CelestialObjects user={user} />} />
          <Route path="roles" element={<Roles />} />
          <Route path="countries" element={<Countries />} />
          <Route path="instruments" element={<Instruments />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="observatories" element={<Observatories />} />
          <Route path="telescopes" element={<Telescopes />} />
          <Route path="instruments" element={<Instruments />} />
          <Route path="observations" element={<Observations />} />
          <Route path="discoveries" element={<Discoveries />} />
          <Route path="favourites" element={<Favorites user={user} />} />

        </Route>
          {/* Add remaining admin routes here */}
        
{/* RESEARCHER PORTAL CONFIGURATION */}
<Route path="/researcher" element={<ResearcherPortal user={user} setUser={handleLogout} />}>
  {/* Analytics Dashboard (The default view) */}

  
  {/* Data Access Routes */}
  <Route path="missions" element={<Missions />} />
  <Route path="celestial_objects" element={<CelestialObjects user={user} />} />
  <Route path="discoveries" element={<Discoveries />} />
  <Route path="observations" element={<Observations />} />
  <Route path="instruments" element={<Instruments />} />
  <Route path="observatories" element={<Observatories />} />
  <Route path="spacecraft" element={<Spacecraft />} />
  <Route path="astronauts" element={<Astronauts />} />
  <Route path="agencies" element={<Agencies />} />
  <Route path="analytics" element={<AnalyticsDashboard />} />
</Route>
        {/* EXPLORER/USER PORTAL (Role ID 3) */}
        
        <Route path="/user" element={<UserPortal user={user} setUser={handleLogout} />}>
        
          <Route path="objects" element={<CelestialObjects user={user} />} />
          <Route path="favorites" element={<Favorites user={user} />} />
          <Route path="mission-logs" element={<UserMissionLogs />} />
        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;