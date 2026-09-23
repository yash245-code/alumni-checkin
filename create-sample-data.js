const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sampleAlumni = [
  { Name: 'Priya Sharma', Email: 'priya.sharma@example.com', Phone: '919876543210' },
  { Name: 'Aarav Patel', Email: 'aarav.patel@example.com', Phone: '919812345678' },
  { Name: 'Rohan Verma', Email: 'rohan.verma@example.com', Phone: '919898989898' },
  { Name: 'Ananya Iyer', Email: 'ananya.iyer@example.com', Phone: '919765432109' },
  { Name: 'Vikram Singh', Email: 'vikram.singh@example.com', Phone: '919123456780' }
];

const worksheet = xlsx.utils.json_to_sheet(sampleAlumni);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Alumni');

const filePath = path.join(dataDir, 'alumni.xlsx');
xlsx.writeFile(workbook, filePath);

console.log(`Sample alumni spreadsheet created at ${filePath} with ${sampleAlumni.length} records.`);
