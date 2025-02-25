import React, { useState } from "react";
import axios from "axios";
import "./AddMatchForm.css"; // Import CSS file for styling

const cricketTeams = [
  { name: "India", abbreviation: "IND", flag: "https://flagcdn.com/w320/in.png" },
  { name: "Australia", abbreviation: "AUS", flag: "https://flagcdn.com/w320/au.png" },
  { name: "Pakistan", abbreviation: "PAK", flag: "https://flagcdn.com/w320/pk.png" },
  { name: "England", abbreviation: "ENG", flag: "https://flagcdn.com/w320/gb.png" },
  { name: "Bangladesh", abbreviation: "BAN", flag: "https://flagcdn.com/w320/bd.png" },
  { name: "Sri Lanka", abbreviation: "SL", flag: "https://flagcdn.com/w320/lk.png" },
  { name: "South Africa", abbreviation: "SA", flag: "https://flagcdn.com/w320/za.png" },
  { name: "New Zealand", abbreviation: "NZ", flag: "https://flagcdn.com/w320/nz.png" },
  { name: "West Indies", abbreviation: "WI", flag: "https://flagcdn.com/w320/jm.png" },
  { name: "Afghanistan", abbreviation: "AFG", flag: "https://flagcdn.com/w320/af.png" },
];

const footballTeams = [
  { name: "Manchester United", abbreviation: "MUFC", flag: "https://flagcdn.com/w320/gb.png" }, // England
  { name: "Liverpool", abbreviation: "LFC", flag: "https://flagcdn.com/w320/gb.png" }, // England
  { name: "Real Madrid", abbreviation: "RM", flag: "https://flagcdn.com/w320/es.png" }, // Spain
  { name: "Barcelona", abbreviation: "BAR", flag: "https://flagcdn.com/w320/es.png" }, // Spain
  { name: "Juventus", abbreviation: "JUV", flag: "https://flagcdn.com/w320/it.png" }, // Italy
  { name: "AC Milan", abbreviation: "ACM", flag: "https://flagcdn.com/w320/it.png" }, // Italy
  { name: "Bayern Munich", abbreviation: "FCB", flag: "https://flagcdn.com/w320/de.png" }, // Germany
  { name: "Borussia Dortmund", abbreviation: "BVB", flag: "https://flagcdn.com/w320/de.png" }, // Germany
  { name: "LA Galaxy", abbreviation: "LAG", flag: "https://flagcdn.com/w320/us.png" }, // USA
  { name: "Seattle Sounders FC", abbreviation: "SSFC", flag: "https://flagcdn.com/w320/us.png" }, // USA
];

const AddMatchForm = () => {
  const [sport, setSport] = useState("football");
  const [matchData, setMatchData] = useState({
    seriesName: "",
    matchTitle: "",
    matchFormat: "",
    matchVenue: "",
    matchDateTime: "",
    team1: "",
    team2: "",
    teamFlags: { team1: "", team2: "" },
    teamAbbreviations: { team1: "", team2: "" },
  });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleChange = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  const handleTeamChange = (team, value) => {
    const selectedTeam = (sport === "football" ? footballTeams : cricketTeams).find((t) => t.name === value);
    if (selectedTeam) {
      setMatchData({
        ...matchData,
        [team]: value,
        teamFlags: { ...matchData.teamFlags, [team]: selectedTeam.flag },
        teamAbbreviations: { ...matchData.teamAbbreviations, [team]: selectedTeam.abbreviation },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    const apiUrl =
      sport === "football"
        ? "https://fantacy-app-backend.onrender.com/auth/admin/football/match"
        : "https://fantacy-app-backend.onrender.com/auth/admin/cricket/match";

    try {
      const response = await axios.post(apiUrl, matchData);
      setPopupMessage(response.data.message);
      setShowPopup(true);
      setMatchData({
        seriesName: "",
        matchTitle: "",
        matchFormat: "",
        matchVenue: "",
        matchDateTime: "",
        team1: "",
        team2: "",
        teamFlags: { team1: "", team2: "" },
        teamAbbreviations: { team1: "", team2: "" },
      });
    } catch (error) {
      setPopupMessage("Error adding match: " + error.response?.data?.message);
      setShowPopup(true);
    } finally {
      setLoading(false); // Stop loading after API response
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="add-match-container">
      <h1>Add Match</h1>
      <form onSubmit={handleSubmit} className="match-form">
        <div className="form-row">
          <div className="form-group">
            <label>Sport Type</label>
            <select value={sport} onChange={(e) => setSport(e.target.value)}>
              <option value="football">Football</option>
              <option value="cricket">Cricket</option>
            </select>
          </div>

          <div className="form-group">
            <label>Series Name</label>
            <input
              type="text"
              name="seriesName"
              placeholder="Series Name"
              value={matchData.seriesName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Match Title</label>
            <input
              type="text"
              name="matchTitle"
              placeholder="Match Title"
              value={matchData.matchTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Match Format</label>
            <input
              type="text"
              name="matchFormat"
              placeholder="Match Format"
              value={matchData.matchFormat}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Match Venue</label>
            <input
              type="text"
              name="matchVenue"
              placeholder="Match Venue"
              value={matchData.matchVenue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Match Date & Time</label>
            <input
              type="datetime-local"
              name="matchDateTime"
              value={matchData.matchDateTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Team 1</label>
            <select
              value={matchData.team1}
              onChange={(e) => handleTeamChange("team1", e.target.value)}
              required
            >
              <option value="">Select Team 1</option>
              {(sport === "football" ? footballTeams : cricketTeams).map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            {matchData.teamFlags.team1 && (
              <img src={matchData.teamFlags.team1} alt="Team 1 Flag" className="team-flag" />
            )}
          </div>

          <div className="form-group">
            <label>Team 2</label>
            <select
              value={matchData.team2}
              onChange={(e) => handleTeamChange("team2", e.target.value)}
              required
            >
              <option value="">Select Team 2</option>
              {(sport === "football" ? footballTeams : cricketTeams).map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            {matchData.teamFlags.team2 && (
              <img src={matchData.teamFlags.team2} alt="Team 2 Flag" className="team-flag" />
            )}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? <span className="loader"></span> : "Add Match"}
        </button>
      </form>

      {/* Popup for Success/Error Messages */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMatchForm;