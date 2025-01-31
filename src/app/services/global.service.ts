import { Injectable } from "@angular/core";
import { Admin, User } from "../pages/views/patients/model/patients.model";
import { Image } from "../pages/views/patients/model/image.model";


@Injectable({ providedIn: "root" })
export class GlobalService {

    public globalUser: User;

    public get imageUrl(): string {
        const userData = localStorage.getItem('userData');

        if (!this.globalUser && userData) {
            this.globalUser = new Admin(JSON.parse(userData).user);  
        }

        return Image.createImageUrl(this.globalUser.image);
    }

    constructor() { }
}