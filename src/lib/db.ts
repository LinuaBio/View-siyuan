const sqlite3 = require("sqlite3").verbose();

interface FileInfo {
  name: string;
  dir: string;
  ext: string;
  size: number;
}

interface FileGroups {
  [key: string]: string[];
}

function createTables(db: any, fileGroups: FileGroups) {
  for (const key in fileGroups) {
    if (Object.prototype.hasOwnProperty.call(fileGroups, key)) {
      const fileExtensions = fileGroups[key];
      let sql = `CREATE TABLE IF NOT EXISTS ${key} (id INTEGER PRIMARY KEY, name TEXT, size INTEGER, path TEXT`;
      for (const extension of fileExtensions) {
        // Add column with default value for each file extension
        sql += `, ${extension} TEXT DEFAULT 'unknown'`;
      }
      sql += ")";
      db.run(sql);
    }
  }
}

function openDatabase(dbPath: string) {
  return new Promise((resolve) => {
    const db = new sqlite3.Database(dbPath, (err: any) => {
      if (err) {
        console.error(err);
        throw err;
      }
      console.log(`Connected to the database: ${dbPath}`);
      resolve(db);
    });
  });
}

async function closeDatabase(db: any) {
  return new Promise<void>((resolve, reject) => {
    db.close((err: any) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log("Closed the database connection.");
      resolve();
    });
  });
}

function writeToDatabase(db:  any, fileType: string, fileInfo: FileInfo, numberedFilePath: string) {
  // Insert file information into respective table
  db.run(
    // `INSERT INTO ${fileType} (name, size, path)`,
    `INSERT INTO ${fileType} (name, size, path) VALUES (?, ?, ?)`,
    [fileInfo.name, fileInfo.size, numberedFilePath],
    (err: any) => {
      if (err) {
        console.error(err);
        throw err;
      }
    }
  );
}

module.exports = {
  createTables,
  openDatabase,
  closeDatabase,
  writeToDatabase,
};