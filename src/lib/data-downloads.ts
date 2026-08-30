export interface DownloadInfo {
  fileName: string;
  fileSize?: string;
  externalUrl: string;
  platform?: 'windows' | 'gdrive' | 'excel' | 'github' | 'font' | 'software' | 'driver' | 'doc';
  descriptionEn?: string;
  howToUseEn?: string[];
  license?: string;
}

export const downloadLinks: Record<string, DownloadInfo> = {
  'vlookup-example-template': {
    fileName: 'VLOOKUP Formula Examples (Interactive)',
    fileSize: 'Google Sheets',
    externalUrl: 'https://docs.google.com/spreadsheets/d/1SppjBLarLxIenYFl7gJ3faGVOEjNg1omgZyHStWzyDA/edit',
    platform: 'gdrive',
    license: 'Free',
    descriptionEn: 'An interactive Google Sheets template demonstrating how to use VLOOKUP in various real-world scenarios. Includes examples for exact match, approximate match, handling #N/A errors with IFERROR, and combining VLOOKUP with other functions like MATCH and COLUMN for dynamic column lookups.',
    howToUseEn: [
      'Open the template using the button above — it will open in Google Sheets in a new tab.',
      'Click File → Make a copy to save your own editable version (required for editing).',
      'Explore the sheets: each tab covers a different VLOOKUP use case with formulas pre-written.',
      'Modify the lookup values in the highlighted cells to see how the formulas respond in real time.',
      'Use the examples as references when building your own spreadsheets.'
    ]
  },
  'sumif-example-template': {
    fileName: 'SUMIF & SUMIFS Formula Examples',
    fileSize: 'Google Sheets',
    externalUrl: 'https://docs.google.com/spreadsheets/d/10jS3zvf5YyB5gQTgH4ouMGXPtKBavlLqT0c4H4Afato/edit',
    platform: 'gdrive',
    license: 'Free',
    descriptionEn: 'A practical Google Sheets template showcasing SUMIF and SUMIFS formulas for conditional summing. Covers single-condition sums, multi-condition sums with up to 5 criteria, date range filtering, wildcard matching for partial text, and tips for combining SUMIFS with ARRAYFORMULA for bulk calculations.',
    howToUseEn: [
      'Click the "Open in Google Sheets" button to access the template.',
      'Make a copy to your Google Drive via File → Make a copy.',
      'Each tab is organized by complexity: beginner (SUMIF) through advanced (SUMIFS with arrays).',
      'Edit the yellow-highlighted input cells to test different conditions.',
      'Review the formula examples and adapt them to your own datasets.'
    ]
  },
  'indexmatch-example-template': {
    fileName: 'INDEX-MATCH Formula Examples',
    fileSize: 'Google Sheets',
    externalUrl: 'https://docs.google.com/spreadsheets/d/1K9C-f3WVRwI9ZHg54xqGVt7sHvsulevsXcv338p51II/edit',
    platform: 'gdrive',
    license: 'Free',
    descriptionEn: 'A comprehensive Google Sheets template demonstrating INDEX-MATCH combinations as a flexible alternative to VLOOKUP and XLOOKUP. Includes left lookups, two-way lookups (matrix), column-relative lookups that survive column insertions, and INDEX-MATCH inside SUMPRODUCT for conditional lookups with multiple criteria.',
    howToUseEn: [
      'Open the template via the download button above.',
      'Create your own copy: File → Make a copy.',
      'Browse through the tabs: each focuses on one INDEX-MATCH pattern.',
      'The orange cells are interactive inputs; change them to test different scenarios.',
      'Use the commented sections to understand how each formula component works.'
    ]
  },
  'excel-rounding-functions-round-mround-ceiling-floor-guide': {
    fileName: 'Excel Rounding Functions Examples',
    fileSize: '10 KB · .xlsx',
    externalUrl: '/downloads/templates/excel-rounding-functions-round-mround-ceiling-floor-guide.xlsx',
    platform: 'excel',
    license: 'Free',
    descriptionEn: 'A working workbook covering the whole Excel rounding family: ROUND, ROUNDUP, ROUNDDOWN, MROUND, CEILING, and FLOOR. Includes a comparison sheet with positive and negative values, an invoice sheet that rounds line totals before summing, and a timesheet sheet that rounds hours to the nearest quarter.',
    howToUseEn: [
      'Download the file and open it in Excel (Microsoft 365 or Excel 2021 recommended).',
      'Edit the yellow input cells — every formula recalculates instantly.',
      'Check the Rounding Family sheet to compare all six functions on the same values.',
      'Use the Invoice sheet to see why rounding each line first keeps totals consistent.',
      'Read the notes under each table for the rule each function follows.'
    ]
  },
  'google-sheets-unique-function-guide': {
    fileName: 'UNIQUE Function Examples',
    fileSize: '10 KB · .xlsx',
    externalUrl: '/downloads/templates/google-sheets-unique-function-guide.xlsx',
    platform: 'excel',
    license: 'Free',
    descriptionEn: 'A ready-made workbook for practicing the UNIQUE function: deduplicate a customer list, extract unique full rows across multiple columns, and pull values that appear exactly once. Works in Google Sheets and Excel 365/2021.',
    howToUseEn: [
      'Download the file, then upload it to Google Drive and open with Google Sheets (or use Excel 365).',
      'Add or rename customers in the source column — the UNIQUE results spill and update automatically.',
      'Compare UNIQUE with SORT(UNIQUE(...)) on the Distinct Customers sheet.',
      'Use the Unique Rows sheet to see that only fully identical rows are dropped.',
      'Try the Exactly Once sheet to understand the third UNIQUE argument.'
    ]
  },
  'xlookup-complete-guide': {
    fileName: 'XLOOKUP Function Examples',
    fileSize: '10 KB · .xlsx',
    externalUrl: '/downloads/templates/xlookup-complete-guide.xlsx',
    platform: 'excel',
    license: 'Free',
    descriptionEn: 'An XLOOKUP practice workbook: exact match with a custom "Not found" message, a left lookup that VLOOKUP cannot do, a three-column spill result from one formula, and an approximate-match tax bracket example. Requires Microsoft 365 or Excel 2021+.',
    howToUseEn: [
      'Download the file and open it in Excel (Microsoft 365 or Excel 2021+ — XLOOKUP is not in older versions).',
      'Change the yellow lookup cells and watch the results update.',
      'On the Basic & Errors sheet, compare the naked #N/A case with the custom "Not found" message.',
      'On the Left Lookup & Spill sheet, see one formula return three columns at once.',
      'Use the Approximate sheet to understand match_mode -1 with income brackets.'
    ]
  },
  'countif-countifs-guide': {
    fileName: 'COUNTIF & COUNTIFS Examples',
    fileSize: '9 KB · .xlsx',
    externalUrl: '/downloads/templates/countif-countifs-guide.xlsx',
    platform: 'excel',
    license: 'Free',
    descriptionEn: 'A 12-row orders table with a summary sheet of live COUNTIF and COUNTIFS formulas: single conditions, wildcards, exclusions, multi-criteria counts, amount ranges, and 2026 date ranges. Every formula is shown as both readable text and a live result.',
    howToUseEn: [
      'Download the file and open it in Excel.',
      'Edit the Orders Data sheet — the summary counts recalculate automatically.',
      'Read the Formula Used column to see the exact syntax for each question.',
      'Compare the Result column with your own edits to verify you understand each criteria string.',
      'Try adding your own rows: criteria ranges are fixed to A2:D13, so extend them if you add data below.'
    ]
  },
  'if-nested-ifs-ifs-guide': {
    fileName: 'IF, Nested IF & IFS Examples',
    fileSize: '9 KB · .xlsx',
    externalUrl: '/downloads/templates/if-nested-ifs-ifs-guide.xlsx',
    platform: 'excel',
    license: 'Free',
    descriptionEn: 'A decision-logic workbook with three sheets: a grading sheet where nested IF and IFS produce identical grades side by side, an order-labeling sheet with a boundary case at exactly 500, and a region-bonus sheet comparing nested IF against the cleaner IFS syntax.',
    howToUseEn: [
      'Download the file and open it in Excel (IFS needs Excel 2019+ or Microsoft 365).',
      'Change the yellow score cells and watch Pass/Fail and both grade columns update.',
      'Compare columns D and E on the Grading sheet — same results, very different readability.',
      'Check the boundary row on the Order Labels sheet to see why 500 stays Standard.',
      'Use the Region Bonus sheet to decide when nested IF is still fine (2-3 conditions).'
    ]
  }
};
