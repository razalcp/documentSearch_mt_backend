import { IDocument } from '../types';
export interface TFIDFResult {
    document: IDocument;
    score: number;
    highlights: string[];
}
export declare class TFIDFSearchEngine {
    private documents;
    constructor();
    addDocuments(documents: IDocument[]): void;
    search(query: string, limit?: number): TFIDFResult[];
    private tokenize;
    private generateHighlight;
    getSuggestions(query: string, limit?: number): string[];
    private isSimilar;
    private levenshteinDistance;
}
//# sourceMappingURL=searchService.d.ts.map