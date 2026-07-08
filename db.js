// Banco de dados local em SQLite (arquivo único em data/site.sqlite).
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const caminhoDb = path.join(__dirname, 'data', 'site.sqlite');
const db = new DatabaseSync(caminhoDb);

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pontos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    endereco TEXT NOT NULL,
    recebe TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Na primeira vez que o site roda, cadastra alguns pontos de exemplo.
const { total } = db.prepare('SELECT COUNT(*) AS total FROM pontos').get();
if (total === 0) {
  const inserir = db.prepare(`
    INSERT INTO pontos (nome, tipo, endereco, recebe, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  inserir.run('Prefeitura Municipal de Posse', 'Órgão público', 'Praça da Matriz, Centro', 'Pilhas, celulares, pequenos eletrônicos', -14.0955, -46.3699);
  inserir.run('Praça Central de Posse', 'Ponto de coleta de pilhas', 'Praça central, Centro', 'Pilhas e baterias pequenas', -14.0940, -46.3680);
  inserir.run('Escola Municipal (exemplo)', 'Escola', 'Centro de Posse', 'Pilhas usadas', -14.0975, -46.3715);
}

module.exports = db;
