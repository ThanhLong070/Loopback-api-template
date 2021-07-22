import * as fs from 'fs';
import * as util from 'util';

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const direction = process.argv[2] || 'up';

if (direction !== 'up' && direction !== 'down') {
    throw new Error('Try node version.js up/down instead');
}

const IMAGE = /(registry.ql6625.fr\/fr_ql6625_template_api:)(-?\d+)/g;
const FILES = [
    'docker-compose.yml',
    'stack.yml',
    'Makefile'
];

let version: number | undefined;

async function main() {
    for (const file of FILES) {
        const content = await readFileAsync(file, { encoding: 'utf-8' });
        const content1 = content.replace(IMAGE, (_, image, two) => {
            version = version === undefined ? parseInt(two) + (direction === 'up' ? 1 : -1) : version;
            return [
                image,
                version
            ].join('');
        });
        await writeFileAsync(file, content1, { encoding: 'utf-8' });
    }

    console.log('version: ' + version);
}

main();
