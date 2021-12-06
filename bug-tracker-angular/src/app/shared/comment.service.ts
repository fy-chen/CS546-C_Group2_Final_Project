import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Comment } from '../components/comment';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

@Injectable({
    providedIn: 'root'
})

export class CommentService {
    commentUrl = environment.apiUrl;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }

    // getComment(id: string):Observable<Comment>{
    //     return this.http.get<Comment>(`${this.commentUrl}/comment` + '/' + id);
    // }

    getAllComment(id: string):Observable<Comment>{
        return this.http.get<Comment>(`${this.commentUrl}/comment/getAll/` + id);
    }

    createComment(comment: Comment){
        return this.http.post(`${this.commentUrl}/comment/create`, comment);
    }

    deleteComment(id: string): Observable<unknown>{
        return this.http.delete(`${this.commentUrl}/comment/${id}`);
    }
}