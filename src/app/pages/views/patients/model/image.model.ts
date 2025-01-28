import { environment } from "src/app/pages/environtment";

export class Image {
    constructor(
        private readonly filename: string | null,
        private readonly originalName: string,
        private readonly mimeType: string,
        private readonly path: string,
        private readonly size: number,
        private readonly uploadDate: Date,
    ) { }

    public static createImageUrl(image: Image): string {
        if(image.filename) {
            return `${environment.defaultUrl}/uploads/${image.filename}`;
        }

        return `${environment.defaultUrl}/uploads/default.jpg`;
    }
}