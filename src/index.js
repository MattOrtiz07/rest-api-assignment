const express = require('express');
const app = express();
const port = 3000;
const { v4: uuidv4 } = require('uuid');

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// In-memory storage for users
let users = [];

// Helper function to find user by ID
const findUserById = (id) => {
  return users.find(user => user.id === id);
};

// Helper function to validate user data
const validateUserData = (name, email) => {
  return name && email && typeof name === 'string' && typeof email === 'string';
};

// 1. CREATE USER - POST /users
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validate required fields
  if (!validateUserData(name, email)) {
    return res.status(400).json({ 
      error: 'Bad Request', 
      message: 'Name and email are required and must be strings' 
    });
  }
  
  // Create new user with unique ID
  const newUser = {
    id: uuidv4(),
    name: name.trim(),
    email: email.trim()
  };
  
  // Add to users array
  users.push(newUser);
  
  // Return created user with 201 status
  res.status(201).json(newUser);
});

// 2. RETRIEVE USER - GET /users/:id
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  
  // Find user by ID
  const user = findUserById(id);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'Not Found', 
      message: 'User not found' 
    });
  }
  
  // Return user with 200 status
  res.status(200).json(user);
});

// 3. UPDATE USER - PUT /users/:id
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  // Validate required fields
  if (!validateUserData(name, email)) {
    return res.status(400).json({ 
      error: 'Bad Request', 
      message: 'Name and email are required and must be strings' 
    });
  }
  
  // Find user by ID
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ 
      error: 'Not Found', 
      message: 'User not found' 
    });
  }
  
  // Update user data
  users[userIndex] = {
    id,
    name: name.trim(),
    email: email.trim()
  };
  
  // Return updated user with 200 status
  res.status(200).json(users[userIndex]);
});

// 4. DELETE USER - DELETE /users/:id
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  // Find user index
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ 
      error: 'Not Found', 
      message: 'User not found' 
    });
  }
  
  // Remove user from array
  users.splice(userIndex, 1);
  
  // Return 204 No Content (no response body)
  res.status(204).send();
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing