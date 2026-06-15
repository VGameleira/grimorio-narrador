const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const materialDir = path.resolve('C:/Users/f1n4l/Desktop/Nova pasta/grimorio-narrador/rpg/material');
const outputDir = path.resolve('C:/Users/f1n4l/Desktop/Nova pasta/grimorio-narrador/rpg/material/extracted');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function extractPDF(filePath, outputName) {
    console.log('\n========== EXTRACTING PDF: ' + outputName + ' ==========');
    console.log('File size: ' + (fs.statSync(filePath).size / 1024 / 1024).toFixed(2) + ' MB');
    try {
        const parser = new PDFParse({ data: fs.readFileSync(filePath) });
        try {
            const info = await parser.getInfo({ parsePageInfo: true });
            console.log('Pages: ' + info.total);
            console.log('Title: ' + (info.info?.Title || 'N/A'));
            console.log('Author: ' + (info.info?.Author || 'N/A'));
        } catch (e) {
            console.log('Info extraction note: ' + e.message);
        }
        console.log('Extracting text from all pages...');
        const result = await parser.getText();
        await parser.destroy();
        const textLength = result.text ? result.text.length : 0;
        console.log('Text extracted: ' + textLength + ' characters');
        if (textLength > 0) {
            const outPath = path.join(outputDir, outputName + '.txt');
            fs.writeFileSync(outPath, result.text, 'utf8');
            console.log('Saved to: ' + outPath);
            return { success: true, text: result.text, textLength: textLength, filePath: outPath };
        } else {
            console.log('WARNING: No text extracted from PDF!');
            return { success: true, text: '', textLength: 0, warning: 'No text found' };
        }
    } catch (err) {
        console.error('ERROR extracting PDF: ' + err.message);
        return { success: false, error: err.message };
    }
}

async function extractDOCX(filePath, outputName) {
    console.log('\n========== EXTRACTING DOCX: ' + outputName + ' ==========');
    console.log('File size: ' + (fs.statSync(filePath).size / 1024).toFixed(2) + ' KB');
    try {
        const buffer = fs.readFileSync(filePath);
        console.log('Extracting text with mammoth...');
        const result = await mammoth.extractRawText({ buffer });
        const textLength = result.value ? result.value.length : 0;
        console.log('Text extracted: ' + textLength + ' characters');
        if (textLength > 0) {
            const outPath = path.join(outputDir, outputName + '.txt');
            fs.writeFileSync(outPath, result.value, 'utf8');
            console.log('Saved to: ' + outPath);
            return { success: true, text: result.value, textLength: textLength, filePath: outPath };
        } else {
            console.log('WARNING: No text extracted from DOCX!');
            return { success: true, text: '', textLength: 0, warning: 'No text found' };
        }
    } catch (err) {
        console.error('ERROR extracting DOCX: ' + err.message);
        return { success: false, error: err.message };
    }
}

async function main() {
    const files = [
        { path: path.join(materialDir, 'Feiticeiros & Maldi\u00e7\u00f5es - Livro de Regras v2.5.2.pdf'), name: 'Feiticeiros & Maldi\u00e7\u00f5es - Livro de Regras v2.5.2' },
        { path: path.join(materialDir, 'F&M 2.5 - Grim\u00f3rio das Maldi\u00e7\u00f5es (Vers\u00e3o 1).pdf'), name: 'F&M 2.5 - Grim\u00f3rio das Maldi\u00e7\u00f5es (Vers\u00e3o 1)' },
        { path: path.join(materialDir, 'Enciclop\u00e9dia Maldita (F&M 2.5.2) - v1.0.pdf'), name: 'Enciclop\u00e9dia Maldita (F&M 2.5.2) - v1.0' },
        { path: path.join(materialDir, 'REGRAS OPCIONAIS.docx'), name: 'REGRAS OPCIONAIS' }
    ];
    const results = {};
    for (const file of files) {
        if (fs.existsSync(file.path)) {
            const ext = path.extname(file.path).toLowerCase();
            console.log('\nProcessing: ' + file.name);
            if (ext === '.pdf') {
                results[file.name] = await extractPDF(file.path, file.name);
            } else if (ext === '.docx') {
                results[file.name] = await extractDOCX(file.path, file.name);
            }
        } else {
            console.log('File not found: ' + file.path);
            results[file.name] = { success: false, error: 'File not found' };
        }
    }
    console.log('\n========== SUMMARY ==========');
    for (const [name, result] of Object.entries(results)) {
        if (result.success) {
            console.log(name + ': OK (' + result.textLength + ' chars)');
        } else {
            console.log(name + ': FAILED - ' + result.error);
        }
    }
    const summaryPath = path.join(outputDir, '_extraction_summary.json');
    const summaryObj = Object.entries(results).map(function(e) {
        var name = e[0], r = e[1];
        return { name: name, success: r.success, textLength: r.textLength, warning: r.warning, error: r.error, filePath: r.filePath };
    });
    fs.writeFileSync(summaryPath, JSON.stringify(summaryObj, null, 2), 'utf8');
    console.log('\nSummary saved to: ' + summaryPath);
}

main().catch(function(err) {
    console.error('FATAL ERROR:', err);
    process.exit(1);
});