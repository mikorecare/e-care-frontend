import { Department } from "../../departments/model/department";

export class Doctor {
    public name: string;
    public specialization: string;
    public departments: any[];
    public image: string | null;
    
    constructor() { 
        this.name = '',
        this.specialization = '',
        this.departments = [],
        this.image = null
    }
}