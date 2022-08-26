import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket = io("https://am-chatt-backend.herokuapp.com/");

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      socket.emit("ready");
    });
    socket.on("chat message", (history) => {
      console.log("New message");
      console.log(history);
      setMessages(history);
    });
    socket.on("updated_state", (data) => {
      console.log(data);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log("You clicked submit.");

    console.log(e.target.message.value);
    socket.emit("chat message", e.target.message.value);
  }

  function createRoom() {
    const roomName = prompt("Name the room:");

    socket.emit("create_room", roomName);
    console.log("skapade rum:", roomName);
  }

  function joinRoom() {
    const roomName = prompt("Which room do you want to join?");

    socket.emit("join_room", roomName);
    console.log(`${socket.id} joined room: `, roomName);
  }

  function deleteRoom() {
    const roomName = prompt("Which room do you want to delete?");

    socket.emit("delete_room", roomName);
    console.log(`${socket.id} deleted room: `, roomName);
  }

  function leaveRoom() {
    const roomName = "default";
    socket.emit("join_room", roomName);
    console.log(`${socket.id} joined room: `, "default");
  }

  return (
    <div className="App">
      <title>Chatrooms</title>
      <h1>Chatroom</h1>

      <button onClick={createRoom}>Create room</button>
      <button onClick={joinRoom}>Join room</button>
      <button onClick={deleteRoom}>Delete room</button>
      <button onClick={leaveRoom}>Leave room</button>

      <form onSubmit={handleSubmit}>
        <input name="message"></input>
        <button type="submit">Send</button>
        <br></br>

        <ul>
          {messages.map(({ message, id, date }) => {
            return (
              <li className="li">
                {date}
                <br />
                {id}:<div className="separate"></div> {message}
              </li>
            );
          })}
        </ul>
      </form>
    </div>
  );
}

export default App;
