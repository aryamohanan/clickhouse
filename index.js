const instana = require('@instana/collector');
instana();
const express = require('express');
const bodyParser = require('body-parser');
const { ClickHouse } = require('clickhouse');

const app = express();
const port = 3000;
app.use(bodyParser.json());

const clickhouse = new ClickHouse({
  url: 'http://localhost',
  port: 8123,
  debug: false,
  basicAuth: {
    username: 'default',
    password: '',
  },
  isUseGzip: false,
  format: 'json',
});

app.post('/create-table', async (req, res) => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id UInt32,
      name String,
      age UInt8
    ) ENGINE = MergeTree()
    ORDER BY id
  `;

  try {
    await clickhouse.query(query).toPromise();
    res.status(200).send('Table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
    res.status(500).send('Error creating table');
  }
});

app.post('/insert', async (req, res) => {
  const { id, name, age } = req.body;

  if (!id || !name || !age) {
    return res.status(400).send('Missing data');
  }

  const query = `INSERT INTO users (id, name, age) VALUES (${id}, '${name}', ${age})`;

  try {
    await clickhouse.query(query).toPromise();
    res.status(200).send('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error inserting data');
  }
});

app.get('/select', async (req, res) => {
  const query = 'SELECT * FROM users';

  try {
    const rows = await clickhouse.query(query).toPromise();
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
