const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require("body-parser");
const port = 5000;
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Api-Server'));

app.listen(port,  () => console.log(`AlleSys: Listening on port ${port}`));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const authenticate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully');
    } catch (error) {
        console.error('Unable to connect to the DB', error);
    }
};

authenticate();

const Stream = sequelize.define(
    'streams',
    { title: Sequelize.TEXT, body: Sequelize.TEXT },
);

sequelize.sync({force: true}).then(() => {
    console.log(`Database und Tables Created!`);

    Stream.bulkCreate([
        {
            title: 'This is my First Stream',
            body: 'In this stream Ill Talk about something'
        }
    ]).then(function() {
        return Stream.findAll();
    }).then(function(streams) {
        console.log(streams);
    });
});