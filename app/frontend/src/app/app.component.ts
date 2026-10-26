import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Note {
  id: number;
  text: string;
  created_at: string;
}

@Component({
  selector: 'app-root',
  template: `
    <h1>Notatki</h1>
    <input #text maxlength="500" placeholder="Nowa notatka">
    <button (click)="add(text.value); text.value = ''">Dodaj</button>
    <ul>
      @for (note of notes(); track note.id) {
        <li>{{ note.text }} <small>{{ note.created_at }}</small></li>
      }
    </ul>
  `,
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  notes = signal<Note[]>([]);

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<Note[]>('/api/notes').subscribe(notes => this.notes.set(notes));
  }

  add(text: string) {
    if (!text.trim()) return;
    this.http.post('/api/notes', { text }).subscribe(() => this.load());
  }
}
