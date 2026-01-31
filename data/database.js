const Database = require('better-sqlite3');
const path = require('path');

const db = new Database('juegos.sqlite', { verbose: console.log });

// Inicializar tablas (Usuarios y Juegos)
const initDB = () => {
    // Tabla Usuarios
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `).run();

    // Tabla Juegos
    db.prepare(`
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            plataforma TEXT NOT NULL,
            genero TEXT,
            estado TEXT DEFAULT 'pendiente',
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `).run();
    
    console.log("Tablas 'users' y 'games' verificadas/creadas.");
};

initDB();

module.exports = db;