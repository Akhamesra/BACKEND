const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Enable CORS for all origins
app.use(cors());

app.use(bodyParser.json());

function processData(data) {
    const numbers = [];
    const alphabets = [];
    data.forEach(item => {
        if (/^\d+$/.test(item)) {
            numbers.push(item);
        } else if (/^[A-Za-z]+$/.test(item)) {
            alphabets.push(item);
        }
    });
    return { numbers, alphabets };
}

function findHighestLowercase(alphabets) {
    const lowercase = alphabets.filter(ch => ch === ch.toLowerCase());
    if (lowercase.length > 0) {
        const maxChar = lowercase.reduce((max, current) => current > max ? current : max);
        return [maxChar];
    }
    return [];
}


function validateFile(fileB64) {
    if (!fileB64) {
        return [false, "", 0];
    }
    try {
        const fileData = Buffer.from(fileB64, 'base64');
        const fileSizeKb = fileData.length / 1024;
        const mimeType = "application/octet-stream";
        return [true, mimeType, fileSizeKb];
    } catch (error) {
        return [false, "", 0];
    }
}

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const data = req.body.data;
            const fileB64 = req.body.file_b64 || "";

            const { numbers, alphabets } = processData(data);
            const highestLowercase = findHighestLowercase(alphabets);
            const [fileValid, fileMimeType, fileSizeKb] = validateFile(fileB64);

            const response = {
                is_success: true,
                user_id: "john_doe_17091999",
                email: "john@xyz.com",
                roll_number: "ABCD123",
                numbers,
                alphabets,
                highest_lowercase_alphabet: highestLowercase,
                file_valid: fileValid,
                file_mime_type: fileMimeType,
                file_size_kb: fileSizeKb,
            };
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ is_success: false, error: error.message });
        }
    } else if (req.method === 'GET') {
        res.status(200).json({ operation_code: 1 });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};