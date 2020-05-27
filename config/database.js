// ---- DATABASE SETUP ----
const sqlite = require("sqlite");
// declare db object
let db;
// declare variables for prepared statements
let insertAdmin;
let insertItem;
let editItem;
let deleteItem;
let selectItem;
let selectType;
let selectUser;
let deserialiseUser;

async function initDb() {
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
    initPreparedStatements();
    return db;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function initPreparedStatements() {
  try {
    // Set the id to null so that it will auto-increment
    insertAdmin = await db.prepare("insert into admin values (NULL, ?, ?)");
    insertItem = await db.prepare(
      "insert into jewellery values (NULL, ?, ?, ?, ?, ?)"
    );
    editItem = await db.prepare(
      "UPDATE jewellery SET name=?, type=?, price=?, imageName=?, description=? WHERE id=?"
    );
    deleteItem = await db.prepare("DELETE FROM jewellery WHERE id=?");
    selectItem = await db.prepare("select * from jewellery WHERE id=?");
    selectType = await db.prepare("select * from jewellery WHERE type=?");
    selectUser = await db.prepare("select * from admin where username=?");
    deserialiseUser = await db.prepare(
      "SELECT id, username FROM admin WHERE id=?"
    );
  } catch (e) {
    console.log(e);
  }
}

// Getters for the DB and different prepared statements

function getDb() {
  if (!db) {
    return initDb();
  } else {
    return db;
  }
}

function getInsertAdmin() {
  if (!db) {
    initDb();
  }
  return insertAdmin;
}

function getInsertItem() {
  if (!db) {
    initDb();
  }
  return insertItem;
}

function getEditItem() {
  if (!db) {
    initDb();
  }
  return editItem;
}

function getDeleteItem() {
  if (!db) {
    initDb();
  }
  return deleteItem;
}

function getSelectItem() {
  if (!db) {
    initDb();
  }
  return selectItem;
}

function getSelectType() {
  if (!db) {
    initDb();
  }
  return selectType;
}

function getSelectUser() {
  if (!db) {
    initDb();
  }
  return selectUser;
}

function getDeserialiseUser() {
  if (!db) {
    initDb();
  }
  return deserialiseUser;
}

// Closing function that is called when program terminates with ctrl-c
async function close() {
  try {
    await insertAdmin.finalize();
    await insertItem.finalize();
    await editItem.finalize();
    await deleteItem.finalize();
    await selectItem.finalize();
    await selectType.finalize();
    await selectUser.finalize();
    await deserialiseUser.finalize();
    await db.close();
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  initDb,
  getDb,
  getInsertAdmin,
  getInsertItem,
  getEditItem,
  getDeleteItem,
  getSelectItem,
  getSelectType,
  getSelectUser,
  getDeserialiseUser,
  close
};
