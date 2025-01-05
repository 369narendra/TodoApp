const mongoose = require('mongoose');

// Use an updated connection string and remove deprecated options
const connectionString = '';
                          
mongoose.connect(connectionString)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((error) => {
    console.error("Connection Failed:", error.message);
  });

// Schemas
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
});

const CompletedSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
});

// Models
const User = mongoose.model('User', UserSchema);
const alltodo = mongoose.model('AllTodo', TodoSchema);
const CmpltdTodo = mongoose.model('CompletedTodo', CompletedSchema);

module.exports = { User,alltodo, CmpltdTodo };
