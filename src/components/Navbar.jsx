import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <nav>
        <h2 className="logo">IPL Booking 2026</h2>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setOpen(!open)}
        >
          &#9776;
        </button>

        <ul className={open ? "nav-links open" : "nav-links"}>
          <li><a href="#matches">Matches</a></li>
          <li><a href="#booking">Book Ticket</a></li>
          <li><a href="#my-bookings">My Bookings</a></li>
          <li><a href="#guidelines">Guidelines</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;