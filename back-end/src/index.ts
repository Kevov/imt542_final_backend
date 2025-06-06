import express from "express";
import { getSteamInfo } from "./getSteamInfo";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // Allow all origins for simplicity; adjust as needed for security
    methods: ['GET', 'POST'] // Allow specific methods
}));

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Node.js Server lol!');
});

app.get('/generate_from_id', async (req, res): Promise<void> => {
    const steam_id = typeof req.query.steamid === 'string' ? req.query.steamid : Array.isArray(req.query.steamid) ? req.query.steamid[0] : undefined;
    try {
        if (!steam_id) {
            res.status(400).json({ error: 'Article content is required for summarization.' });
            return;
        }
        if (Array.isArray(steam_id)) {
            res.status(400).json({ error: 'Only one steamid is allowed.' });
            return;
        }
        const info = await getSteamInfo(steam_id as string);
        res.json(info);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the response' });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

// Endpoint to check the status of the server
app.get('/ping', (_, res) => {
	res.jsonp({ message: 'pong' });
});