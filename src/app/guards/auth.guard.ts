import { Injectable } from "@angular/core";
import { Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthMiddlewareApi } from "../services/auth-middleware/auth-middleware.api.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard  {

  constructor(
    private api: AuthMiddlewareApi, 
    private router: Router
    ) { }

  public async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
    if (await this.api.authValidate()) {
      return true;
    }
    
    this.router.navigate(['/authentication/login']);
    return false;
  }

  public async canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
    if (await this.api.authValidate()) {
      return true;
    }
    return false;
  }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
