import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { initializeDatabase, insertLetter, getLetter } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let db;

// Initialize database and start server
initializeDatabase().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Create a new letter
app.post('/api/letters', async (req, res) => {
    try {
        const { topic, content, signature } = req.body;
        
        if (!topic || !content || !signature) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const id = uuidv4();
        const letter = { id, topic, content, signature };
        
        await insertLetter(db, letter);
        
        res.json({ 
            success: true, 
            id: id,
            shareUrl: `http://localhost:5173/letter/${id}`
        });
    } catch (error) {
        console.error('Error creating letter:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a letter by ID
app.get('/api/letters/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const letter = await getLetter(db, id);
        
        if (!letter) {
            return res.status(404).json({ error: 'Letter not found' });
        }
        
        res.json(letter);
    } catch (error) {
        console.error('Error fetching letter:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});