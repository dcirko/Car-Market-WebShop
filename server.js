const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

app.get('/api/automobili', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    let query = `
        SELECT a.*, s.snaga, s.motor, s.boja, s.gorivo, s.mjenjac, s.pogon 
        FROM automobili a
        JOIN specifikacije s ON a.id = s.automobil_id
        ORDER BY a.cijena DESC
    `;

    if (limit) {
        query += ' LIMIT ?';
    }

    db.query(query, limit ? [limit] : [], (err, result) => {
        if (err) {
            console.error('❌ Greška pri dohvaćanju podataka:', err);
            res.status(500).send('Greška pri dohvaćanju podataka');
        } else {
            res.json(result);
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
    const automobilId = req.params.id;
    const { marka, model, godina, kilometraza, cijena, motor, snaga, boja, gorivo, mjenjac, pogon } = req.body;
    
    let sqlAutomobil, paramsAutomobil;

    if (req.file) {
        const slika = `images/${req.file.filename}`;
        sqlAutomobil = `UPDATE automobili 
                        SET marka = ?, model = ?, godina = ?, cijena = ?, slika = ?, kilometri = ? 
                        WHERE id = ?`;
        paramsAutomobil = [marka, model, godina, cijena, slika, kilometraza, automobilId];
    } else {
        sqlAutomobil = `UPDATE automobili 
                        SET marka = ?, model = ?, godina = ?, cijena = ?, kilometri = ? 
                        WHERE id = ?`;
        paramsAutomobil = [marka, model, godina, cijena, kilometraza, automobilId];
    }

    db.query(sqlAutomobil, paramsAutomobil, (err, result) => {
        if (err) {
            console.error('❌ Greška pri ažuriranju automobila:', err);
            return res.status(500).send('Greška pri ažuriranju automobila');
        }

        const sqlSpecifikacije = `UPDATE specifikacije 
                                  SET motor = ?, snaga = ?, boja = ?, gorivo = ?, mjenjac = ?, pogon = ? 
                                  WHERE automobil_id = ?`;
        const paramsSpecifikacije = [motor, snaga, boja, gorivo, mjenjac, pogon, automobilId];

        db.query(sqlSpecifikacije, paramsSpecifikacije, (err, result) => {
            if (err) {
                console.error('❌ Greška pri ažuriranju specifikacija:', err);
                return res.status(500).send('Greška pri ažuriranju specifikacija');
            }
            res.json({ message: '✅ Automobil i specifikacije ažurirani!' });
        });
    });
});


/*deleteCar*/
app.delete('/api/automobili/:id', (req, res) => {
    const automobilId = req.params.id;

    const sqlDeleteKupnje = 'DELETE FROM kupnje WHERE automobil_id = ?';
    db.query(sqlDeleteKupnje, [automobilId], (err, result) => {
        if (err) {
            console.error('❌ Greška pri brisanju kupnji:', err);
            return res.status(500).send('Greška pri brisanju kupnji');
        }

        const sqlDeleteSpecifikacije = 'DELETE FROM specifikacije WHERE automobil_id = ?';
        db.query(sqlDeleteSpecifikacije, [automobilId], (err, result) => {
            if (err) {
                console.error('❌ Greška pri brisanju specifikacija:', err);
                return res.status(500).send('Greška pri brisanju specifikacija');
            }

            const sqlDeleteAutomobil = 'DELETE FROM automobili WHERE id = ?';
            db.query(sqlDeleteAutomobil, [automobilId], (err, result) => {
                if (err) {
                    console.error('❌ Greška pri brisanju automobila:', err);
                    return res.status(500).send('Greška pri brisanju automobila');
                }
                
                res.json({ message: '✅ Automobil i svi povezani podaci obrisani!' });
            });
        });
    });
});






/*buyCar*/
app.post('/api/kupi', (req, res) => {
    const {korisnik_id, automobil_id, cijena, nacinPlacanja} = req.body;
    const sql = `INSERT INTO kupnje (korisnik_id, automobil_id, cijena, nacin_placanja) VALUES (?, ?, ?, ?)`;

    db.query(sql, [korisnik_id, automobil_id, cijena, nacinPlacanja], (err, result) => {
        if (err) {
            console.error('❌ Greška pri kupnji:', err);
            res.status(500).send('Greška pri kupnji');
        } else {
            res.json({ message: '✅ Kupnja uspješna!' });
        }
    });


});


app.get('/api/automobili/:carId/status-kupnje/:userId', (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM kupnje WHERE automobil_id = ? AND korisnik_id = ?';

    db.query(sql, [req.params.carId, req.params.userId], (err, result) => {
        if (err) {
            console.error('❌ Greška pri provjeri kupnje auta:', err);
            return res.status(500).json({ error: 'Greška pri provjeri kupnje auta' });
        }

        const isBought = result[0].count > 0;
        res.json({ kupljen: isBought });
    });
});




/*getKupnje*/
app.get('/api/kupnje/:korisnik_id', (req, res) => {
    const korisnik_id = req.params.korisnik_id;

    //const sql = `SELECT * FROM kupnje WHERE korisnik_id = ?`;
    const sql = `SELECT k.*, a.marka, a.model, a.godina, a.cijena, a.slika, a. kilometri 
                FROM kupnje k JOIN automobili a ON k.automobil_id = a.id WHERE k.korisnik_id = ?`;


    db.query(sql, [korisnik_id], (err, result) => {
        if (err) {
            console.error('❌ Greška pri dohvaćanju kupnji:', err);
            res.status(500).send('Greška pri dohvaćanju kupnji');
        } else {
            res.json(result);
        }
    });
});


/*getUsers*/
app.get('/api/korisnici/:korisnik_id', (req, res) => {
    const korisnik_id = req.params.korisnik_id;

    const sql = `SELECT * FROM users where id = ?`;

    db.query(sql, [korisnik_id], (err, result) => {
        if (err) {
            console.error('❌ Greška pri dohvaćanju korisnika:', err);
            res.status(500).send('Greška pri dohvaćanju korisnika');
        } else {
            res.json(result);
        }
    });
});


/*prijava*/
app.post('/api/login', (req, res) => {
    console.log("📩 Podaci primljeni na backend:", req.body);
    const {user} = req.body;

    
    
    const sql = `SELECT * FROM users where username = ?`;	

    db.query(sql, [user.username ], async (err, result) => {
        if (err) {
            console.error('❌ Greška pri dohvaćanju korisnika:', err);
            return res.status(500).send('Greška pri dohvaćanju korisnika');
        }

        if(result.length === 0){
            return res.status(401).send('❌ Pogrešno korisničko ime ili lozinka');
        }

        const user2 = result[0];
        console.log('user2:', user2);
        if(user2.role === 'admin'){
            console.error('❌ Greška pri dohvaćanju korisnika:', err);
            return res.status(500).send('Greška pri dohvaćanju korisnika');
        }



        const isMatch = await bcrypt.compare(user.password, user2.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Neispravni login podaci' });
        }

        const token = jwt.sign({ id: user2.id, username: user2.username }
            , 'tajna'
            , { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Prijava uspješna!', token });
        });
});


/*adminPrijava*/
app.post('/api/adminLogin', (req, res) => {
    console.log("📩 Podaci primljeni na backend:", req.body);
    const {user} = req.body;

    const sql = `SELECT * FROM users where username = ?`;	

    db.query(sql, [user.username ], async (err, result) => {
        if (err) {
            console.error('❌ Greška pri dohvaćanju korisnika:', err);
            res.status(500).send('Greška pri dohvaćanju korisnika');
        }

        if(result.length === 0){
            res.status(401).send('❌ Pogrešno korisničko ime ili lozinka');
        }

        const user2 = result[0];
        console.log('user2:', user2);

        const isMatch = await bcrypt.compare(user.password, user2.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Neispravni login podaci' });
        }

        const token = jwt.sign({ id: user2.id, username: user2.username }
            , 'tajna'
            , { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Prijava uspješna!', token });
        });
});




app.post('/api/register', async (req, res) => {
    console.log("📩 Podaci primljeni na backend:", req.body);
    const { user } = req.body;
    

    const sqlCheckUsername = 'SELECT * FROM users WHERE username = ?';
    db.query(sqlCheckUsername, [user.username], async (err, result) => {
        if (err) {
            console.error('❌ Greška pri provjeri korisničkog imena:', err);
            return res.status(500).json({ error: 'Greška pri provjeri korisničkog imena' });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: 'Korisničko ime već postoji!' });
        }

        const sqlCheckEmail = 'SELECT * FROM users WHERE email = ?';
        db.query(sqlCheckEmail, [user.email], async (err, result) => {
            if (err) {
                console.error('❌ Greška pri provjeri emaila:', err);
                return res.status(500).json({ error: 'Greška pri provjeri emaila' });
            }

            if (result.length > 0) {
                return res.status(400).json({ error: 'Email već postoji!' });
            }

            const hashedPassword = await bcrypt.hash(user.password, 12); 

            const sqlInsert = 'INSERT INTO users (username, password, name, email, role) VALUES(?, ?, ?, ?, ?)';
            db.query(sqlInsert, [user.username, hashedPassword, user.name, user.email, user.role], (err, result) => {
                if (err) {
                    console.error('❌ Greška pri registraciji:', err);
                    return res.status(500).json({ error: 'Greška pri registraciji' });
                }

                const token = jwt.sign({ id: user.id, username: user.username, role: user.role }
                    , 'tajna'
                    , { expiresIn: '1h' }
                );

                res.status(201).json({
                    message: '✅ Registracija uspješna!',
                    token
                });
            });
        });
    });
});




app.listen(3000, () => {
    console.log('🚀 Server pokrenut na portu 3000');
});
