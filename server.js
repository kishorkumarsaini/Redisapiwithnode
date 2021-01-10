const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const vehicle = require('./models/vehicle');
const clearCache = require('./services/cache');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/redisdemo', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Database Connected Successfully');
    })
    .catch(err => {
        console.log('some error accurred');
    })





app.post('/vehicle', (req, res) => {

    new vehicle(req.body)
        .save()
        .then((data) => {
            console.log(data);
            res.status(200).json({
                save: true,
            });
            clearCache(data.vehicleType);

        })
        .catch((err) => {
            console.log(err);
            res.json({ save: false })
        })
});

app.get('/', (req, res) => {
    vehicle.find({})
        .then((data) => {
            res.json({
                found: true,
                data: data
            })

        })
        .catch((err) => {
            console.log(err);
            res.json({
                found: false,
                data: null
            })
        });
});

app.get('/:vehicleType/', (req, res) => {

    vehicle.find({ vehicleType: req.params.vehicleType })
        .cache(req.params.vehicleType)
        .then((data) => {
            if (data) {
                res.json({ found: true, data: data })
            } else {
                res.json({ found: false, data: null })
            }
        })
        .catch((err) => {
            console.log(err)
            res.json({
                found: false,
                data: null
            })
        })


});

app.get('/:vehicleType/:sno', (req, res) => {

    vehicle.findOne({
            serialno: req.params.sno,
            vehicleType: req.params.vehicleType
        })
        .catch(req.params.vehicleType)
        .then((data) => {
            if (data) {
                res.json({
                    found: true,
                    data: data
                })
            } else {
                res.json({
                    found: false,
                    data: null
                })
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({
                found: false,
                data: null
            })
        })

});

const port = 9000;
app.listen(port, () => {
    console.log(`Server started on port:${port}`);
});