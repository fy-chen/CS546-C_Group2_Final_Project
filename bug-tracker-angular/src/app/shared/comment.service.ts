// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders} from '@angular/common/http';
// import { Ticket } from '../components/tickets';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { FormGroup } from '@angular/forms';

// @Injectable({
//   providedIn: 'root'
// })
// export class CommentService {

//   apiUrl = environment.apiUrl;
//   headers = new HttpHeaders().set('Content-Type', 'application/json');

//   constructor(private http: HttpClient) { }

//   getComment(id: string): Observable<Ticket>{
//     return this.http.get<Ticket>(`${this.apiUrl}`);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Comment } from '../components/comment';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

@Injectable({
    providedIn: 'root'
})

export class HeroesService {
    commentUrl = environment.apiUrl;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }

    // getComment(id: string):Observable<Comment>{
    //     return this.http.get<Comment>(`${this.commentUrl}/comment` + '/' + id);
    // }

    getAllComment():Observable<Comment>{
        return this.http.get<Comment>(`${this.commentUrl}/comment/getAll`);
    }

    createComment(form: FormGroup){
        return this.http.post(`${this.commentUrl}/ticket/create`, form.value);
    }

    // deleteComment():Observable<unknown> {

    // }
}