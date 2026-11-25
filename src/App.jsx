import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import BookingForm from "./components/BookingForm";
import { supabase } from "./supabase";

async function fetchMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("id");

  if (error) {
    throw error;
  }

  return data;
}

function App() {
  const [team, setTeam] = useState("all");
  const [matches, setMatches] = useState([]);
  const [matchId, setMatchId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMatches = useCallback(async () => {
    try {
      setMatches(await fetchMatches());
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchMatches()
      .then((data) => {
        if (active) {
          setMatches(data);
          setError("");
        }
      })
      .catch((error) => {
        if (active) {
          setError(error.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    const channel = supabase
      .channel("matches-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => loadMatches()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [loadMatches]);

  const visibleMatches = matches.filter(
    (match) => team === "all" || match.teams.includes(team)
  );

  function selectMatch(id) {
    setMatchId(String(id));
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  }

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

        {loading && <p>Loading matches...</p>}
        {error && <p role="alert">Error: {error}</p>}

        <div className="match-grid">
          {visibleMatches.map((match) => (
            <MatchCard key={match.id} match={match} onBook={selectMatch} />
          ))}
        </div>
      </section>

      <BookingForm
        matches={matches}
        matchId={matchId}
        setMatchId={setMatchId}
        onDone={loadMatches}
      />
    </>
  );
}

export default App;
