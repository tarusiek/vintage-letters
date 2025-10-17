import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'letters.db');

export const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Connected to SQLite database.');
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS letters (
                id TEXT PRIMARY KEY,
                topic TEXT NOT NULL,
                content TEXT NOT NULL,
                signature TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
};

export const insertLetter = (db, letter) => {
    return new Promise((resolve, reject) => {
        const { id, topic, content, signature } = letter;
        db.run(
            'INSERT INTO letters (id, topic, content, signature) VALUES (?, ?, ?, ?)',
            [id, topic, content, signature],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(id);
                }
            }
        );
    });
};

export const getLetter = (db, id) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM letters WHERE id = ?',
            [id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
};