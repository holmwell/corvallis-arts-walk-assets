var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Corvallis Arts Walk' });
});


router.get('/destinations', function (req, res, next) {
    fs.readFile('../destinations.json', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            return res.status(500).send(err);
        }

        var json = JSON.parse(data);
        res.send(json);
    });
});

router.put('/destinations', function (req, res, next) {
    var data = JSON.stringify(req.body, null, 4);

    // // TODO: This is unsafe to call multiple times at the same time.
    fs.writeFile('../destinations.json', data, { encoding: 'utf-8'}, function (err) {
        if (err) {
            console.log(err);
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

module.exports = router;
