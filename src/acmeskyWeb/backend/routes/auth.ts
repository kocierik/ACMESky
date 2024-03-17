import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import pool from "../utils/db"

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

interface User {
  id: number;
  email: string;
  password: string;
}

// Funzione per la registrazione di un nuovo utente
async function registerUser(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  try {
    // Controlla se l'utente esiste già
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Utente già registrato' });
    }

    // Se l'utente non esiste già, procedi con la registrazione
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query<User>('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [
      email,
      hashedPassword,
    ]);
    const user = result.rows[0];

    // Genera il token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Registrazione avvenuta con successo', id: user.id, token });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
}

// Funzione per il login di un utente esistente e generazione del token JWT
async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const result = await pool.query<User>('SELECT * FROM users WHERE email= $1', [email]);
    const user = result.rows[0];
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Accesso riuscito', token, id: user.id });
      } else {
        res.status(401).json({ error: 'Credenziali non valide' });
      }
    } else {
      res.status(401).json({ error: 'Credenziali non valide' });
    }
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ error: 'Errore durante il login' });
  }
}

export { registerUser, loginUser };

