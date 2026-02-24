export interface TFIDFResult {
    document: any;
    score: number;
    highlights: string[];
}
export declare class TFIDFSearchEngine {
    private documents;
    constructor();
    addDocuments(documents: any[]): void;
    search(query: string, limit?: number): TFIDFResult[];
    private tokenize;
    private generateHighlight;
    getSuggestions(query: string, limit?: number): string[];
    private isSimilar;
    private levenshteinDistance;
}
//# sourceMappingURL=searchService.d.ts.map