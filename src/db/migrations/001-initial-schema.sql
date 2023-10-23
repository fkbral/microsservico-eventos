CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Tabela de Associação Evento-Convidado (Relação entre eventos e IDs de usuários/convidados)

CREATE TABLE IF NOT EXISTS events_guests (
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(event_id) REFERENCES events(id),
    PRIMARY KEY(event_id, user_id)
);