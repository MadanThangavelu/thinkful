var http = require('http');
var url = require('url');
var items = [];



var server = http.createServer(function (req, res) {

    function objectIndex(req){
        var pathname = url.parse(req.url).pathname;
        var i = parseInt(pathname.slice(1), 10);
        return i;
    }

    function validateRequest(i, res, callback) {
        if (isNaN(i)) {
            res.statusCode = 400;
            res.end('Item id not valid');
        }
        else if (!items[i]) {
            res.statusCode = 404;
            res.end('Item not found');
        } else {
            callback(i, res);
        }
    }

    switch (req.method) {
    case 'POST':
        var item = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            item += chunk;
        });
        req.on('end', function () {
            items.push(item);
            res.end('Item added\n');
        });
        break;
    case 'GET':
        items.forEach(function (item, i) {
            res.write(i + '. ' + item + '\n');
        });
        res.end();
        break;
    case 'DELETE':
        var i = objectIndex(req);

        validateRequest(i, res, function(i, res) {
            items.splice(i, 1);
            res.end('Item deleted successfully');
        })
        break;
    case 'PUT':
        var i = objectIndex(req);
        validateRequest(i, res, function(i, res) {
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                item += chunk;
            });
            req.on('end', function () {
                items[i] = item;
                res.end('Item updated successfully');
            });
        })
        break;
    }
});

server.listen(9000, function(){
   console.log('listening on 9000');
});