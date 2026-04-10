# Importar cookie parser al application .ts
import cookieParser from 'cookie-parser';

// Dentro del constructor, después de this.sequence(MySequence):
this.expressMiddleware(cookieParser, {})

