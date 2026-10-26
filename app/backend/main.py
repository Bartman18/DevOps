import os

import psycopg
from fastapi import FastAPI
from pydantic import BaseModel, Field

DATABASE_URL = os.environ["DATABASE_URL"]

app = FastAPI()


class NoteIn(BaseModel):
    text: str = Field(min_length=1, max_length=500)


@app.get("/api/notes")
def list_notes():
    with psycopg.connect(DATABASE_URL) as conn:
        rows = conn.execute("SELECT id, text, created_at FROM note ORDER BY id DESC").fetchall()
    return [{"id": id, "text": text, "created_at": created_at} for id, text, created_at in rows]


@app.post("/api/notes", status_code=201)
def add_note(note: NoteIn):
    with psycopg.connect(DATABASE_URL) as conn:
        id, = conn.execute("INSERT INTO note (text) VALUES (%s) RETURNING id", (note.text,)).fetchone()
    return {"id": id, "text": note.text}
