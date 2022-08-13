import express from 'express';
import configViewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';
import initApiRoutes from './routes/api';
import configCors from './config/cors';
require("dotenv").config();
import bodyParser from 'body-parser';
import connection from './config/connectDB';
import { createJWT, verifyToken } from './middleware/JWTAction';

const app = express();
const PORT = process.env.PORT || 8080;

// config cors
configCors(app);

// config view engine
configViewEngine(app);

// config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// test connection db 
connection();

// test jwt
createJWT ();
let decodedData = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicXVhbmciLCJhZGRyZXNzIjoidGF5IG5pbmgiLCJpYXQiOjE2NjAzODM0MDB9.r2FHUMcKbFE0K4i_dK24UJHHvlb_3VWHiQEijbes_l4")
console.log(decodedData);

// init web routes
initWebRoutes(app);
initApiRoutes(app);

app.listen(PORT, () => {
    console.log(">>> JWT Backend is running on the port = " + PORT);
});