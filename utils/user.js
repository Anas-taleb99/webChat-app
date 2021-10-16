const users = [];

// join users to chat

function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);
  return user;
}

// Get current user 
function getCurrentUser(id) {
  return users.find(user =>  user.id === id);
}

// User leave chat
function userLeave(id) {
  // this line gets you the index of the current user
  const index = users.findIndex(user => user.id === id);

  // if user is not exist the result is going to be -1
  if (index !== -1) {
    // remove current user by index
    return users.splice(index, 1)[0];
  }
}

// Get room users 
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin, 
  getCurrentUser,
  userLeave, 
  getRoomUsers
}