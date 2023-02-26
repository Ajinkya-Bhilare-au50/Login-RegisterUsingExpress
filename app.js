//Login page

const express = require('express');
const mongodb = require('mongodb');
const app = express();

//Connect to mongo
const db = mongodb.connect('mongodb://localhost:27017/mydb', { useUnifiedTopology: true }, (err, client) => {
	if (err) {
		console.log('Error in MongoDB Connection!', err);
	} else {
		console.log('MongoDB connected!');
		const db = client.db('mydb');
		
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/login.html');
		});

		app.post('/login', (req, res) => {
			const username = req.body.username;
			const password = req.body.password;

			db.collection('users').findOne({ username: username, password: password }, (err, user) => {
				if (err) {
					res.send('Error in finding user!');
				} else {
					if (user) {
						res.redirect('/home');
					} else {
						res.send('Username or password is incorrect!');
					}
				}
			});
		});
	}
});

// Homepage

app.get('/home', (req, res) => {
	res.sendFile(__dirname + '/home.html');
});

// Register Page

app.get('/register', (req, res) => {
	res.sendFile(__dirname + '/register.html');
});

app.post('/register', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	db.collection('users').insertOne({ username: username, password: password }, (err, user) => {
		if (err) {
			res.send('Error in registering user!');
		} else {
			res.redirect('/login');
		}
	});
});

app.listen(3000, () => {
	console.log('Server started on port 3000');
});
