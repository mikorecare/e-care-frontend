import { MiniResource } from "../../general-model/mini-resource.model";

export class Feedback {
    constructor(
        public _id: string,
        public userId: string,
        public userName: string,
        public department: MiniResource,
        public rate: number,
        public comments: string,
        public appointmentId: string,
        public createdAt: Date
    ) { }
}