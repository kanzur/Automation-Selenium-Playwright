package com.automation.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ExcelReader {

    private Workbook workbook;
    private FileInputStream fis;

    public ExcelReader(String filePath) throws IOException {
        fis = new FileInputStream(filePath);
        workbook = new XSSFWorkbook(fis);
    }

    public Map<String, String> getRowData(String sheetName, int rowNumber) {
        Map<String, String> data = new HashMap<>();
        try {
            Sheet sheet = workbook.getSheet(sheetName);
            if (sheet == null) {
                throw new IllegalArgumentException("Sheet '" + sheetName + "' not found");
            }
            
            Row headerRow = sheet.getRow(0);
            Row row = sheet.getRow(rowNumber);
            
            if (headerRow == null || row == null) {
                throw new IllegalArgumentException("Row not found at index " + rowNumber);
            }

            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                Cell headerCell = headerRow.getCell(i);
                Cell dataCell = row.getCell(i);
                
                if (headerCell != null) {
                    String key = getCellValueAsString(headerCell);
                    String value = dataCell != null ? getCellValueAsString(dataCell) : "";
                    data.put(key, value);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error reading Excel data: " + e.getMessage(), e);
        }
        return data;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    public Workbook getWorkbook() {
        return workbook;
    }

    public void close() throws IOException {
        if (workbook != null) {
            workbook.close();
        }
        if (fis != null) {
            fis.close();
        }
    }
} 