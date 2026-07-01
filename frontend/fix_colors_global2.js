const fs = require('fs');
const path = require('path');

const dirs = ['app', 'components', 'modules'];
const colors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

let modifiedFiles = 0;

for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = walk(dir);
    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;

        // Strip my previous bad fix dark:bg-none dark:bg-background
        content = content.replace(/dark:bg-none/g, '');
        content = content.replace(/dark:bg-background/g, '');
        content = content.replace(/dark:from-background/g, '');
        content = content.replace(/dark:to-background\/[0-9]+/g, '');
        content = content.replace(/dark:via-background\/[0-9]+/g, '');

        colors.forEach(color => {
            // Backgrounds
            content = content.replace(new RegExp('(?<!dark:)bg-' + color + '-50(\\/[0-9]+)?(?!.*dark:bg-' + color + ')', 'g'), '$& dark:bg-' + color + '-950/20');
            content = content.replace(new RegExp('(?<!dark:)bg-' + color + '-100(\\/[0-9]+)?(?!.*dark:bg-' + color + ')', 'g'), '$& dark:bg-' + color + '-950/30');
            
            // Gradients
            content = content.replace(new RegExp('(?<!dark:)from-' + color + '-50(\\/[0-9]+)?(?!.*dark:from-' + color + ')', 'g'), '$& dark:from-' + color + '-950/40');
            content = content.replace(new RegExp('(?<!dark:)to-' + color + '-50(\\/[0-9]+)?(?!.*dark:to-' + color + ')', 'g'), '$& dark:to-' + color + '-950/40');
            content = content.replace(new RegExp('(?<!dark:)via-' + color + '-50(\\/[0-9]+)?(?!.*dark:via-' + color + ')', 'g'), '$& dark:via-' + color + '-950/40');
            
            content = content.replace(new RegExp('(?<!dark:)from-' + color + '-100(\\/[0-9]+)?(?!.*dark:from-' + color + ')', 'g'), '$& dark:from-' + color + '-950/50');
            content = content.replace(new RegExp('(?<!dark:)to-' + color + '-100(\\/[0-9]+)?(?!.*dark:to-' + color + ')', 'g'), '$& dark:to-' + color + '-950/50');
            
            // Texts
            content = content.replace(new RegExp('(?<!dark:)text-' + color + '-700(\\/[0-9]+)?(?!.*dark:text-' + color + ')', 'g'), '$& dark:text-' + color + '-400');
            content = content.replace(new RegExp('(?<!dark:)text-' + color + '-800(\\/[0-9]+)?(?!.*dark:text-' + color + ')', 'g'), '$& dark:text-' + color + '-400');
            content = content.replace(new RegExp('(?<!dark:)text-' + color + '-900(\\/[0-9]+)?(?!.*dark:text-' + color + ')', 'g'), '$& dark:text-' + color + '-300');
            
            // Borders
            content = content.replace(new RegExp('(?<!dark:)border-' + color + '-100(\\/[0-9]+)?(?!.*dark:border-' + color + ')', 'g'), '$& dark:border-' + color + '-500/20');
            content = content.replace(new RegExp('(?<!dark:)border-' + color + '-200(\\/[0-9]+)?(?!.*dark:border-' + color + ')', 'g'), '$& dark:border-' + color + '-500/20');
        });

        if (content !== original) {
            fs.writeFileSync(file, content, 'utf8');
            modifiedFiles++;
        }
    }
}
console.log('Modified files:', modifiedFiles);
