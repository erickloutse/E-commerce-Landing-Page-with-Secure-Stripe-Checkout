/**
 * Middleware de gestion centralisée des erreurs
 */

// Classe d'erreur personnalisée pour les erreurs API
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  let error = err;
  
  // Si l'erreur n'est pas une instance de ApiError, la convertir
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Erreur serveur';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  
  // Déterminer le code de statut HTTP
  const statusCode = error.statusCode || 500;
  
  // Préparer la réponse
  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };
  
  // Journaliser l'erreur
  console.error(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${error.message}`);
  
  // Envoyer la réponse
  res.status(statusCode).json(response);
};

// Middleware pour capturer les erreurs non gérées
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route non trouvée - ${req.originalUrl}`);
  next(error);
};

export { ApiError, errorHandler, notFoundHandler };