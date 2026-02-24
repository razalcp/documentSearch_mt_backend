export interface TFIDFResult {
  document: any;
  score: number;
  highlights: string[];
}

export class TFIDFSearchEngine {
  private documents: any[] = [];

  constructor() {}

  public addDocuments(documents: any[]): void {
    this.documents = documents;
  }

  public search(query: string, limit: number = 10): TFIDFResult[] {
    const queryTerms = this.tokenize(query.toLowerCase());
    const results: TFIDFResult[] = [];

    this.documents.forEach((doc) => {
      let score = 0;
      const highlights: string[] = [];

      const docText = `${doc.title} ${doc.content}`.toLowerCase();
      
      queryTerms.forEach(term => {
        // Simple term frequency scoring
        const titleMatches = (doc.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        const contentMatches = (doc.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        
        // Weight title matches more heavily
        const termScore = (titleMatches * 3) + contentMatches;
        score += termScore;

        // Generate highlights
        const highlight = this.generateHighlight(docText, term);
        if (highlight) {
          highlights.push(highlight);
        }
      });

      if (score > 0) {
        results.push({
          document: doc,
          score,
          highlights: [...new Set(highlights)] // Remove duplicates
        });
      }
    });

    // Sort by score (descending) and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private tokenize(text: string): string[] {
    // Simple tokenization - split by whitespace and remove punctuation
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2); // Only keep terms longer than 2 characters
  }

  private generateHighlight(text: string, term: string, contextLength: number = 50): string | null {
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index === -1) return null;

    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + term.length + contextLength);
    
    let highlight = text.substring(start, end);
    
    // Add ellipsis if we're not at the beginning/end
    if (start > 0) highlight = '...' + highlight;
    if (end < text.length) highlight = highlight + '...';
    
    return highlight;
  }

  public getSuggestions(query: string, limit: number = 5): string[] {
    const queryTerms = this.tokenize(query.toLowerCase());
    const suggestions: Set<string> = new Set();

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

  private isSimilar(term1: string, term2: string): boolean {
    // Simple Levenshtein distance implementation
    const distance = this.levenshteinDistance(term1, term2);
    const maxLength = Math.max(term1.length, term2.length);
    const similarity = 1 - (distance / maxLength);
    
    return similarity >= 0.6; // 60% similarity threshold
  }

  private levenshteinDistance(str1: string, str2: string): number {
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
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}
