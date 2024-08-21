import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SeatRow = ({ rowNumber, seats, handleSeatSelection, selectedSeats, reservedSeats }) => {
  return (
    <div className="d-flex justify-content-center mb-3">
      {seats.map((seat, index) => {
        const seatNumber = rowNumber + index;
        const isReserved = reservedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);

        return (
          <button
            key={seatNumber}
            disabled={isReserved}
            onClick={() => handleSeatSelection(seatNumber)}
            className={`btn m-1 ${isReserved ? 'btn-danger' : isSelected ? 'btn-success' : 'btn-secondary'}`}
          >
            Row {rowNumber} - Seat {seatNumber} <br />
            {isReserved ? 'Reserved' : 'Available'}
          </button>
        );
      })}
    </div>
  );
};

export default SeatRow;
