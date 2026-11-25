import { useState } from "react";
import { supabase } from "../supabase";

const empty = { stand: "", quantity: 1, name: "", email: "", phone: "" };

function BookingForm({ matches, matchId, setMatchId, onDone }) {
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");

  const match = matches.find((item) => item.id === Number(matchId));
  const price = match && form.stand ? Number(match["price_" + form.stand]) : 0;
  const quantity = Number(form.quantity);
  const total = price * quantity;

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!match) {
      setMessage("Please select a match.");
      return;
    }

    const qty = Number(form.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      setMessage("Choose between 1 and 10 tickets.");
      return;
    }

    if (qty > match.available_seats) {
      setMessage("Only " + match.available_seats + " seats left.");
      return;
    }

    try {
      const { error: insertError } = await supabase.from("bookings").insert({
        match_id: match.id,
        stand: form.stand,
        quantity: qty,
        name: form.name,
        email: form.email,
        phone: form.phone,
        total_amount: total,
      });

      if (insertError) {
        setMessage("Booking failed: " + insertError.message);
        return;
      }

      const { error: updateError } = await supabase
        .from("matches")
        .update({ available_seats: match.available_seats - qty })
        .eq("id", match.id);

      if (updateError) {
        setMessage("Seats update failed: " + updateError.message);
        return;
      }

      setMessage("Booking confirmed! Total ₹" + total.toLocaleString("en-IN"));
      setForm(empty);
      await onDone();
    } catch (error) {
      setMessage("Booking failed: " + error.message);
    }
  }

  return (
    <section id="booking" className="section">
      <h2>Book Your Ticket</h2>
      <div className="booking-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="match">Match:</label>
          <select
            id="match"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            required
          >
            <option value="">-- Select Match --</option>
            {matches.map((item) => (
              <option key={item.id} value={item.id}>{item.teams}</option>
            ))}
          </select>

          <label htmlFor="stand">Stand Category:</label>
          <select id="stand" name="stand" value={form.stand} onChange={change} required>
            <option value="">-- Select Stand --</option>
            <option value="general">General</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>

          <label htmlFor="quantity">Number of Tickets:</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            max="10"
            value={form.quantity}
            onChange={change}
            required
          />

          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            minLength="3"
            value={form.name}
            onChange={change}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            required
          />

          <label htmlFor="phone">Phone Number:</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            pattern="[6-9][0-9]{9}"
            title="10-digit mobile number"
            value={form.phone}
            onChange={change}
            required
          />

          <button type="submit">Confirm Booking</button>
          {message && <p className="message" role="status">{message}</p>}
        </form>

        <aside className="summary-card">
          <h3>Booking Summary</h3>
          <p><strong>Match:</strong> {match ? match.teams : "-"}</p>
          <p><strong>Stand:</strong> {form.stand ? form.stand.toUpperCase() : "-"}</p>
          <p><strong>Ticket Price:</strong> ₹{price.toLocaleString("en-IN")}</p>
          <p><strong>Quantity:</strong> {form.quantity}</p>
          <p><strong>Total Amount:</strong> ₹{total.toLocaleString("en-IN")}</p>
        </aside>
      </div>
    </section>
  );
}

export default BookingForm;
