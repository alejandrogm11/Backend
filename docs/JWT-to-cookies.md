# Importar cookie parser al application .ts
import cookieParser from 'cookie-parser';

// Dentro del constructor, después de this.sequence(MySequence):
this.expressMiddleware(cookieParser, {})

###*Express Middleware*
*expressMiddleware es el método de LoopBack para decirle: "antes de que este request llegue a mis controllers, pásalo por este middleware de Express". El segundo argumento son opciones de configuración, en este caso vacías porque no necesitas nada especial.*