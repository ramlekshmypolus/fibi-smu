import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    constructor(private _router: Router) { }
    Authtoken: string;
    unauthorized: any;
/**catches every request and adds the authentication token from local storage
 * creates new header with auth-key
*/
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.Authtoken = localStorage.getItem('authToken');
    if (this.Authtoken == null) {
        this.Authtoken = '';
    }
    const authReq = req.clone({ headers: req.headers.set('Authorization', this.Authtoken)});

/**send the newly created request*/
    return next.handle(authReq).catch(
        ( error ) => {
        console.log('"Error Occurred"');
        this.unauthorized = error;
        if (this.unauthorized.status === 401) {
                this._router.navigate(['/login']);
        }
        return Observable.throw(error);
    }) as any;
    }
}
