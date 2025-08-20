import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

export interface TestData {
    [key: string]: string;
}

export class ExcelReader {
    private workbook: XLSX.WorkBook;
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        if (!fs.existsSync(filePath)) {
            throw new Error(`Excel file not found: ${filePath}`);
        }
        this.workbook = XLSX.readFile(filePath);
    }

    public getRowData(sheetName: string, rowNumber: number): TestData {
        const sheet = this.workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error(`Sheet '${sheetName}' not found`);
        }

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (rowNumber >= jsonData.length) {
            throw new Error(`Row ${rowNumber} not found in sheet '${sheetName}'`);
        }

        const headers = jsonData[0] as string[];
        const rowData = jsonData[rowNumber] as any[];

        const data: TestData = {};
        headers.forEach((header, index) => {
            if (header && rowData[index] !== undefined) {
                data[header] = String(rowData[index]);
            }
        });

        return data;
    }

    public getAllTestData(sheetName: string): TestData[] {
        const sheet = this.workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error(`Sheet '${sheetName}' not found`);
        }

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (jsonData.length < 2) {
            throw new Error(`No data rows found in sheet '${sheetName}'`);
        }

        const headers = jsonData[0] as string[];
        const allData: TestData[] = [];

        // Start from row 1 (skip header row 0)
        for (let i = 1; i < jsonData.length; i++) {
            const rowData = jsonData[i] as any[];
            const row: TestData = {};

            headers.forEach((header, index) => {
                if (header && rowData[index] !== undefined) {
                    row[header] = String(rowData[index]);
                }
            });

            // Only add rows that have valid data
            if (this.hasValidData(row)) {
                allData.push(row);
            }
        }

        return allData;
    }

    private hasValidData(rowData: TestData): boolean {
        const username = rowData['username'] || rowData['Username'];
        const password = rowData['password'] || rowData['Password'];
        return !!(username && username.trim() && password && password.trim());
    }

    public getWorkbook(): XLSX.WorkBook {
        return this.workbook;
    }

    public close(): void {
        // XLSX doesn't require explicit closing, but we can clean up references
        this.workbook = null as any;
    }

    public getSheetNames(): string[] {
        return this.workbook.SheetNames;
    }

    public getRowCount(sheetName: string): number {
        const sheet = this.workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error(`Sheet '${sheetName}' not found`);
        }
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        return jsonData.length - 1; // Subtract 1 for header row
    }
} 