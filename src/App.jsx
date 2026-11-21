import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";

const matches = [
  {
    id: 1,
    teams: "CSK vs MI",
    date: "28 Mar 2026, 7:30 PM",
    venue: "MA Chidambaram Stadium, Chennai",
    prices: { general: 1500, premium: 3500, vip: 7000 },
    teamCodes: ["csk", "mi"],
  },
  {
    id: 2,
    teams: "RCB vs KKR",
    date: "29 Mar 2026, 7:30 PM",
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    prices: { general: 2000, premium: 4000, vip: 8000 },
    teamCodes: ["rcb", "kkr"],
  },
  {
    id: 3,
    teams: "MI vs RCB",
    date: "01 Apr 2026, 3:30 PM",
    venue: "Wankhede Stadium, Mumbai",
    prices: { general: 2000, premium: 4500, vip: 9000 },
    teamCodes: ["mi", "rcb"],
  },
];

function App() {
  const [team, setTeam] = useState("all");

  const visibleMatches = matches.filter(
    (m) => team === "all" || m.teamCodes.includes(team)
  );

  return (
    <>
      <Navbar />
      <Hero />

      <section id="matches" className="section">
        <h2>Match Schedule</h2>

        <label htmlFor="teamFilter">Filter by Team: </label>
        <select
          id="teamFilter"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          <option value="all">All Teams</option>
          <option value="csk">Chennai Super Kings</option>
          <option value="mi">Mumbai Indians</option>
          <option value="rcb">Royal Challengers Bengaluru</option>
          <option value="kkr">Kolkata Knight Riders</option>
        </select>

        <div className="match-grid">
          {visibleMatches.map((m) => (
            <MatchCard
              key={m.id}
              matchNo={m.id}
              teams={m.teams}
              date={m.date}
              venue={m.venue}
              prices={m.prices}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default App;
