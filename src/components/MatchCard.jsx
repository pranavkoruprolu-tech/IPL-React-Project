function MatchCard({ match, onBook }) {
  const soldOut = match.available_seats <= 0;

  return (
    <article className="match-card">
      <div>
        <h3>{match.teams}</h3>
        <p>Match {match.id} | {match.match_date}</p>
        <p>{match.venue}</p>
        <p>
          General ₹{match.price_general.toLocaleString("en-IN")} | Premium ₹
          {match.price_premium.toLocaleString("en-IN")} | VIP ₹
          {match.price_vip.toLocaleString("en-IN")}
        </p>
        <p><strong>Seats left: {match.available_seats}</strong></p>
      </div>
      <button type="button" disabled={soldOut} onClick={() => onBook(match.id)}>
        {soldOut ? "Sold Out" : "Book"}
      </button>
    </article>
  );
}

export default MatchCard;
