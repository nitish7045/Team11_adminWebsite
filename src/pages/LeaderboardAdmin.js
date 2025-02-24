import React, { useState, useCallback } from "react";
import axios from "axios";
import "./Leaderboard.css"; // Import external CSS file

const LeaderboardAdmin = () => {
  const [matchId, setMatchId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    if (!matchId.trim()) {
      setError("Match ID cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // **Parallel API calls for better performance**
      const [usersResponse, teamsResponse, matchResultsResponse] = await Promise.all([
        axios.get("https://fantacy-app-backend.onrender.com/auth/admin/fetch-users"),
        axios.get(`https://fantacy-app.onrender.com/auth/teams/team/matchid/${matchId}`),
        axios.get(`https://fantacy-app-backend.onrender.com/auth/match-results/${matchId}`)
      ]);

      const users = usersResponse.data || [];
      const teamsData = teamsResponse.data.matchw || [];
      const matchResult = matchResultsResponse.data.matchResult; // Already filtered for single match

      if (!matchResult || !matchResult.playersPoints) {
        throw new Error("No match results found.");
      }

      // **Compute team points based on match results**
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

      setTeams(calculatedTeams.sort((a, b) => b.totalPoints - a.totalPoints));
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  return (
    <div className="leaderboard-container">
      <h1>Fetch Match Winner</h1>
      <input
        type="text"
        placeholder="Enter Match ID"
        value={matchId}
        onChange={(e) => setMatchId(e.target.value)}
      />
      <button onClick={fetchLeaderboard} disabled={loading}>
        {loading ? "Loading..." : "Fetch Winners"}
      </button>

      {error && <p className="error">{error}</p>}

      <ul>
        {teams.map((team, index) => (
          <li key={team.teamId} className={`team-card ${index < 3 ? "winner" : ""}`}>
            <span>#{index + 1} {index < 3 ? ["🥇", "🥈", "🥉"][index] : ""}</span>
            <p><strong>User:</strong> {team.userName}</p>
            <p><strong>Total Points:</strong> {team.totalPoints}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardAdmin;
