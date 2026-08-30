const xlsx = require('xlsx');

function analyzeFile(filePath) {
    console.log(`\n=== Analyzing ${filePath} ===`);
    const workbook = xlsx.readFile(filePath);
    
    workbook.SheetNames.forEach(sheetName => {
        console.log(`\nSheet: ${sheetName}`);
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log("  First 5 rows:");
        for (let i = 0; i < Math.min(data.length, 5); i++) {
            console.log(`    Row ${i}:`, JSON.stringify(data[i]));
        }

        const headers = data[0];
        console.log(`  Columns (${headers.length}):`);
        
        // Analyze first 100 rows for data types and nulls
        const rowCount = Math.min(data.length - 1, 100);
        const columnStats = headers.map(h => ({
            name: h,
            types: new Set(),
            nullCount: 0,
            examples: new Set()
        }));

        for (let i = 1; i <= rowCount; i++) {
            const row = data[i];
            if (!row) continue;
            
            headers.forEach((header, colIdx) => {
                const val = row[colIdx];
                const stats = columnStats[colIdx];
                
                if (val === undefined || val === null || val === '') {
                    stats.nullCount++;
                } else {
                    stats.types.add(typeof val);
                    if (stats.examples.size < 3) {
                        stats.examples.add(val);
                    }
                }
            });
        }

        columnStats.forEach(stats => {
            const types = Array.from(stats.types).join(', ') || 'empty';
            const examples = Array.from(stats.examples).join(', ');
            console.log(`    - ${stats.name}: [Types: ${types}] (Nulls: ${stats.nullCount}/${rowCount}) - Examples: ${examples}`);
        });
    });
}

try {
    analyzeFile('Deal funnel Data.xlsx');
    analyzeFile('Work_Order_Tracker Data.xlsx');
} catch (e) {
    console.error(e);
}
