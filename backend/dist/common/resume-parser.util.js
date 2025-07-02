"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeParser = void 0;
const fs = require("fs");
const pdfParse = require("pdf-parse");
class ResumeParser {
    static async parseResume(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);
            return pdfData.text;
        }
        catch (error) {
            throw new Error(`Failed to parse resume at ${filePath}: ${error.message}`);
        }
    }
}
exports.ResumeParser = ResumeParser;
//# sourceMappingURL=resume-parser.util.js.map