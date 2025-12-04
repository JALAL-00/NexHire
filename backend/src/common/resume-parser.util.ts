import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';

export class ResumeParser {
  static async parseResume(filePath: string): Promise<string> {
    try {
      // Check if file exists (Railway issue)
      if (!fs.existsSync(filePath)) {
        console.error(`Resume file not found: ${filePath}`);
        return ''; // Return empty string instead of throwing
      }

      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    } catch (error) {
      console.error(`Failed to parse resume at ${filePath}: ${error.message}`);
      return ''; // Return empty instead of throwing to allow screening to continue
    }
  }
}