const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

app.get('/api', (req, res) => {
  res.sendFile(__dirname + '/stuff.json');
});

app.post('/api', (req, res) => {
  fs.writeFileSync(__dirname + '/stuff.json', JSON.stringify(req.body, null, 2));
  res.send('things have been updated');
});

app.listen(4000, () => console.log('Example app listening on port 4000!'));
