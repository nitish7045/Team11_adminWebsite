import React, { useState, useEffect } from "react";
import playerData from "./player_data.json";
import "./PlayerPoints.css"; // Import the CSS file
import axios from "axios";

const PlayerPoints = () => {
  const [matches, setMatches] = useState({});
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedMatchResults, setSavedMatchResults] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterFormat, setFilterFormat] = useState("");
  const [selectedSport, setSelectedSport] = useState("Football");
  const [playersPoints, setPlayersPoints] = useState({});
  const [visibleMatches, setVisibleMatches] = useState({});

  // Fetch saved match results
  const fetchSavedMatchResults = async () => {
    try {
      const response = await fetch(
        "https://fantacy-app-backend.onrender.com/auth/all-match-results"
      );
      const data = await response.json();
      setSavedMatchResults(data.matchResults || []);
    } catch (error) {
      console.error("Error fetching saved match results:", error);
    }
  };

  // Fetch matches and saved match results when the component mounts
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const cricketResponse = await fetch(
          "https://fantacy-app-backend.onrender.com/auth/admin/cricket/matches"
        );
        const cricketMatches = await cricketResponse.json();

        const footballResponse = await fetch(
          "https://fantacy-app-backend.onrender.com/auth/admin/football/matches"
        );
        const footballMatches = await footballResponse.json();

        setMatches({ Football: footballMatches, Cricket: cricketMatches });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setLoading(false);
      }
    };

    fetchMatches();
    fetchSavedMatchResults(); // Fetch saved match results
  }, []);

  // Filter matches based on search, filter, and saved match results
  useEffect(() => {
    if (matches[selectedSport]) {
      const filtered = matches[selectedSport].filter((match) => {
        const matchesSearchQuery =
          match.seriesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.matchId.toString().includes(searchQuery);
        const matchesFilterFormat =
          filterFormat === "" || match.matchFormat === filterFormat;
        const isMatchSaved = savedMatchResults.some(
          (savedMatch) => savedMatch.matchId === match.matchId
        );
        return matchesSearchQuery && matchesFilterFormat && !isMatchSaved;
      });
      setFilteredMatches(filtered);
    }
  }, [searchQuery, filterFormat, selectedSport, matches, savedMatchResults]);

  const getPlayersByTeam = (teamAbbr) => {
    let players = [];
    Object.keys(playerData).forEach((category) => {
      playerData[category].teams.forEach((team) => {
        if (team.teamName === teamAbbr) {
          players = team.players;
        }
      });
    });
    return players;
  };

  const generateRandomPoints = () => {
    return Math.floor(Math.random() * (200 - 50 + 1)) + 50;
  };

  const assignPointsToMatch = (matchId, teamAbbr) => {
    const players = getPlayersByTeam(teamAbbr);
    const updatedPlayersPoints = players.map((player) => ({
      ...player,
      points: generateRandomPoints(),
      team: teamAbbr, // Ensure team name is included
    }));

    setPlayersPoints((prevState) => ({
      ...prevState,
      [matchId]: {
        ...prevState[matchId],
        [teamAbbr]: updatedPlayersPoints,
      },
    }));
  };

  const togglePlayers = (matchId) => {
    setVisibleMatches((prevState) => ({
      ...prevState,
      [matchId]: !prevState[matchId],
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterFormat(e.target.value);
  };

  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
  };

  const saveMatchResults = async (match) => {
    const playersPointsData = [
      ...(playersPoints[match.matchId]?.[match.teamAbbreviations.team1] || []),
      ...(playersPoints[match.matchId]?.[match.teamAbbreviations.team2] || []),
    ].map((player) => ({
      playerId: player.id,
      playerName: player.name,
      team: player.team || "",
      position: player.position,
      points: player.points,
    }));

    const matchData = {
      matchId: match.matchId,
      seriesName: match.seriesName,
      matchTitle: match.matchTitle,
      matchFormat: match.matchFormat,
      matchVenue: match.matchVenue,
      matchDateTime: match.matchDateTime,
      resultStatus: "Complete",
      playersPoints: playersPointsData,
    };

    console.log("Saving Match Data:", matchData);

    try {
      const response = await fetch(
        "https://fantacy-app-backend.onrender.com/auth/save-match-results",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(matchData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Match results saved successfully!");
        await fetchSavedMatchResults();

         // 2️⃣ Get current date & time in IST
const formattedDate = new Date().toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short",
});

// Send notification for match result declaration
const notificationData = {
  type: `Match Result Declared`,
  message: `🎉 Match Result Declared! ⏰ ${formattedDate}\n🏆 ${match.teamAbbreviations.team1} vs ${match.teamAbbreviations.team2}\n📌 Series: ${match.seriesName} Series\n✅ Check the final points now!`,
};


        await axios.post(
          "https://fantacy-app-backend.onrender.com/auth/send-notification",
          notificationData,
          { headers: { "Content-Type": "application/json" } }
        );

      } else {
        alert(`Failed to save: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving match result:", error);
      alert("Error saving match result. Check the console for details.");
    }

    // Ensure matchId is treated as a string before using startsWith
    const sportType = String(match.matchId).startsWith("5") ? "football" : "cricket";

    try {
      const response = await fetch(
        `https://fantacy-app-backend.onrender.com/auth/admin/${sportType}/match/${match.matchId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`${sportType.charAt(0).toUpperCase() + sportType.slice(1)} Match removed successfully from upcoming matches!`);
        await fetchSavedMatchResults();
      } else {
        alert(`Failed to delete: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting match:", error);
      alert("Error deleting match. Check the console for details.");
    }
};



return (
    <div className="player-points-container">
      <h2>Declare Result Page</h2>
      {loading ? (
        <p className="loading">Loading matches...</p>
      ) : (
        <div>
          <div>
            <select onChange={handleSportChange} value={selectedSport}>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
            </select>

            <input
              type="text"
              placeholder="Search by Match ID or Series Name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <select onChange={handleFilterChange} value={filterFormat}>
              <option value="">All Formats</option>
              <option value="T20">T20</option>
              <option value="ODI">ODI</option>
              <option value="Test">Test</option>
            </select>
          </div>

          <h3>Upcoming Matches</h3>
          <div>
            {filteredMatches.length === 0 ? (
              <p className="no-matches">No matches found</p>
            ) : (
              filteredMatches.map((match) => (
                <div key={match.matchId} className="match-card">
                  <div>
                    <strong>Match ID: {match.matchId}</strong> |{" "}
                    <strong>{match.seriesName}</strong> |{" "}
                    {match.matchTitle} | {match.matchFormat} |{" "}
                    {match.matchVenue} |{" "}
                    {new Date(match.matchDateTime).toLocaleString()}
                  </div>
                  <div>
                    <button onClick={() => togglePlayers(match.matchId)}>
                      {visibleMatches[match.matchId] ? "Hide Players" : "See Players"}
                    </button>
                    {visibleMatches[match.matchId] && (
                      <div className="players-list">
                        {["team1", "team2"].map((teamKey) => {
                          const teamAbbr = match.teamAbbreviations[teamKey];
                          return (
                            <div key={teamAbbr}>
                              <h4>{teamAbbr}</h4>
                              <ul>
                                {getPlayersByTeam(teamAbbr).map((player) => (
                                  <li key={player.id}>
                                    {player.name} ({player.position}) - Points:{" "}
                                    {playersPoints[match.matchId]?.[teamAbbr]?.find(
                                      (p) => p.id === player.id
                                    )?.points || "N/A"}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                        <button onClick={() => {
                          assignPointsToMatch(match.matchId, match.teamAbbreviations.team1);
                          assignPointsToMatch(match.matchId, match.teamAbbreviations.team2);
                        }}>
                          Assign Points
                        </button>
                        <button onClick={() => saveMatchResults(match)}>Save Results</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerPoints;