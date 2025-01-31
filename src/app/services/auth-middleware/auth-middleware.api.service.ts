import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/app/pages/environtment";

@Injectable({
    providedIn: 'root',
})
export class AuthMiddlewareApi {
    constructor(
        private http: HttpClient,
        private router: Router
    ) {

    }

    public get(url: string, responseType: string | null = null, signal?: AbortSignal): Promise<any> {
        const headers = this.authorization();
        const options: any = { headers: headers };

        if (responseType) {
            options.responseType = responseType;
        }

        if (signal) {
            options.signal = signal;
        }

        return this.promiseResponse(this.http.get(this.setURL(url), options));
    }


    public post(url: string, body: any = {}): Promise<any> {
        return this.promiseResponse(
            this.http.post(this.setURL(url), body, { headers: this.authorization() })
        );
    }

    public patch(url: string, body: any = {}): Promise<any> {
        return this.promiseResponse(
            this.http.patch(this.setURL(url), body, { headers: this.authorization() })
        );
    }
    public delete(url: string): Promise<any> {
        return this.promiseResponse(
            this.http.delete(this.setURL(url), { headers: this.authorization() })
        );
    }

    private authorization(): HttpHeaders {
        const local = localStorage.getItem('userData');
        return new HttpHeaders({ Authorization: local ? local : '' });
    }

    private setURL(url: string): string {
        return environment.defaultUrl + url;
    }

    private promiseResponse(res: Observable<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            res.pipe(catchError(this.handleError)).subscribe({
                next: (data: any) => resolve(data),
                error: (err: any) => reject(err),
            });
        });
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => {
            return error.error ? { ...error.error, statusText: error.statusText } : error;
        });
    }


    public async authValidate(): Promise<boolean> {
        const authToken = localStorage.getItem('userData');

        console.log('Stored Token:', authToken);
        if (!authToken) {
            this.router.navigate(['authentication/login']); // Redirect to login
            return false;
        }

        try {
            const token = JSON.parse(authToken).token;
            const headers = { Authorization: `Bearer ${token}` };
            this.post('/auth', {});

            const res: any = await this.post('/auth', { token });
            console.log('Validation Response:', res);

            if (res?.data?.token) {
                localStorage.setItem('userData', JSON.stringify({ token: res.data.token }));
                return true;
            } else {
                throw new Error('Invalid response from auth server');
            }
        } catch (error) {
            console.error('Auth validation failed:', error);
            localStorage.removeItem('userData');
            this.router.navigate(['authentication/login']);
            return false;
        }
    }


    public renewToken(): Observable<any> {
        const renewToken = localStorage.getItem('userData');
        return this.http
            .post(this.setURL('/auth'), { token: renewToken }, { headers: this.authorization() })
            .pipe(catchError(this.handleError));
    }

    public logout(): string {
        localStorage.removeItem('userData');
        return '/' + localStorage.getItem('logout');
    }
}