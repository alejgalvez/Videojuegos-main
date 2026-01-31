const db = require('./database');
const bcrypt = require('bcryptjs');

class UsuarioDAO {
    static obtenerPorUsername(username) {
        const sql = 'SELECT * FROM users WHERE username = ?';
        return db.prepare(sql).get(username);
    }

    static crear(username, password) {
        const passwordHash = bcrypt.hashSync(password, 10);
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        try {
            const info = db.prepare(sql).run(username, passwordHash);
            return info.lastInsertRowid;
        } catch (error) {
            throw new Error('El nombre de usuario ya existe');
        }
    }

    static validarPassword(passwordPlana, passwordHash) {
        return bcrypt.compareSync(passwordPlana, passwordHash);
    }
}

module.exports = UsuarioDAO;