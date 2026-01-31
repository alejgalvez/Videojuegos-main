const express = require('express');
const router = express.Router();

// Importar DAOS
const UsuarioDAO = require('../data/usuario-dao');
const JuegoDAO = require('../data/juego-dao');

const requireAuth = require('../middleware/auth');

// 1. Página de Inicio
router.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('index', { title: 'Iniciar Sesión', error: null });
});

// 2. Procesar Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = UsuarioDAO.obtenerPorUsername(username);

    if (user && UsuarioDAO.validarPassword(password, user.password)) {
        req.session.user = { id: user.id, username: user.username };
        res.redirect('/dashboard');
    } else {
        res.render('index', { title: 'Iniciar Sesión', error: 'Usuario o contraseña incorrectos' });
    }
});

// 3. Página de Registro
router.get('/registro', (req, res) => {
    res.render('registro', { title: 'Crear Cuenta', error: null });
});

// 4. Procesar Registro
router.post('/registro', (req, res) => {
    const { username, password } = req.body;
    try {
        if(!username || !password) throw new Error("Faltan datos");
        UsuarioDAO.crear(username, password);
        res.redirect('/?mensaje=registrado');
    } catch (err) {
        res.render('registro', { title: 'Crear Cuenta', error: err.message });
    }
});

// 5. Cerrar Sesión
router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

// 6. Dashboard 
router.get('/dashboard', requireAuth, (req, res) => {
    const misJuegos = JuegoDAO.obtenerTodos(req.session.user.id);
    res.render('dashboard', { title: 'Mi Colección', juegos: misJuegos });
});

// 7. Formulario Nuevo Juego
router.get('/juegos/nuevo', requireAuth, (req, res) => {
    res.render('formulario-juego', { title: 'Nuevo Videojuego', juego: null });
});

// 8. Guardar Nuevo Juego
router.post('/juegos/guardar', requireAuth, (req, res) => {
    const { titulo, plataforma, genero, estado } = req.body;
    const userId = req.session.user.id;
    JuegoDAO.crear(titulo, plataforma, genero, estado, userId);
    res.redirect('/dashboard');
});

// 9. Formulario Editar Juego
router.get('/juegos/editar/:id', requireAuth, (req, res) => {
    const juegoId = req.params.id;
    const userId = req.session.user.id;
    const juego = JuegoDAO.obtenerPorId(juegoId, userId);

    if (!juego) return res.redirect('/dashboard');

    res.render('formulario-juego', { title: 'Editar Videojuego', juego: juego });
});

// 10. Guardar Edición
router.post('/juegos/editar/:id', requireAuth, (req, res) => {
    const juegoId = req.params.id;
    const userId = req.session.user.id;
    const { titulo, plataforma, genero, estado } = req.body;
    
    JuegoDAO.actualizar(juegoId, titulo, plataforma, genero, estado, userId);
    res.redirect('/dashboard');
});

// 11. Eliminar Juego
router.get('/juegos/eliminar/:id', requireAuth, (req, res) => {
    const juegoId = req.params.id;
    const userId = req.session.user.id;
    JuegoDAO.eliminar(juegoId, userId);
    res.redirect('/dashboard');
});

module.exports = router;