function MatchCard({ matchNo, teams, date, venue, prices }) {
  return (
    <article className="match-card">
      <div>
        <h3>{teams}</h3>
        <p>Match {matchNo} | {date}</p>
        <p>{venue}</p>
        <p>
          General ₹{prices.general.toLocaleString("en-IN")} | Premium ₹{prices.premium.toLocaleString("en-IN")} | VIP ₹{prices.vip.toLocaleString("en-IN")}
        </p>
      </div>
      <button type="button">Book</button>
    </article>
  );
}

export default MatchCard;