const instana = require('@instana/collector');
instana();
const express = require('express');
const { createClient } = require('@clickhouse/client');

const app = express();
const port = 3000;

app.use(express.json());

// Initialize ClickHouse client
const client = createClient({
  host: 'http://localhost:8123',
  username: 'default',
  password: '',
  database: 'default',
});

// Endpoint to create a table
app.post('/create-table', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS my_cloud_table
    (id UInt64, name String)
    ORDER BY (id)
  `;

  try {
    await client.command({
      query: createTableQuery,
      clickhouse_settings: {
        wait_end_of_query: 1,
      },
    });
    res.send('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).send('Error creating table');
  }
});

app.post('/insert', async (req, res) => {
  const { id, message } = req.body;

  try {
    await client.insert({
      table: 'my_cloud_table', // Fully qualified table name
      values: [[id, message]], // Use nested arrays for values
      clickhouse_settings: {
        wait_end_of_query: 1, // Wait for the query to finish
      },
    });
    res.send('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});

// Endpoint to select data
app.get('/select', async (req, res) => {
  try {
    const resultSet = await client.query({
      query: 'SELECT * FROM my_cloud_table',
      format: 'JSONEachRow',
    });
    const dataset = await resultSet.json();
    res.json(dataset);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
