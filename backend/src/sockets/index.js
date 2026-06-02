function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join-board', (boardId) => {
      socket.join(`board:${boardId}`);
    });

    socket.on('leave-board', (boardId) => {
      socket.leave(`board:${boardId}`);
    });
  });
}

module.exports = {
  registerSocketHandlers
};
