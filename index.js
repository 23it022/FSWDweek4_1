const fs = require('fs').promises;
const path = require('path');

// File categories based on extensions
const categories = {
    Images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    Documents: ['.pdf', '.doc', '.docx', '.txt', '.xlsx'],
    Videos: ['.mp4', '.avi', '.mkv', '.mov'],
};

// Function to determine file category
const getCategory = (ext) => {
    for (let category in categories) {
        if (categories[category].includes(ext)) {
            return category;
        }
    }
    return 'Others';
};

// Function to log operations in summary.txt
async function logOperation(file, category) {
    const logMessage = `Moved ${file} -> ${category}/\n`;
    await fs.appendFile('summary.txt', logMessage);
}

// Function to organize files
async function organizeFiles(dirPath) {
    try {
        if (!dirPath) {
            console.log('❌ Please provide a directory path.');
            return;
        }

        // Check if the directory exists
        const files = await fs.readdir(dirPath);

        for (let file of files) {
            const filePath = path.join(dirPath, file);
            const stat = await fs.stat(filePath);

            if (stat.isFile()) {
                const ext = path.extname(file).toLowerCase();
                const category = getCategory(ext);
                const categoryPath = path.join(dirPath, category);

                // Create category folder if it doesn't exist
                await fs.mkdir(categoryPath, { recursive: true });

                // Move file to category folder
                const newFilePath = path.join(categoryPath, file);
                await fs.rename(filePath, newFilePath);

                console.log(`✅ Moved ${file} -> ${category}/`);
                await logOperation(file, category);
            }
        }

        console.log('🎉 File organization complete!');
    } catch (err) {
        console.error('❌ Error organizing files:', err);
    }
}

// Get directory path from CLI argument
const dirPath = process.argv[2];
organizeFiles(dirPath);