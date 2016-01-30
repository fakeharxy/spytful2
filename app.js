var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3080, function () {
  console.log('Spytful is running on port 3080!');
});

