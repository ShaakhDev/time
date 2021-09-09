console.log('Server_side_code_running')
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/time", { useUnifiedTopology: true },)
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
            res.status(400).send("Unable to save to db", err)
        })

})

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + 'index.html');
// })



app.delete('/clear', (req, res) => {
    User.collection.drop();
    res.sendStatus(201);
})

app.listen(8080, () => {
    console.log('server is listening on port 8080')
})