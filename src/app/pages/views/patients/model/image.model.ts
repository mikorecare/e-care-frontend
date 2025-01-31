import { environment } from "src/app/pages/environtment";

export class Image {

    private static defaultImageUrl: string = "assets/default.jpg";

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

        return Image.defaultImageUrl;
    }

    public static onImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = Image.defaultImageUrl;
      }
}