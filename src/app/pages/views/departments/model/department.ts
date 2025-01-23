export class Department {

    _id: string;
    name: string
    description: string
    image: any
    dailyQuota : number

    constructor() {
        this._id = "",
        this.name = '',
        this.description = '',
        this.image = null,
        this.dailyQuota = 0;
    }
}