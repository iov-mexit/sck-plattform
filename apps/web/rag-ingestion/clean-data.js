#!/usr/bin/env node

// Clean Regulatory Data Script (JavaScript version)
// Run this to extract clean, structured regulatory content

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RegulatoryDataCleaner {
  constructor(outputDir = './cleaned-data') {
    this.outputDir = outputDir;
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // Clean OWASP Top 10 data
  async cleanOWASPData(inputFile) {
    const rawContent = fs.readFileSync(inputFile, 'utf-8');

    // Extract clean OWASP content
    const cleanedContent = {
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
      categoryMatches.forEach((match) => {
        const [id, title] = match.split('-');
        const control = {
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
  async cleanGDPRData(inputFile) {
    const rawContent = fs.readFileSync(inputFile, 'utf-8');

    const cleanedContent = {
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
          const article = {
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

  // Helper methods for OWASP
  extractOWASPDescription(content, categoryId) {
    const regex = new RegExp(`${categoryId}[^<]*[^<]*?([^<]+)`, 'g');
    const match = regex.exec(content);
    return match ? match[1].trim() : '';
  }

  extractOWASPRequirements(content, categoryId) {
    return [];
  }

  extractOWASPImplementation(content, categoryId) {
    return [];
  }

  extractOWASPOverview(content) {
    const overviewMatch = content.match(/The OWASP Top 10[^<]*/);
    return overviewMatch ? overviewMatch[0].trim() : '';
  }

  extractOWASPMethodology(content) {
    const methodologyMatch = content.match(/methodology[^<]*/i);
    return methodologyMatch ? methodologyMatch[0].trim() : '';
  }

  // Helper methods for GDPR
  extractGDPRArticleContent(content, articleNumber) {
    const regex = new RegExp(`Article ${articleNumber}[^<]*?([^<]+)`, 'g');
    const match = regex.exec(content);
    return match ? match[1].trim() : '';
  }

  extractGDPRRequirements(content, articleNumber) {
    return [];
  }

  extractGDPRObligations(content, articleNumber) {
    return [];
  }

  extractGDPRRecitals(content) {
    const recitalsMatch = content.match(/Whereas[^<]*/);
    return recitalsMatch ? recitalsMatch[0].trim() : '';
  }

  extractGDPRPrinciples(content) {
    const principlesMatch = content.match(/principles[^<]*/i);
    return principlesMatch ? principlesMatch[0].trim() : '';
  }

  // Save cleaned data
  async saveCleanedData(content) {
    const filename = `${content.framework.toLowerCase()}_cleaned.json`;
    const filepath = path.join(this.outputDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
    console.log(`✅ Saved cleaned ${content.framework} data to ${filepath}`);
  }

  // Clean all regulatory data
  async cleanAllRegulatoryData() {
    const dataDir = './data';

    if (fs.existsSync(path.join(dataDir, 'owasp_top10.txt'))) {
      const owaspData = await this.cleanOWASPData(path.join(dataDir, 'owasp_top10.txt'));
      await this.saveCleanedData(owaspData);
    }

    if (fs.existsSync(path.join(dataDir, 'gdpr.txt'))) {
      const gdprData = await this.cleanGDPRData(path.join(dataDir, 'gdpr.txt'));
      await this.saveCleanedData(gdprData);
    }

    console.log('🎯 All regulatory data cleaned and saved!');
  }
}

async function main() {
  console.log('🧹 Starting regulatory data cleaning process...');

  try {
    const cleaner = new RegulatoryDataCleaner();

    console.log('📚 Cleaning all regulatory frameworks...');
    await cleaner.cleanAllRegulatoryData();

    console.log('✅ Data cleaning completed successfully!');
    console.log('📁 Check the ./cleaned-data directory for cleaned JSON files');

  } catch (error) {
    console.error('❌ Error during data cleaning:', error);
    process.exit(1);
  }
}

// Run the cleaning process
main();
