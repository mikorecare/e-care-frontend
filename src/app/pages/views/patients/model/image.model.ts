export class Image {
    constructor(
        private readonly filename: string,
        private readonly originalName: string,
        private readonly mimeType: string,
        private readonly path: string,
        private readonly size: number,
        private readonly uploadDate: Date,
    ) { }
}