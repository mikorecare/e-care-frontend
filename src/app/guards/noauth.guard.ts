import { Injectable } from "@angular/core";
import { Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthMiddlewareApi } from "../services/auth-middleware/auth-middleware.api.service";

@Injectable({
  providedIn: "root",
})
export class NoauthGuard  {
  constructor(private api: AuthMiddlewareApi, private router: Router) {}
  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
    if (await this.api.authValidate()) {
      this.router.navigate(["/dashboard"]);
      return false;
    }
    return true;
  }
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
