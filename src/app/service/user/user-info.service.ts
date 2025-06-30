import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  photoUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  constructor(private http: HttpClient) {}

  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${environment.apiUrl}/usuarios/me`, { withCredentials: true });
  }

  // DEBUG extra para ver la respuesta cruda
  getUserInfoRaw(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/usuarios/me`, { withCredentials: true });
  }
}
