import { Image } from "./image.model";

export abstract class User {
    public firstname: string;
    public lastname: string;
    public email: string;
    public contactNumber: string;
    public image: Image | null;

    public abstract role: string;

    constructor(data?: User) {
        if (data) {
            this.firstname = data.firstname;
            this.lastname = data.lastname;
            this.email = data.email;
            this.contactNumber = data.contactNumber;
            this.image = data.image;
        }
    }

    public static create(user: User): User {
        if (user.role === "patient") {
            return new Patient();
        }

        if (user.role === "admin") {
            return new Admin();
        }

        if (user.role === "staff") {
            return new Staff();
        }

        throw new Error("Class not implemented");
    }
}

export class Patient extends User {
    public override get role(): string {
        return "patient";
    }

    constructor() {
        super();
    }
}

export class Staff extends User {
    public override get role(): string {
        return "staff";
    }

    constructor() {
        super();
    }
}

export class Admin extends User {
    public override get role(): string {
        return "admin";
    }

    constructor() {
        super();
    }
}


