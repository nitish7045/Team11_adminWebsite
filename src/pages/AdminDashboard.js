import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faExchangeAlt,
  faWallet,
  // faChartLine,
  // faCog,
  faLifeRing,
  faSignOutAlt,faUserGroup,faPlusCircle ,faCalendarPlus ,faMedal,faTrophy,faListAlt,faPaperPlane, faBell
} from '@fortawesome/free-solid-svg-icons';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import Transactions from './Transactions';
import WalletManagement from './WalletManagement';
import Reports from './Reports';
import Settings from './Settings';
import Support from './Support';
import logo from './logo.png';
import Userteam from './userteam';
import CreateMatch from './CreateMatch';
import UpcomingMatch from './UpcomingMatch';
import PlayerPoints from './PlayerPoints';
import LeaderboardAdmin from './LeaderboardAdmin';
import MatchResult from './MatchResult';
import NotificationHistory from './NotificationHistory';
import NotificationSender from './NotificationSender';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Authentication check
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('adminData'));
    if (!admin) {
      navigate('/login');
    } else {
      setAdminData(admin);
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminData');
    navigate('/login');
  };

  if (!adminData) {
    return null; // or loading spinner
  }

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <div
        style={styles.sidebar(isSidebarExpanded)}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <img src={logo} alt="Logo" style={styles.logoImage} />
          </div>
          {isSidebarExpanded && <h3 style={styles.adminName}>{adminData.username} <br/>ID: {adminData.adminId}</h3>}
        </div>

        <nav style={styles.menu}>
          {/* Dashboard Overview */}
          <NavLink
            to="/dashboard"
            end // Add the "end" prop here
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faHome} style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>Dashboard Overview</span>}
          </NavLink>

          {/* User Management */}
          <NavLink
            to="/dashboard/users"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faUsers} style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>User Management</span>}
          </NavLink>
          <NavLink
            to="/dashboard/usersteam"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faUserGroup} style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>User Teams</span>}
          </NavLink>

          {/* Transactions */}
          <NavLink
            to="/dashboard/transactions"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faExchangeAlt} style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>Transactions</span>}
          </NavLink>
          {/* Create team */}
          <NavLink
            to="/dashboard/creatematch"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faPlusCircle } style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>Create Match</span>}
          </NavLink>
          {/* Upcoming matches */}
          <NavLink
            to="/dashboard/upcomingmatch"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faCalendarPlus } style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>Upcoming Match</span>}
          </NavLink>
          {/* Player Points assign */}
          <NavLink
            to="/dashboard/playerpoints"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faMedal } style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>Declare Result</span>}
          </NavLink>

          {/* Wallet Management */}
          <NavLink
            to="/dashboard/wallets"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faWallet} style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>Wallet Management</span>}
          </NavLink>

          {/* Reports */}
          <NavLink
            to="/dashboard/leaderboardadmin"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faTrophy} style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>Match Winner</span>}
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/dashboard/matchresult"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faListAlt} style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>Match Result</span>}
          </NavLink>
          <NavLink
  to="/dashboard/notificationSender"
  style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
>
  <FontAwesomeIcon icon={faPaperPlane} style={styles.menuIcon} />
  {isSidebarExpanded && <span style={styles.menuText}>Send Notification</span>}
</NavLink>

<NavLink
  to="/dashboard/notificationHistory"
  style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
>
  <FontAwesomeIcon icon={faBell} style={styles.menuIcon} />
  {isSidebarExpanded && <span style={styles.menuText}>Notification History</span>}
</NavLink>

          {/* Support */}
          <NavLink
            to="/dashboard/support"
            style={({ isActive }) => styles.menuItem(isActive, isSidebarExpanded)}
          >
            <FontAwesomeIcon icon={faLifeRing} style={styles.menuIcon} />
            {isSidebarExpanded && <span style={styles.menuText}>Support</span>}
          </NavLink>
        </nav>

        {/* Logout Button */}
        <button
          style={styles.logoutButton(isSidebarExpanded)}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} style={styles.logoutIcon} />
          {isSidebarExpanded && <span style={styles.logoutText}>Logout</span>}
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent(isSidebarExpanded)}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>Admin Dashboard</h1>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.searchBox}>
              <input
                type="text"
                placeholder="Search..."
                style={styles.searchInput}
              />
              <FontAwesomeIcon icon="search" style={styles.searchIcon} />
            </div>
            <div style={styles.adminProfile}>
              <img
                src={logo}
                alt={adminData.adminId}
                style={styles.adminAvatar}
              />
              <span style={styles.adminName}>ID: {adminData.adminId}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={styles.contentArea}>
          <Routes>
            <Route path="/" element={<DashboardOverview admin={adminData} />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/wallets" element={<WalletManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="/usersteam" element={<Userteam />} />
            <Route path="/creatematch" element={<CreateMatch />} />
            <Route path="/upcomingmatch" element={<UpcomingMatch />} />
            <Route path="/playerpoints" element={<PlayerPoints />} />
            <Route path="/leaderboardadmin" element={<LeaderboardAdmin />} />
            <Route path="/matchresult" element={<MatchResult />} />
            <Route path="/notificationHistory" element={<NotificationHistory />} />
            <Route path="/notificationSender" element={<NotificationSender />} />
            {/* <Route path='/notificationHistory' element={<NotificationHistory>}/></NotificationHistory> */}

          </Routes>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f6fa',
  },
  sidebar: (isSidebarExpanded) => ({
    width: isSidebarExpanded ? '250px' : '50px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto', // Enables scrolling
    scrollbarWidth: 'none', // Hides scrollbar in Firefox
    msOverflowStyle: 'none', // Hides scrollbar in IE/Edge
  }),
  
  
  sidebarHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logo: {
    marginBottom: '10px',
  },
  logoImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '2px solid #fff',
  },
  adminName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  menu: {
    flex: 1,
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: (isActive, isSidebarExpanded) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    margin: '5px 0',
    borderRadius: '8px',
    color: '#ecf0f1',
    textDecoration: 'none',
    backgroundColor: isActive ? '#3498db' : 'transparent',
    transition: 'all 0.1s ease',
    ':hover': {
      backgroundColor: '#34495e',
    },
  }),
  menuIcon: {
    width: '24px',
    textAlign: 'center',
  },
  menuText: {
    marginLeft: '15px',
  },
  logoutButton: (isSidebarExpanded) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '19px',
    width: '100%',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    // marginTop: '20px',
    marginBottom:'70px',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  }),
  logoutIcon: {
    width: '24px',
    textAlign: 'center',
  },
  logoutText: {
    marginLeft: '15px',
  },
  mainContent: (isSidebarExpanded) => ({
    flex: 1,
    padding: '20px',
    backgroundColor: '#f5f6fa',
    overflowY: 'auto',
    marginLeft: isSidebarExpanded ? '290px' : '80px',
    transition: 'margin-left 0.3s ease',
  }),
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerTitle: {
    fontSize: '24px',
    color: '#2c3e50',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    marginLeft: '10px',
    fontSize: '14px',
  },
  searchIcon: {
    color: '#7f8c8d',
  },
  adminProfile: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
  },
  adminAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  contentArea: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
};

export default AdminDashboard;