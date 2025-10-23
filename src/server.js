import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './socket.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    initSocket(server);
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
  });
