// ---- DATABASE SETUP ----
let db;

async function initDb(sqlite) {
  try {
    db = await sqlite.open("./db.sqlite");
    const jewelleryTable = `
      CREATE TABLE IF NOT EXISTS jewellery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        type VARCHAR(255),
        price REAL,
        imageName TEXT,
        description TEXT)`;
    await db.run(jewelleryTable);
    const adminTable = `
      CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        passwordHash TEXT NOT NULL)`;
    await db.run(adminTable);
    return db;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function getDb(sqlite) {
  if (!db) {
    return initDb(sqlite);
  } else {
    return db;
  }
}

module.exports = {
  initDb,
  getDb
};
