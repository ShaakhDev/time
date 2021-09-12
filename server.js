///////////////////////////////////////////////////////////////////////////////
// ███████╗██╗  ██╗ █████╗  █████╗ ██╗  ██╗██╗  ██╗██████╗ ███████╗██╗   ██╗ //
// ██╔════╝██║  ██║██╔══██╗██╔══██╗██║ ██╔╝██║  ██║██╔══██╗██╔════╝██║   ██║ //
// ███████╗███████║███████║███████║█████╔╝ ███████║██║  ██║█████╗  ██║   ██║ //
// ╚════██║██╔══██║██╔══██║██╔══██║██╔═██╗ ██╔══██║██║  ██║██╔══╝  ╚██╗ ██╔╝ //
// ███████║██║  ██║██║  ██║██║  ██║██║  ██╗██║  ██║██████╔╝███████╗ ╚████╔╝  //
// ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝  ╚═══╝   //
/////////////////////////////////////////////////////////////////////////////// 

console.log('Server_side_code_running')
const express = require('express');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://ShaakhDev:palinDrom7389@newcluster.fft1o.mongodb.net/test';

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/time", { useUnifiedTopology: true },)
    .then(() => {
        console.log('Mongodb ga ulanish hosil qilindi');
    })
    .catch(err => {
        console.log("Ulanish vaqtida xatolik yuz berdi... ", err)
    })

const app = express();

//serve files from the public directory
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var userSchema = new mongoose.Schema({
    id: Number,
    name: String
}, { versionKey: false });

var User = mongoose.model("User", userSchema)

app.post('/adduser', (req, res) => {
    console.log(req.body)
    var myData = new User(req.body);
    console.log(myData)
    myData.save()
        .then(item => {
            res.send(item)
        })
        .catch(err => {
            res.status(400).send("Databazaga saqlashni iloji bo'lmadi", err)
        })
})

app.get('/all', (req, res) => {
    if (req) {
        User.db.collection('users')
            .find()
            .sort({ id: 1 })
            .toArray((err, result) => {
                if (err) return console.log(err)
                res.send(result)
            })
    }
})

app.delete('/clear', (req, res) => {
    try {
        User.db.dropCollection('users');
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
    }
});

app.listen(8080, () => {
    console.log('Server 8080 chi portni eshitishni boshladi...');
});