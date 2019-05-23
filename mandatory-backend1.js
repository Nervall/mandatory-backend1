const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;

app.use(express.json());



app.listen(port, () => console.log(`Example app listening on port ${port}!`));