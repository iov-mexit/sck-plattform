// Clean Regulatory Data System
// Extract clean, structured regulatory content from scraped HTML

import * as fs from 'fs';
import * as path from 'path';

interface CleanedRegulatoryContent {
  framework: string;
  title: string;
  version: string;
  sections: RegulatorySection[];
  articles: RegulatoryArticle[];
  controls: RegulatoryControl[];
  metadata: {
    source: string;
    lastUpdated: string;
    jurisdiction: string;
    language: string;
  };
}

interface RegulatorySection {
  id: string;
  title: string;
  content: string;
  subsections: RegulatorySection[];
}

interface RegulatoryArticle {
  id: string;
  title: string;
  content: string;
  requirements: string[];
  obligations: string[];
}

interface RegulatoryControl {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  implementation: string[];
}

export class RegulatoryDataCleaner {
  private outputDir: string;

  constructor(outputDir: string = './cleaned-data') {
    this.outputDir = outputDir;
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // Clean OWASP Top 10 data
  async cleanOWASPData(inputFile: string): Promise<CleanedRegulatoryContent> {
    const rawContent = fs.readFileSync(inputFile, 'utf-8');

    // Extract clean OWASP content
    const cleanedContent: CleanedRegulatoryContent = {
      framework: 'OWASP',
      title: 'OWASP Top 10 Web Application Security Risks',
      version: '2021',
      sections: [],
      articles: [],
      controls: [],
      metadata: {
        source: 'OWASP Foundation',
        lastUpdated: '2021',
        jurisdiction: 'Global',
        language: 'English'
      }
    };

    // Extract OWASP Top 10 categories
    const categoryMatches = rawContent.match(/A\d{2}:\d{4}-[^<]+/g);
    if (categoryMatches) {
      categoryMatches.forEach((match, index) => {
        const [id, title] = match.split('-');
        const control: RegulatoryControl = {
          id: id.trim(),
          title: title.trim(),
          description: this.extractOWASPDescription(rawContent, id),
          requirements: this.extractOWASPRequirements(rawContent, id),
          implementation: this.extractOWASPImplementation(rawContent, id)
        };
        cleanedContent.controls.push(control);
      });
    }

    // Extract key sections
    cleanedContent.sections = [
      {
        id: 'overview',
        title: 'Overview',
        content: this.extractOWASPOverview(rawContent),
        subsections: []
      },
      {
        id: 'methodology',
        title: 'Methodology',
        content: this.extractOWASPMethodology(rawContent),
        subsections: []
      }
    ];

    return cleanedContent;
  }

  // Clean GDPR data
  async cleanGDPRData(inputFile: string): Promise<CleanedRegulatoryContent> {
    const rawContent = fs.readFileSync(inputFile, 'utf-8');

    const cleanedContent: CleanedRegulatoryContent = {
      framework: 'GDPR',
      title: 'General Data Protection Regulation (EU) 2016/679',
      version: '2016/679',
      sections: [],
      articles: [],
      controls: [],
      metadata: {
        source: 'EUR-Lex',
        lastUpdated: '2016-05-04',
        jurisdiction: 'European Union',
        language: 'English'
      }
    };

    // Extract GDPR articles
    const articleMatches = rawContent.match(/Article \d+[^<]*/g);
    if (articleMatches) {
      articleMatches.forEach((match) => {
        const articleMatch = match.match(/Article (\d+)[^<]*/);
        if (articleMatch) {
          const articleNumber = articleMatch[1];
          const article: RegulatoryArticle = {
            id: `Article ${articleNumber}`,
            title: `Article ${articleNumber}`,
            content: this.extractGDPRArticleContent(rawContent, articleNumber),
            requirements: this.extractGDPRRequirements(rawContent, articleNumber),
            obligations: this.extractGDPRObligations(rawContent, articleNumber)
          };
          cleanedContent.articles.push(article);
        }
      });
    }

    // Extract key sections
    cleanedContent.sections = [
      {
        id: 'recitals',
        title: 'Recitals',
        content: this.extractGDPRRecitals(rawContent),
        subsections: []
      },
      {
        id: 'principles',
        title: 'Data Protection Principles',
        content: this.extractGDPRPrinciples(rawContent),
        subsections: []
      }
    ];

    return cleanedContent;
  }

  // Clean NIS2 data
  async cleanNIS2Data(inputFile: string): Promise<CleanedRegulatoryContent> {
    const rawContent = fs.readFileSync(inputFile, 'utf-8');

    const cleanedContent: CleanedRegulatoryContent = {
      framework: 'NIS2',
      title: 'Directive (EU) 2022/2555 on measures for a high common level of cybersecurity across the Union',
      version: '2022/2555',
      sections: [],
      articles: [],
      controls: [],
      metadata: {
        source: 'EUR-Lex',
        lastUpdated: '2022-12-27',
        jurisdiction: 'European Union',
        language: 'English'
      }
    };

    // Extract NIS2 articles
    const articleMatches = rawContent.match(/Article \d+[^<]*/g);
    if (articleMatches) {
      articleMatches.forEach((match) => {
        const articleMatch = match.match(/Article (\d+)[^<]*/);
        if (articleMatch) {
          const articleNumber = articleMatch[1];
          const article: RegulatoryArticle = {
            id: `Article ${articleNumber}`,
            title: `Article ${articleNumber}`,
            content: this.extractNIS2ArticleContent(rawContent, articleNumber),
            requirements: this.extractNIS2Requirements(rawContent, articleNumber),
            obligations: this.extractNIS2Obligations(rawContent, articleNumber)
          };
          cleanedContent.articles.push(article);
        }
      });
    }

    // Extract key sections
    cleanedContent.sections = [
      {
        id: 'scope',
        title: 'Scope and Definitions',
        content: this.extractNIS2Scope(rawContent),
        subsections: []
      },
      {
        id: 'security',
        title: 'Security Requirements',
        content: this.extractNIS2SecurityRequirements(rawContent),
        subsections: []
      }
    ];

    return cleanedContent;
  }

  // Clean NIST CSF data
  async cleanNISTCSFData(inputFile: string): Promise<CleanedRegulatoryContent> {
    const rawContent = fs.readFileSync(inputFile, 'utf-8');

    const cleanedContent: CleanedRegulatoryContent = {
      framework: 'NIST_CSF',
      title: 'NIST Cybersecurity Framework',
      version: '2.0',
      sections: [],
      articles: [],
      controls: [],
      metadata: {
        source: 'National Institute of Standards and Technology',
        lastUpdated: '2024',
        jurisdiction: 'United States',
        language: 'English'
      }
    };

    // Extract NIST CSF functions
    const functions = ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'];
    functions.forEach((func) => {
      const control: RegulatoryControl = {
        id: func,
        title: `${func} Function`,
        description: this.extractNISTFunctionDescription(rawContent, func),
        requirements: this.extractNISTFunctionRequirements(rawContent, func),
        implementation: this.extractNISTFunctionImplementation(rawContent, func)
      };
      cleanedContent.controls.push(control);
    });

    // Extract key sections
    cleanedContent.sections = [
      {
        id: 'framework',
        title: 'Framework Core',
        content: this.extractNISTFrameworkCore(rawContent),
        subsections: []
      },
      {
        id: 'implementation',
        title: 'Framework Implementation Tiers',
        content: this.extractNISTImplementationTiers(rawContent),
        subsections: []
      }
    ];

    return cleanedContent;
  }

  // Clean EU AI Act data
  async cleanEUAIActData(inputFile: string): Promise<CleanedRegulatoryContent> {
    const rawContent = fs.readFileSync(inputFile, 'utf-8');

    const cleanedContent: CleanedRegulatoryContent = {
      framework: 'EU_AI_ACT',
      title: 'Regulation (EU) 2024/... on Artificial Intelligence',
      version: '2024',
      sections: [],
      articles: [],
      controls: [],
      metadata: {
        source: 'EUR-Lex',
        lastUpdated: '2024',
        jurisdiction: 'European Union',
        language: 'English'
      }
    };

    // Extract EU AI Act articles
    const articleMatches = rawContent.match(/Article \d+[^<]*/g);
    if (articleMatches) {
      articleMatches.forEach((match) => {
        const articleMatch = match.match(/Article (\d+)[^<]*/);
        if (articleMatch) {
          const articleNumber = articleMatch[1];
          const article: RegulatoryArticle = {
            id: `Article ${articleNumber}`,
            title: `Article ${articleNumber}`,
            content: this.extractEUAIActArticleContent(rawContent, articleNumber),
            requirements: this.extractEUAIActRequirements(rawContent, articleNumber),
            obligations: this.extractEUAIActObligations(rawContent, articleNumber)
          };
          cleanedContent.articles.push(article);
        }
      });
    }

    // Extract key sections
    cleanedContent.sections = [
      {
        id: 'risk-classification',
        title: 'Risk Classification',
        content: this.extractEUAIActRiskClassification(rawContent),
        subsections: []
      },
      {
        id: 'requirements',
        title: 'Requirements for High-Risk AI Systems',
        content: this.extractEUAIActHighRiskRequirements(rawContent),
        subsections: []
      }
    ];

    return cleanedContent;
  }

  // Helper methods for OWASP
  private extractOWASPDescription(content: string, categoryId: string): string {
    // Extract description for specific OWASP category
    const regex = new RegExp(`${categoryId}[^<]*[^<]*?([^<]+)`, 'g');
    const match = regex.exec(content);
    return match ? match[1].trim() : '';
  }

  private extractOWASPRequirements(content: string, categoryId: string): string[] {
    // Extract requirements for specific OWASP category
    const requirements: string[] = [];
    // Implementation would parse specific requirements
    return requirements;
  }

  private extractOWASPImplementation(content: string, categoryId: string): string[] {
    // Extract implementation guidance for specific OWASP category
    const implementation: string[] = [];
    // Implementation would parse specific guidance
    return implementation;
  }

  private extractOWASPOverview(content: string): string {
    // Extract OWASP overview section
    const overviewMatch = content.match(/The OWASP Top 10[^<]*/);
    return overviewMatch ? overviewMatch[0].trim() : '';
  }

  private extractOWASPMethodology(content: string): string {
    // Extract OWASP methodology section
    const methodologyMatch = content.match(/methodology[^<]*/i);
    return methodologyMatch ? methodologyMatch[0].trim() : '';
  }

  // Helper methods for GDPR
  private extractGDPRArticleContent(content: string, articleNumber: string): string {
    // Extract content for specific GDPR article
    const regex = new RegExp(`Article ${articleNumber}[^<]*?([^<]+)`, 'g');
    const match = regex.exec(content);
    return match ? match[1].trim() : '';
  }

  private extractGDPRRequirements(content: string, articleNumber: string): string[] {
    // Extract requirements for specific GDPR article
    const requirements: string[] = [];
    // Implementation would parse specific requirements
    return requirements;
  }

  private extractGDPRObligations(content: string, articleNumber: string): string[] {
    // Extract obligations for specific GDPR article
    const obligations: string[] = [];
    // Implementation would parse specific obligations
    return obligations;
  }

  private extractGDPRRecitals(content: string): string {
    // Extract GDPR recitals section
    const recitalsMatch = content.match(/Whereas[^<]*/);
    return recitalsMatch ? recitalsMatch[0].trim() : '';
  }

  private extractGDPRPrinciples(content: string): string {
    // Extract GDPR principles section
    const principlesMatch = content.match(/principles[^<]*/i);
    return principlesMatch ? principlesMatch[0].trim() : '';
  }

  // Helper methods for NIS2
  private extractNIS2ArticleContent(content: string, articleNumber: string): string {
    // Extract content for specific NIS2 article
    const regex = new RegExp(`Article ${articleNumber}[^<]*?([^<]+)`, 'g');
    const match = regex.exec(content);
    return match ? match[1].trim() : '';
  }

  private extractNIS2Requirements(content: string, articleNumber: string): string[] {
    // Extract requirements for specific NIS2 article
    const requirements: string[] = [];
    // Implementation would parse specific requirements
    return requirements;
  }

  private extractNIS2Obligations(content: string, articleNumber: string): string[] {
    // Extract obligations for specific NIS2 article
    const obligations: string[] = [];
    // Implementation would parse specific obligations
    return obligations;
  }

  private extractNIS2Scope(content: string): string {
    // Extract NIS2 scope section
    const scopeMatch = content.match(/scope[^<]*/i);
    return scopeMatch ? scopeMatch[0].trim() : '';
  }

  private extractNIS2SecurityRequirements(content: string): string {
    // Extract NIS2 security requirements section
    const securityMatch = content.match(/security[^<]*/i);
    return securityMatch ? securityMatch[0].trim() : '';
  }

  // Helper methods for NIST CSF
  private extractNISTFunctionDescription(content: string, functionName: string): string {
    // Extract description for specific NIST function
    const regex = new RegExp(`${functionName}[^<]*?([^<]+)`, 'gi');
    const match = regex.exec(content);
    return match ? match[1].trim() : '';
  }

  private extractNISTFunctionRequirements(content: string, functionName: string): string[] {
    // Extract requirements for specific NIST function
    const requirements: string[] = [];
    // Implementation would parse specific requirements
    return requirements;
  }

  private extractNISTFunctionImplementation(content: string, functionName: string): string[] {
    // Extract implementation for specific NIST function
    const implementation: string[] = [];
    // Implementation would parse specific implementation
    return implementation;
  }

  private extractNISTFrameworkCore(content: string): string {
    // Extract NIST framework core section
    const coreMatch = content.match(/framework[^<]*/i);
    return coreMatch ? coreMatch[0].trim() : '';
  }

  private extractNISTImplementationTiers(content: string): string {
    // Extract NIST implementation tiers section
    const tiersMatch = content.match(/tiers[^<]*/i);
    return tiersMatch ? tiersMatch[0].trim() : '';
  }

  // Helper methods for EU AI Act
  private extractEUAIActArticleContent(content: string, articleNumber: string): string {
    // Extract content for specific EU AI Act article
    const regex = new RegExp(`Article ${articleNumber}[^<]*?([^<]+)`, 'g');
    const match = regex.exec(content);
    return match ? match[1].trim() : '';
  }

  private extractEUAIActRequirements(content: string, articleNumber: string): string[] {
    // Extract requirements for specific EU AI Act article
    const requirements: string[] = [];
    // Implementation would parse specific requirements
    return requirements;
  }

  private extractEUAIActObligations(content: string, articleNumber: string): string[] {
    // Extract obligations for specific EU AI Act article
    const obligations: string[] = [];
    // Implementation would parse specific obligations
    return obligations;
  }

  private extractEUAIActRiskClassification(content: string): string {
    // Extract EU AI Act risk classification section
    const riskMatch = content.match(/risk[^<]*/i);
    return riskMatch ? riskMatch[0].trim() : '';
  }

  private extractEUAIActHighRiskRequirements(content: string): string {
    // Extract EU AI Act high-risk requirements section
    const highRiskMatch = content.match(/high-risk[^<]*/i);
    return highRiskMatch ? highRiskMatch[0].trim() : '';
  }

  // Save cleaned data
  async saveCleanedData(content: CleanedRegulatoryContent): Promise<void> {
    const filename = `${content.framework.toLowerCase()}_cleaned.json`;
    const filepath = path.join(this.outputDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
    console.log(`✅ Saved cleaned ${content.framework} data to ${filepath}`);
  }

  // Clean all regulatory data
  async cleanAllRegulatoryData(): Promise<void> {
    const dataDir = './data';

    if (fs.existsSync(path.join(dataDir, 'owasp_top10.txt'))) {
      const owaspData = await this.cleanOWASPData(path.join(dataDir, 'owasp_top10.txt'));
      await this.saveCleanedData(owaspData);
    }

    if (fs.existsSync(path.join(dataDir, 'gdpr.txt'))) {
      const gdprData = await this.cleanGDPRData(path.join(dataDir, 'gdpr.txt'));
      await this.saveCleanedData(gdprData);
    }

    if (fs.existsSync(path.join(dataDir, 'nis2.txt'))) {
      const nis2Data = await this.cleanNIS2Data(path.join(dataDir, 'nis2.txt'));
      await this.saveCleanedData(nis2Data);
    }

    if (fs.existsSync(path.join(dataDir, 'nist_csf.txt'))) {
      const nistData = await this.cleanNISTCSFData(path.join(dataDir, 'nist_csf.txt'));
      await this.saveCleanedData(nistData);
    }

    if (fs.existsSync(path.join(dataDir, 'eu_ai_act.txt'))) {
      const aiActData = await this.cleanEUAIActData(path.join(dataDir, 'eu_ai_act.txt'));
      await this.saveCleanedData(aiActData);
    }

    console.log('🎯 All regulatory data cleaned and saved!');
  }
}
