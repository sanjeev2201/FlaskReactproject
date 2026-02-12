import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5001/r/rooms')
      .then(response => setRooms(response.data))
      .catch(error => console.error('Error fetching rooms:', error));
  }, []);

  return (
    <div>
      <h2>Room List</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>
            Room {room.number} - {room.type} - {room.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
