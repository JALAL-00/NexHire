import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';

export class ResumeParser {
  static async parseResume(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    } catch (error) {
      throw new Error(`Failed to parse resume at ${filePath}: ${error.message}`);
    }
  }
}