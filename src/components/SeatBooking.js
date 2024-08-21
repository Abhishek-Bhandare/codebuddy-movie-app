import React, { useState, useEffect } from 'react';
import SeatRow from './SeatRow';
import 'bootstrap/dist/css/bootstrap.min.css';

const SeatBooking = () => {
  const [rowCount, setRowCount] = useState(3);
  const [rows, setRows] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const fetchSeats = async () => {
    try {
      const response = await fetch(`https://codebuddy.review/seats?count=${rowCount}`);
      const data = await response.json();
      setReservedSeats(data);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  const handleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else if (selectedSeats.length < 10) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const calculateTotalCost = () => {
    const basePrice = 0;
    const seatCost = selectedSeats.reduce((total, seat) => {
      const rowNumber = Math.ceil((Math.sqrt(8 * seat + 1) - 1) / 2);
      return total + rowNumber * 10;
    }, 0);
    setTotalCost(basePrice + seatCost);
  };

  const handleSubmit = async () => {
    if (selectedSeats.length < 1) {
      alert('Please select at least one seat.');
      return;
    }

    try {
      const response = await fetch('https://codebuddy.review/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats: selectedSeats })
      });
      const data = await response.json();
      alert(`Booking successful: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Error submitting seats:', error);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [rowCount]);

  useEffect(() => {
    calculateTotalCost();
  }, [selectedSeats]);

  useEffect(() => {
    const newRows = [];
    for (let i = 1; i <= rowCount; i++) {
      const seatsInRow = Array.from({ length: i }, (_, index) => i * (i - 1) / 2 + index + 1);
      newRows.push(seatsInRow);
    }
    setRows(newRows);
  }, [rowCount]);

  return (
    <div className="container">
      <h2>Seat Booking</h2>
      <div className="mb-3">
        <label>Number of Rows:</label>
        <input
          type="number"
          value={rowCount}
          onChange={(e) => setRowCount(Math.max(3, Math.min(10, parseInt(e.target.value, 10))))}
          className="form-control"
          min="3"
          max="10"
        />
      </div>
      {rows.map((seats, rowIndex) => (
        <SeatRow
          key={rowIndex}
          rowNumber={rowIndex + 1}
          seats={seats}
          handleSeatSelection={handleSeatSelection}
          selectedSeats={selectedSeats}
          reservedSeats={reservedSeats}
        />
      ))}
      <div className="d-flex justify-content-between mt-4">
        <h4>Total Cost: ${totalCost}</h4>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Booking
        </button>
      </div>
    </div>
  );
};

export default SeatBooking;
