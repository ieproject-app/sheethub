export interface DownloadInfo {
  fileName: string;
  fileSize?: string;
  externalUrl: string;
  platform?: 'windows' | 'gdrive' | 'github' | 'font' | 'software' | 'driver' | 'doc';
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
  }
};
