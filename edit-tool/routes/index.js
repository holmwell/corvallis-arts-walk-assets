var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Corvallis Arts Walk' });
});

router.get('/new', function (req, res, next) {
    res.render('new');
});

router.get('/dest/:destId', function (req, res, next) {
    res.render('dest', { destId: req.params.destId });
});

var readDestinations = function (callback) {
    fs.readFile('../destinations.json', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            callback(err);
            return;
        }

        var json = JSON.parse(data);
        callback(null, json);
    });
};

var writeDestinations = function (json, callback) {
    var data = JSON.stringify(json, null, 4);

    // // TODO: This is unsafe to call multiple times at the same time.
    fs.writeFile('../destinations.json', data, { encoding: 'utf-8'}, function (err) {
        if (err) {
            console.log(err);
            return callback(err);
        }

        return callback();
    });
};


router.get('/destinations', function (req, res, next) {
    readDestinations(function (err, json) {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(json);
    });
});

router.put('/destinations', function (req, res, next) {
    writeDestinations(req.body, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send();
    });
});

router.put('/config', function (req, res, next) {
    var json = req.body;
    var activeDestinations = [];
    for (var index in json.destinations) {
        if (json.destinations[index].isActive) {
            activeDestinations.push(json.destinations[index]);
        }
    }
    json.destinations = activeDestinations;

    var data = JSON.stringify(json, null, 4);

    // // TODO: This is unsafe to call multiple times at the same time.
    fs.writeFile('../config.json', data, { encoding: 'utf-8'}, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        res.status(200).send();
    });
});

router.post('/dest', function (req, res, next) {
    var dest = req.body;

    readDestinations(function (err, json) {
        if (err) {
            return res.status(500).send(err);
        }

        for (var i=0; i < destinations.length; i++) {
            if (destinations[i].id.toString() === dest.id.toString()) {
                return res.status(401).send("Destination ID already exists.")
            }
        }

        json.destinations.push(dest);

        writeDestinations(json, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send();
        });

        res.send(json);
    });
});

router.put('/dest', function (req, res, next) {
    var dest = req.body;

    readDestinations(function (err, json) {
        if (err) {
            return res.status(500).send(err);
        }

        var destinations = json.destinations;

        for (var i=0; i < destinations.length; i++) {
            if (destinations[i].id.toString() === dest.id.toString()) {
                destinations[i] = dest;
            }
        }

        json.destinations = destinations;

        writeDestinations(json, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send();
        });

        res.send(json);
    });
});

module.exports = router;
