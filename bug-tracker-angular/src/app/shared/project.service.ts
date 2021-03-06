import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  search(phrase: string) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http
        .post(`${this.apiUrl}/projects/search`, { phrase: phrase })
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  getAllProjects() {
    return this.http.get(`${this.apiUrl}/projects/`);
  }

  getProject(id: string) {
    return this.http.get(`${this.apiUrl}/projects/` + id);
  }

  getProjectByUser() {
    return this.http.get(`${this.apiUrl}/projects/users`);
  }

  createProject(form: FormGroup) {
    return this.http.post(`${this.apiUrl}/projects/create`, form.value);
  }

  searchProject(form: FormGroup) {
    return this.http.post(`${this.apiUrl}/projects/search/`, form.value);
  }

  deleteProject(id: string) {
    return this.http.delete(`${this.apiUrl}/projects/` + id);
  }

  updateProject(id: string, form: FormGroup) {
    return this.http.put(`${this.apiUrl}/projects/update/` + id, form.value);
  }
}
