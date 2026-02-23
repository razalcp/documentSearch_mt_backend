export interface ProcessedFile {
    content: string;
    fileName: string;
    fileType: string;
    fileSize: number;
}
export declare const processFile: (file: Express.Multer.File) => Promise<ProcessedFile>;
export declare const validateFile: (file: Express.Multer.File) => void;
//# sourceMappingURL=fileProcessor.d.ts.map