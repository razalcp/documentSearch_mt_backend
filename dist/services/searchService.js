"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TFIDFSearchEngine = void 0;
class TFIDFSearchEngine {
    constructor() {
        this.documents = [];
    }
    addDocuments(documents) {
        this.documents = documents;
    }
    search(query, limit = 10) {
        const queryTerms = this.tokenize(query.toLowerCase());
        const results = [];
        this.documents.forEach((doc) => {
            let score = 0;
            const highlights = [];
            const docText = `${doc.title} ${doc.content}`.toLowerCase();
            queryTerms.forEach(term => {
                const titleMatches = (doc.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
                const contentMatches = (doc.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
                const termScore = (titleMatches * 3) + contentMatches;
                score += termScore;
                const highlight = this.generateHighlight(docText, term);
                if (highlight) {
                    highlights.push(highlight);
                }
            });
            if (score > 0) {
                results.push({
                    document: doc,
                    score,
                    highlights: [...new Set(highlights)]
                });
            }
        });
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(term => term.length > 2);
    }
    generateHighlight(text, term, contextLength = 50) {
        const index = text.toLowerCase().indexOf(term.toLowerCase());
        if (index === -1)
            return null;
        const start = Math.max(0, index - contextLength);
        const end = Math.min(text.length, index + term.length + contextLength);
        let highlight = text.substring(start, end);
        if (start > 0)
            highlight = '...' + highlight;
        if (end < text.length)
            highlight = highlight + '...';
        return highlight;
    }
    getSuggestions(query, limit = 5) {
        const queryTerms = this.tokenize(query.toLowerCase());
        const suggestions = new Set();
        this.documents.forEach(doc => {
            const docText = `${doc.title} ${doc.content}`.toLowerCase();
            const docTerms = this.tokenize(docText);
            docTerms.forEach(term => {
                queryTerms.forEach(queryTerm => {
                    if (this.isSimilar(term, queryTerm) && term !== queryTerm) {
                        suggestions.add(term);
                    }
                });
            });
        });
        return Array.from(suggestions).slice(0, limit);
    }
    isSimilar(term1, term2) {
        const distance = this.levenshteinDistance(term1, term2);
        const maxLength = Math.max(term1.length, term2.length);
        const similarity = 1 - (distance / maxLength);
        return similarity >= 0.6;
    }
    levenshteinDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i++) {
            matrix[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j++) {
            matrix[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator);
            }
        }
        return matrix[str2.length][str1.length];
    }
}
exports.TFIDFSearchEngine = TFIDFSearchEngine;
//# sourceMappingURL=searchService.js.map