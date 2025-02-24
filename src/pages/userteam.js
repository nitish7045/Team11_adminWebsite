import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserTeam.css"; // Import CSS file for styling

const UserTeam = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("userId");
  const [sportFilter, setSportFilter] = useState("");
  const [expandedTeam, setExpandedTeam] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          "https://fantacy-app-backend.onrender.com/auth/admin/team"
        );
        // Sort teams by createdAt (latest first)
        const sortedTeams = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTeams(sortedTeams);
        setFilteredTeams(sortedTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    let filtered = teams.filter((team) =>
      team[searchField]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sportFilter) {
      filtered = filtered.filter((team) => team.sportType === sportFilter);
    }

    setFilteredTeams(filtered);
  }, [searchQuery, searchField, sportFilter, teams]);

  const toggleTeamPlayers = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const closeModal = () => {
    setExpandedTeam(null);
  };

  return (
    <div className="team-container">
      <h1>User Teams</h1>

      <div className="search-filter-section">
        <select onChange={(e) => setSearchField(e.target.value)}>
          <option value="userId">Search by User ID</option>
          <option value="matchId">Search by Match ID</option>
          <option value="teamId">Search by Team ID</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setSportFilter(e.target.value)}>
          <option value="">Filter by Sport Type</option>
          <option value="Hockey">Hockey</option>
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
          <option value="Kabaddi">Kabaddi</option>
          <option value="Basketball">Basketball</option>
        </select>
      </div>

      <table className="team-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Series Name</th>
            <th>Match Title</th>
            <th>Match Format</th>
            <th>Sport Type</th>
            <th>Match ID</th>
            <th>Team ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map((team) => (
            <tr key={team.teamId}>
              <td>{team.userId}</td>
              <td>{team.seriesName}</td>
              <td>{team.matchTitle}</td>
              <td>{team.matchFormat}</td>
              <td>{team.sportType}</td>
              <td>{team.matchId}</td>
              <td>{team.teamId}</td>
              <td>
                <button onClick={() => toggleTeamPlayers(team.teamId)}>
                  View Players
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Player List Popup */}
      {expandedTeam && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Players in Team {expandedTeam}</h3>
              <button onClick={closeModal} className="close-button">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <ul>
                {teams
                  .find((team) => team.teamId === expandedTeam)
                  ?.team.map((player, index) => (
                    <li key={player._id}>
                      <strong>
                        {player.name}
                        {player.name ===
                        teams.find((t) => t.teamId === expandedTeam)?.captain
                          ? " (C)"
                          : ""}
                        {player.name ===
                        teams.find((t) => t.teamId === expandedTeam)?.viceCaptain
                          ? " (VC)"
                          : ""}
                      </strong>{" "}
                      - {player.position}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTeam;