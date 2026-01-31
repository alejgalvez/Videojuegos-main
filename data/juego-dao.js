const db = require('./database');

class JuegoDAO {
    
    // Obtener todos los juegos de un usuario específico
    static obtenerTodos(userId) {
        const sql = 'SELECT * FROM games WHERE user_id = ?';
        return db.prepare(sql).all(userId);
    }

    // Obtener un juego por ID (para editarlo)
    static obtenerPorId(id, userId) {
        const sql = 'SELECT * FROM games WHERE id = ? AND user_id = ?';
        return db.prepare(sql).get(id, userId);
    }

    // Crear nuevo juego
    static crear(titulo, plataforma, genero, estado, userId) {
        const sql = `
            INSERT INTO games (titulo, plataforma, genero, estado, user_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const info = db.prepare(sql).run(titulo, plataforma, genero, estado, userId);
        return info.lastInsertRowid;
    }

    // Actualizar juego existente
    static actualizar(id, titulo, plataforma, genero, estado, userId) {
        const sql = `
            UPDATE games 
            SET titulo = ?, plataforma = ?, genero = ?, estado = ? 
            WHERE id = ? AND user_id = ?
        `;
        const info = db.prepare(sql).run(titulo, plataforma, genero, estado, id, userId);
        return info.changes > 0;
    }

    // Eliminar juego
    static eliminar(id, userId) {
        const sql = 'DELETE FROM games WHERE id = ? AND user_id = ?';
        const info = db.prepare(sql).run(id, userId);
        return info.changes > 0;
    }
}

module.exports = JuegoDAO;