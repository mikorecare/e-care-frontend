export class Department {
    name: string
    description: string
    image: any
    dailyQuota : number

    constructor() {
        this.name = '',
        this.description = '',
        this.image = null,
        this.dailyQuota = 0;
    }
}