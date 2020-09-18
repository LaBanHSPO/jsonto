#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
 
fetch.Promise = Bluebird;
const config = require('../env.config.json');

try {
    const cli = process.argv[2];
    console.log('CLI: ', cli)
    const files = process.argv;
    files.splice(0,3);
    console.log('Received files', files)
    const fileContents = [];
    for (const f of files) {
        const existedFile =fs.existsSync(f);
        if (!existedFile) {
            throw new Error('File is not exist')
        }
        fileContents.push( fs.readFileSync(f, 'utf-8'));
    }
        
    const body = { textLineArr: fileContents };
    fetch(`${cli === 's2' ? config.s2 : config.s1}`, {
            method: 'POST',
            body:    JSON.stringify(body),
            headers: config.restHeaders,
        })
        .then(res => res.json())
        .then(json => console.log(json));

} catch (err) {
    console.log('[ERROR]', err.message);
    console.log(err);
}