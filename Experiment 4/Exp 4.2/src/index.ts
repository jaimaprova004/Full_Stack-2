import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

const port = Number(process.env.PORT ?? 4210);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
