const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Database Connection Configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mizan11#', // Insert your MySQL root password here
    database: 'jakaria'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database: jakaria');
    }
});

// Endpoint to handle User Signup
app.post('/api/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Hash password before saving to database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = 'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)';
        
        db.query(sql, [fullName, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Insert error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email is already registered.' });
                }
                return res.status(500).json({ message: 'Database error occurred.' });
            }
            return res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error occurred.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});