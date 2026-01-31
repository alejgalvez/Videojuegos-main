// Middleware para proteger rutas privadas
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        next(); // Usuario autenticado, continúa
    } else {
        res.redirect('/'); // No autenticado, fuera
    }
};

module.exports = requireAuth;