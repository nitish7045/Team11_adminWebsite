import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./MatchResult.css"; // Import external CSS file

const MatchResults = () => {
  const [matchResults, setMatchResults] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [winners, setWinners] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allTeams, setAllTeams] = useState([]);


  useEffect(() => {
    fetchMatchResults();
  }, []);

  const fetchMatchResults = async () => {
    try {
      const response = await axios.get(
        "https://fantacy-app-backend.onrender.com/auth/all-match-results"
      );
  
      // Sort match results by `createdAt` or `modifiedAt` in descending order
      const sortedResults = response.data.matchResults?.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ) || [];
  
      setMatchResults(sortedResults);
    } catch (error) {
      console.error("Error fetching match results:", error);
      setError("Failed to fetch match results.");
    }
  };
  

  const fetchWinners = useCallback(async (matchId) => {
    setSelectedMatchId(matchId);
    setWinners([]);
    setShowWinnerModal(true);
    setLoading(true);
    setError(null);

    try {
      const [usersResponse, teamsResponse, matchResultResponse] = await Promise.all([
        axios.get("https://fantacy-app-backend.onrender.com/auth/admin/fetch-users"),
        axios.get(`https://fantacy-app.onrender.com/auth/teams/team/matchid/${matchId}`),
        axios.get(`https://fantacy-app-backend.onrender.com/auth/match-results/${matchId}`)
      ]);

      const users = usersResponse.data || [];
      const teamsData = teamsResponse.data.matchw || [];
      const matchResult = matchResultResponse.data.matchResult; // Direct match result for given matchId

      if (!matchResult || !matchResult.playersPoints) {
        throw new Error("No match results found.");
      }

      const calculatedTeams = teamsData.map((team) => {
        let totalPoints = 0;

        const updatedPlayers = team.team.map((player) => {
          const playerResult = matchResult.playersPoints.find(p => p.playerName === player.name);
          let points = playerResult ? playerResult.points : 0;
          if (player.name === team.captain) points *= 2;
          if (player.name === team.viceCaptain) points *= 1.5;
          totalPoints += points;
          return { ...player, points };
        });

        const user = users.find(u => String(u.userId) === String(team.userId));

        return {
          teamId: team.teamId,
          userId: team.userId,
          userName: user ? user.fullName : "Unknown User",
          totalPoints,
          players: updatedPlayers,
        };
      });

      setWinners(calculatedTeams.sort((a, b) => b.totalPoints - a.totalPoints));
    } catch (err) {
      console.error("Error fetching winners:", err);
      setError(err.response?.data?.message || err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserTeams = useCallback(async (userId, matchId) => {
    setSelectedUserId(userId);
    setUserTeams([]);
    setShowTeamsModal(true);
    setLoading(true);
    setError(null);
  
    try {
      console.log("Fetching teams for:", { userId, matchId });
  
      // Fetch all saved teams
      const response = await axios.get("https://fantacy-app-backend.onrender.com/auth/admin/team");
  
      console.log("API Response:", response.data);
  
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from server.");
      }
  
      const allTeams = response.data;
  
      // Filter teams by userId & matchId (Ensure correct data types)
      const filteredTeams = allTeams.filter(
        (team) =>
          String(team.userId) === String(userId) &&
          String(team.matchId) === String(matchId)
      );
  
      console.log("Filtered Teams:", filteredTeams);
  
      if (filteredTeams.length === 0) {
        setError("No teams found for this user in this match.");
      }
  
      setUserTeams(filteredTeams);
    } catch (error) {
      console.error("Error fetching user teams:", error);
      setError(error.response?.data?.message || "Failed to fetch user teams.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchMatchResults();
    fetchAllTeams(); // Fetch all teams at start
  }, []);
  
  const fetchAllTeams = async () => {
    try {
      const response = await axios.get("https://fantacy-app-backend.onrender.com/auth/admin/team");
      setAllTeams(response.data); // Store all teams
    } catch (error) {
      console.error("Error fetching all teams:", error);
    }
  };
  
  

  return (
    <div className="match-results-container">
      <h1>Match Results</h1>
      {error && <p className="error">{error}</p>}
      <table>
  <thead>
    <tr>
      <th>Match ID</th>
      <th>Match Name</th>
      <th>Number of Winners</th> {/* New Column */}
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {matchResults.map((match) => {
      // Count teams that match the matchId
      const winnersCount = allTeams.filter(team => String(team.matchId) === String(match.matchId)).length;

      return (
        <tr key={match.matchId}>
          <td>{match.matchId}</td>
          <td>{match.matchTitle}</td>
          <td>{winnersCount}</td> {/* Display count of teams (winners) */}
          <td>
            <button onClick={() => fetchWinners(match.matchId)} disabled={loading}>
              {loading ? "Loading..." : "See Winners"}
            </button>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>



      {/* Winner Modal */}
      {showWinnerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Winners for Match {selectedMatchId}</h3>
              <button className="close-button" onClick={() => setShowWinnerModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {loading ? <p>Loading winners...</p> : (
                <ul>
                  {winners.map((team, index) => (
                    <li key={team.teamId}>
                      <strong>
                        #{index + 1} {index < 3 ? ["🥇", "🥈", "🥉"][index] : ""}
                      </strong>
                      <p>
                        User:{" "}
                        <span
                          className="clickable"
                          onClick={() => fetchUserTeams(team.userId, selectedMatchId)}
                        >
                          {team.userName}
                        </span>
                      </p>
                      <p>Total Points: {team.totalPoints}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Teams Modal */}
{showTeamsModal && selectedUserId && (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h3>Teams Created by User {selectedUserId}</h3>
        <button className="close-button" onClick={() => setShowTeamsModal(false)}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        {loading ? (
          <p>Loading teams...</p>
        ) : userTeams.length === 0 ? (
          <p>No teams found for this user.</p>
        ) : (
          <ul>
            {userTeams.map((team) => (
              <li key={team.teamId}>
                <h4>Team ID: {team.teamId}</h4>
                <ul>
                  {team.team.map((player) => (
                    <li key={player._id}>
                      <strong>
                        {player.name}
                        {player.name === team.captain ? " (C)" : ""}
                        {player.name === team.viceCaptain ? " (VC)" : ""}
                      </strong>{" "}
                      - {player.position}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default MatchResults;
