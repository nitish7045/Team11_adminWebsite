import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchMatchResults();
  }, []);

  const fetchMatchResults = async () => {
    try {
      const response = await axios.get(
        "https://fantacy-app-backend.onrender.com/auth/all-match-results"
      );
      setMatchResults(response.data.matchResults || []);
    } catch (error) {
      console.error("Error fetching match results:", error);
    }
  };

  const fetchWinners = async (matchId) => {
    setSelectedMatchId(matchId);
    setWinners([]);
    setShowWinnerModal(true);

    try {
      const usersResponse = await axios.get(
        "https://fantacy-app-backend.onrender.com/auth/admin/fetch-users"
      );
      const users = usersResponse.data;

      const teamsResponse = await axios.get(
        `https://fantacy-app.onrender.com/auth/teams/team/matchid/${matchId}`
      );
      const teamsData = teamsResponse.data.matchw || [];

      const matchResultsResponse = await axios.get(
        "https://fantacy-app-backend.onrender.com/auth/all-match-results"
      );
      const matchResults = matchResultsResponse.data.matchResults || [];
      const matchResult = matchResults.find(
        (result) => String(result.matchId) === String(matchId)
      );

      if (!matchResult) {
        console.error("No match results found.");
        return;
      }

      const calculatedTeams = teamsData.map((team) => {
        let totalPoints = 0;
        const updatedPlayers = team.team.map((player) => {
          const playerResult = matchResult.playersPoints.find(
            (p) => p.playerName === player.name
          );
          let points = playerResult ? playerResult.points : 0;
          if (player.name === team.captain) points *= 2;
          if (player.name === team.viceCaptain) points *= 1.5;
          totalPoints += points;
          return { ...player, points };
        });

        const user = users.find((u) => String(u.userId) === String(team.userId));
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
    }
  };

  const fetchUserTeams = async (userId) => {
    setSelectedUserId(userId);
    setUserTeams([]);
    setShowTeamsModal(true);

    try {
      const teamsResponse = await axios.get(
        `https://fantacy-app.onrender.com/auth/teams/user/${userId}`
      );
      setUserTeams(teamsResponse.data.teams || []);
    } catch (error) {
      console.error("Error fetching user teams:", error);
    }
  };

  return (
    <div className="match-results-container"> {/* Add a unique class here */}
      <h1>Match Results</h1>
      <table>
        <thead>
          <tr>
            <th>Match ID</th>
            <th>Match Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {matchResults.map((match) => (
            <tr key={match.matchId}>
              <td>{match.matchId}</td>
              <td>{match.matchTitle}</td>
              <td>
                <button onClick={() => fetchWinners(match.matchId)}>See Winners</button>
              </td>
            </tr>
          ))}
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
                        onClick={() => fetchUserTeams(team.userId)}
                      >
                        {team.userName}
                      </span>
                    </p>
                    <p>Total Points: {team.totalPoints}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* User Teams Modal */}
      {showTeamsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Teams Created by User {selectedUserId}</h3>
              <button className="close-button" onClick={() => setShowTeamsModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <ul>
                {userTeams.map((team) => (
                  <li key={team.teamId}>
                    <p>Team ID: {team.teamId}</p>
                    <p>Captain: {team.captain}</p>
                    <p>Vice Captain: {team.viceCaptain}</p>
                    <p>
                      Players:{" "}
                      {team.team.map((player) => player.name).join(", ")}
                    </p>
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

export default MatchResults;