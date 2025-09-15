const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

// 👇 Replace with your Azure SQL details
const config = {
  user: "aakashadmin",        // e.g. "myadmin@your-sql-server"
  password: "Aakashaakash@123",
  server: "aakash-server.database.windows.net",
  database: "aakashdb",
  options: {
    encrypt: true,                 // required for Azure
    trustServerCertificate: false
  }
};

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve a simple form
app.get("/", (req, res) => {
  res.send(`
    <h2>Enter Data</h2>
    <form method="post" action="/add">
      <input type="text" name="name" placeholder="Enter name" required />
      <input type="number" name="age" placeholder="Enter age" required />
      <button type="submit">Submit</button>
    </form>
  `);
});

// Handle form submission
app.post("/add", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input("name", sql.VarChar, req.body.name)
      .input("age", sql.Int, req.body.age)
      .query("INSERT INTO Users (Name, Age) VALUES (@name, @age)");

    res.send("✅ Data inserted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));