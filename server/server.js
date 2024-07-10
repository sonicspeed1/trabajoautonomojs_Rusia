const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

const baseDir = path.join(__dirname, '../html');


app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'qiz_db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});


app.use(express.static(baseDir));
app.use('/media', express.static(path.join(__dirname, '../media')));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/javascript', express.static(path.join(__dirname,'../javascript')));

app.get('/', (req, res) => {
    res.sendFile(path.join(baseDir, 'index.html'));
});

app.get('/info.html', (req, res) => {
    res.sendFile(path.join(baseDir, 'info.html'));
});

app.get('/videos.html', (req, res) => {
    res.sendFile(path.join(baseDir, 'videos.html'));
});

app.get('/imagenes.html', (req, res) => {
    res.sendFile(path.join(baseDir, 'imagenes.html'));
});

app.get('/cuestionario.html', (req, res) => {
    res.sendFile(path.join(baseDir, 'cuestionario.html'));
});


app.post('/register_score', (req, res) => {
    const usuario = req.body.usuario;
    const puntaje = req.body.puntaje;

    const query = 'INSERT INTO resultados (usuario, puntaje) VALUES (?, ?)';
    db.query(query, [usuario, puntaje], (err, result) => {
        if (err) {
            return res.status(500).send('Error al registrar la puntuación');
        }
        res.send('Puntuación registrada correctamente');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});