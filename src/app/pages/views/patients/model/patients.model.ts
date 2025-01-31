import { Image } from "./image.model";

export abstract class User {
    public _id: string;
    public password: string = ""; //Keep blank, just for ngModel purposes
    public newPassword: string = ""; //Keep blank, just for ngModel purposes
    public confirmPassword: string = ""; //Keep blank, just for ngModel purposes
    public firstname: string;
    public lastname: string;
    public email: string;
    public contactNumber: string;
    public image: any;
    public createdAt: Date
    public patientsList: any[];

    public abstract role: string;

    constructor(data?: User) {
        if (data) {
            this._id = data._id;
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.email = data.email;
            this.contactNumber = data.contactNumber;
            this.image = data.image;
            this.createdAt  = data.createdAt;
        }
    }

    public static create(user: User): User {
        if (user.role === "patient") {
            return new Patient(user);
        }

        if (user.role === "admin") {
            return new Admin(user);
        }

        if (user.role === "staff") {
            return new Staff(user);
        }

        throw new Error("Class not implemented");
    }
}

export class Patient extends User {
    public override get role(): string {
        return "patient";
    }

    constructor(data?: Patient) {
        super();

        if (data) {
            this._id = data._id;
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.email = data.email;
            this.contactNumber = data.contactNumber;
            this.image = data.image;
            this.createdAt  = data.createdAt;
        }
    }
}

export class Staff extends User {
    public override get role(): string {
        return "staff";
    }

    constructor(data?: Staff) {
        super();

        if (data) {
            this._id = data._id;
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.email = data.email;
            this.contactNumber = data.contactNumber;
            this.image = data.image;
            this.createdAt  = data.createdAt;
        }
    }
}

export class Admin extends User {
    public override get role(): string {
        return "admin";
    }

    constructor(data?: Admin) {
        super();

        if (data) {
            this._id = data._id;
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.email = data.email;
            this.contactNumber = data.contactNumber;
            this.image = data.image;
            this.createdAt  = data.createdAt;
        }
    }
}


