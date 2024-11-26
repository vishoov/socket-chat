import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client';


const App = () => {

  const socket = useMemo(() => io("http://localhost:3000", {
    withCredentials: true,
    cors: {
      origin: "http://localhost:5173"
    }
  }), []);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = React.useState('');
  const [room, setroom] = React.useState('');
  const [socketID, setsocketID] = useState('');
  const [roomName, setroomName] = useState('');

// console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', {message, room});
    setMessage('');
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join-room', {roomName});
    setroomName('');
  };

  useEffect(() => {
    socket.on('connect', () => {
      setsocketID(socket.id);
      console.log('Connected to server', socket.id);
    });
    
    socket.on("welcome", (data) => {
      console.log(data);

    });

    socket.on('receive-message', (data) => {
      console.log(data.message);
      setMessages((prev) => [...prev, data.message]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  return (
   <Container maxWidth='sm'>
    <Typography variant='h1' gutterBottom>
      {socketID}
    </Typography>

    <form onSubmit={joinRoomHandler} >
    <h5> Join Room </h5>

    <TextField value={roomName} 
      onChange={e=>setroomName(e.target.value)}
      id='outlined-basic'
      label="Room Name"
      variant="outlined"></TextField>

    <Button variant='contained' color='primary' type='submit'>
        Join
    </Button>


    </form>
   

    <form onSubmit={handleSubmit}>
      <TextField value={message} 
      onChange={e=>setMessage(e.target.value)}
      id='outlined-basic'
      label="Message"
      variant="outlined">

      </TextField>
      <TextField 
      value={room}
      onChange={e=>setroom(e.target.value)} 
      id='outlined-basic' 
      label="Room" 
      variant="outlined">

      </TextField>
      <Button variant='contained' color='primary' type='submit'>
        Send
      </Button>

    </form>
    <Box height="100"></Box>

    {/* for displaying messages */}
    <Stack>
      {messages.map((msg, index) => (
        <Typography key={index} variant='h6' gutterBottom>
          {msg}
        </Typography>
      ))}


    </Stack>

    </Container>
  )
}

export default App