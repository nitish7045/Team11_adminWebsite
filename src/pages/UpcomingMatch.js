import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpcomingMatch.css"; // Import CSS file for styling

const UpcomingMatch = () => {
  const [footballMatches, setFootballMatches] = useState([]);
  const [cricketMatches, setCricketMatches] = useState([]);
  const [selectedSport, setSelectedSport] = useState("football");
  const [editableMatchId, setEditableMatchId] = useState(null);
  const [editedMatch, setEditedMatch] = useState({});

  useEffect(() => {
    fetchMatches("football", setFootballMatches);
    fetchMatches("cricket", setCricketMatches);
  }, []);

  const fetchMatches = async (sport, setMatches) => {
    const apiUrl = `https://fantacy-app-backend.onrender.com/auth/admin/${sport}/matches`;
    try {
      const response = await axios.get(apiUrl);
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const handleDelete = async (sport, matchId) => {
    const apiUrl = `https://fantacy-app-backend.onrender.com/auth/admin/${sport}/match/${matchId}`;
    try {
      await axios.delete(apiUrl);
      alert("Match deleted successfully");
      fetchMatches(sport, sport === "football" ? setFootballMatches : setCricketMatches);
    } catch (error) {
      alert("Error deleting match");
    }
  };

  const handleModify = (match) => {
    setEditableMatchId(match.matchId);
    setEditedMatch({ 
      ...match, 
      matchDateTime: new Date(match.matchDateTime).toISOString().slice(0, 16) // Format for input[type="datetime-local"]
    });
  };

  const handleInputChange = (e, field) => {
    setEditedMatch({ ...editedMatch, [field]: e.target.value });
  };

  const handleUpdate = async (sport, matchId) => {
    const apiUrl = `https://fantacy-app-backend.onrender.com/auth/admin/${sport}/match/${matchId}`;
    try {
      await axios.put(apiUrl, editedMatch);
      alert("Match updated successfully");
      setEditableMatchId(null);
      fetchMatches(sport, sport === "football" ? setFootballMatches : setCricketMatches);
    } catch (error) {
      alert("Error updating match");
    }
  };

  // Reset edit state when switching sport
  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
    setEditableMatchId(null);
    setEditedMatch({});
  };

  return (
    <div className="upcoming-match-container">
      <h2>Upcoming Matches</h2>
      <label>Select Sport: </label>
      <select
        className="sport-select"
        onChange={handleSportChange}
        value={selectedSport}
      >
        <option value="football">Football</option>
        <option value="cricket">Cricket</option>
      </select>

      {/* Football Matches */}
      {selectedSport === "football" && (
        <div>
          <h3>Football Matches</h3>
          <table className="match-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Series Name</th>
                <th>Title</th>
                <th>Format</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {footballMatches.map((match) => (
                <tr key={match.matchId}>
                  <td>{match.matchId}</td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input
                        value={editedMatch.seriesName}
                        onChange={(e) => handleInputChange(e, "seriesName")}
                      />
                    ) : (
                      match.seriesName
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input
                        value={editedMatch.matchTitle}
                        onChange={(e) => handleInputChange(e, "matchTitle")}
                      />
                    ) : (
                      match.matchTitle
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input
                        value={editedMatch.matchFormat}
                        onChange={(e) => handleInputChange(e, "matchFormat")}
                      />
                    ) : (
                      match.matchFormat
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input
                        value={editedMatch.matchVenue}
                        onChange={(e) => handleInputChange(e, "matchVenue")}
                      />
                    ) : (
                      match.matchVenue
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input
                        type="datetime-local"
                        value={editedMatch.matchDateTime}
                        onChange={(e) => handleInputChange(e, "matchDateTime")}
                      />
                    ) : (
                      new Date(match.matchDateTime).toLocaleString()
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <button className="save-button" onClick={() => handleUpdate("football", match.matchId)}>Save</button>
                    ) : (
                      <button className="modify-button" onClick={() => handleModify(match)}>Modify</button>
                    )}
                    <button className="delete-button" onClick={() => handleDelete("football", match.matchId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cricket Matches */}
      {selectedSport === "cricket" && (
        <div>
          <h3>Cricket Matches</h3>
          <table className="match-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Series Name</th>
                <th>Title</th>
                <th>Format</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cricketMatches.map((match) => (
                <tr key={match.matchId}>
                  <td>{match.matchId}</td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input value={editedMatch.seriesName} onChange={(e) => handleInputChange(e, "seriesName")} />
                    ) : (
                      match.seriesName
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input value={editedMatch.matchTitle} onChange={(e) => handleInputChange(e, "matchTitle")} />
                    ) : (
                      match.matchTitle
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input value={editedMatch.matchFormat} onChange={(e) => handleInputChange(e, "matchFormat")} />
                    ) : (
                      match.matchFormat
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input value={editedMatch.matchVenue} onChange={(e) => handleInputChange(e, "matchVenue")} />
                    ) : (
                      match.matchVenue
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <input type="datetime-local" value={editedMatch.matchDateTime} onChange={(e) => handleInputChange(e, "matchDateTime")} />
                    ) : (
                      new Date(match.matchDateTime).toLocaleString()
                    )}
                  </td>
                  <td>
                    {editableMatchId === match.matchId ? (
                      <button className="save-button" onClick={() => handleUpdate("cricket", match.matchId)}>Save</button>
                    ) : (
                      <button className="modify-button" onClick={() => handleModify(match)}>Modify</button>
                    )}
                    <button className="delete-button" onClick={() => handleDelete("cricket", match.matchId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpcomingMatch;
