import React, { useState, useEffect } from "react";
import "./TeatherBookingSeats.css";
import { Button, Input, message, Row, Col, Typography } from "antd";
import ClipLoader from "react-spinners/ClipLoader";
const { Title, Text } = Typography;

const TeatherBookingSeats = () => {
  // useState Initialization
  const [numberRows, setNumberRows] = useState(3);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);

  // useEffect Initialization
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleSeats(numberRows);
    }, 1000);
  }, []);

  // Function for Fetching seats
  const handleSeats = async (row) => {
    try {
      const response = await fetch(`https://codebuddy.review/seats?count=${row}`);
      const data = await response.json();
      setSeats(data);
    } catch (error) {
      console.error("Error fetching the seats:", error);
    }
  };

  // Function to get Prime Number Seats
  const isPrimeNumberSeats = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i < num; i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  // Function for selection of seats
  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < 5) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // useEffect for Total Cost Calculations
  useEffect(() => {
    const cost = selectedSeats.reduce((acc, seat) => {
      const row = Math.ceil(seat / numberRows);
      return acc + row * 10;
    }, 0);
    setTotalCost(cost + 20);
  }, [selectedSeats]);

  // Function for booking the final seats
  const handleFinalSubmit = async () => {
    setLoading(true);
    if (selectedSeats.length < 1) {
      message.error("Please select at least 1 seat");
      setLoading(false);
      return;
    }

    try {
      await fetch("https://codebuddy.review/submit", {
        method: "POST",
        body: JSON.stringify({ seats: selectedSeats }),
      });
      message.success("Seats booked successfully!");
    } catch (error) {
      console.error("Error submitting seats:", error);
      setLoading(false);
    }
    setLoading(false);
  };

  // Rendering JSX
  return (
    <div className="container">
      {loading ? (
        <div className="spinner-container">
          <ClipLoader color={"#6fb8e5"} loading={loading} size={50} className="custom-spinner" />
        </div>
      ) : (
        <>
          <header className="header">
            <Title level={2}>Theater Seat Booking System</Title>
          </header>
          <Row gutter={[16, 16]} className="seating-chart">
            <Col span={24}>
              <label>
                <Text strong>Enter Number of Rows:</Text>
                <Input
                  type="number"
                  min="3"
                  max="10"
                  value={numberRows}
                  onChange={(e) => setNumberRows(Number(e.target.value))}
                  className="number-of-rows"
                />
              </label>
              <Button className="common-btns" onClick={() => handleSeats(numberRows)}>
                Search Seats
              </Button>
            </Col>

            <Col span={24}>
              {Array.from({ length: numberRows }, (_, index) => (
                <Row key={index} gutter={[16, 16]} justify="center" className="row">
                  {Array.from({ length: index + 1 }, (_, seatIndex) => {
                    const seatNumber = (index * (index + 1)) / 2 + seatIndex + 1;
                    const isReserved = isPrimeNumberSeats(seatNumber);
                    return (
                      <Col key={seatNumber}>
                        <Button
                          disabled={isReserved}
                          className={selectedSeats.includes(seatNumber) ? "selected" : ""}
                          onClick={() => handleSeatClick(seatNumber)}
                        >
                          {`Row: ${index + 1} Seat: ${seatNumber}${isReserved ? " (Reserved)" : ""}`}
                        </Button>
                      </Col>
                    );
                  })}
                </Row>
              ))}
            </Col>

            <Col span={24} className="btn-submit-seats">
              <Button className="common-btns" onClick={handleFinalSubmit}>
                Submit Selected Seats
              </Button>
            </Col>

            <Col span={24} className="total-cost">
              <Text strong>Total Cost: ${totalCost}</Text>
            </Col>
          </Row>
          <footer className="footer">
            <Text type="secondary">© 2024 Theater Booking. All rights reserved.</Text>
          </footer>
        </>
      )}
    </div>
  );
};

export default TeatherBookingSeats;
