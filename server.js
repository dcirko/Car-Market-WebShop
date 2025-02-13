const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/images', express.static(path.join(__dirname, 'public/images')));

const multer = require('multer');   

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '47LFKBAp',
    database: 'carzone'
});

db.connect(err => {
    if (err) {
        console.error('❌ Greška pri spajanju na bazu:', err);
    } else {
        console.log('✅ Uspješno spojen na MySQL bazu');
    }
});


/*getCars*/
app.get('/api/automobili', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    
    let query = 'SELECT * FROM automobili';
    if (limit) {
        query += ' ORDER BY cijena DESC LIMIT ?';
    }

    db.query(query, limit ? [limit] : [], (err, result) => {
        if (err) {
            console.error('❌ Greška pri dohvaćanju podataka:', err);
            res.status(500).send('Greška pri dohvaćanju podataka');
        } else {
            const automobili = result.map(car => ({
                ...car,
                slika: `${car.slika}`
            }));
            res.json(automobili);
        }
    });
});


/*carPage*/
app.get('/api/automobili/:id', (req, res) => {
    db.query('SELECT * FROM automobili WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error('❌ Greška pri dohvaćanju podataka:', err);
            res.status(500).send('Greška pri dohvaćanju podataka');
        } else if (result.length === 0) {
            res.status(404).send('Automobil nije pronađen');
        } else {
            const car = result[0];
            res.json({
                ...car,
                slika: `${car.slika}`
            });
        }
    });
});


/*getSpecs*/
app.get('/api/automobili/:id/specifikacije', (req, res) => {
    const automobilId = req.params.id;

    const query = `
        SELECT a.*, s.snaga, s.motor, s.boja, s.gorivo, s.mjenjac, s.pogon 
        FROM automobili a
        JOIN specifikacije s ON a.id = s.automobil_id
        WHERE a.id = ?;
    `;

    db.query(query, [automobilId], (err, result) => {
        if (err) {
            console.error('❌ Greška pri dohvaćanju podataka:', err);
            res.status(500).send('Greška pri dohvaćanju podataka');
        } else if (result.length === 0) {
            res.status(404).send('Podaci nisu pronađeni');
        } else {
            res.json(result[0]);  // Pošalji samo prvi rezultat (ako postoji)
        }
    });
});



/*addCar*/
app.post('/api/automobili', upload.single('slika'), (req, res) => {
    const { marka, model, godina, kilometraza, cijena, motor, snaga, boja, gorivo, mjenjac, pogon } = req.body;
    const slika = req.file ? `images/${req.file.filename}` : null;

    const sql = 'INSERT INTO automobili (marka, model, godina, cijena, slika, kilometri) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [marka, model, godina, cijena, slika, kilometraza], (err, result) => {
        if (err) {
            console.error('❌ Greška pri dodavanju automobila:', err);
            res.status(500).send('Greška pri spremanju automobila');
        } 

        const sqlSpecs = 'INSERT INTO specifikacije (automobil_id, motor, snaga, boja, gorivo, mjenjac, pogon) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sqlSpecs, [result.insertId, motor, snaga, boja, gorivo, mjenjac, pogon], (err, result) => {
            if (err) {
                console.error('❌ Greška pri dodavanju specifikacija:', err);
                res.status(500).send('Greška pri spremanju specifikacija');
            } else {
                res.json({ message: '✅ Automobil dodan!' });
            }
        });
    });
});


/*editCar*/
app.put('/api/automobili/:id', upload.single('slika'), (req, res) => {
    const { marka, model, godina, kilometraza, cijena } = req.body;
    let sql, params;

    if (req.file) {
        const slika = `images/${req.file.filename}`;
        sql = 'UPDATE automobili SET marka = ?, model = ?, godina = ?, cijena = ?, slika = ?, kilometri = ? WHERE id = ?';
        params = [marka, model, godina, cijena, slika, kilometraza, req.params.id];
    } else {
        sql = 'UPDATE automobili SET marka = ?, model = ?, godina = ?, cijena = ?, kilometri = ? WHERE id = ?';
        params = [marka, model, godina, cijena, kilometraza, req.params.id];
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('❌ Greška pri ažuriranju automobila:', err);
            res.status(500).send('Greška pri ažuriranju automobila');
        } else {
            res.json({ message: '✅ Automobil ažuriran!' });
        }
    });
});


app.listen(3000, () => {
    console.log('🚀 Server pokrenut na portu 3000');
});
