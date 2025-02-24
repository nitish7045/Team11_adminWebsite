import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Leaderboard.css"; // Import external CSS file

const LeaderboardAdmin = () => {
  const [matchId, setMatchId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    if (!matchId) return;
    setLoading(true);
    setError(null);
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

      if (!matchResult) throw new Error("No match results found.");

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

      setTeams(calculatedTeams.sort((a, b) => b.totalPoints - a.totalPoints));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaderboard-container">
      <h1>Fetch Match Winner</h1>
      <input
        type="text"
        placeholder="Enter Match ID"
        value={matchId}
        onChange={(e) => setMatchId(e.target.value)}
      />
      <button onClick={fetchLeaderboard}>Fetch Winners</button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {teams.map((team, index) => (
          <li key={team.teamId} className={index < 3 ? "winner" : ""}>
            <span>#{index + 1} {index < 3 ? ["🥇", "🥈", "🥉"][index] : ""}</span>
            <p>User: {team.userName}</p>
            <p>Total Points: {team.totalPoints}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardAdmin;
