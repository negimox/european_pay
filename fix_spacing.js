const fs = require('fs');
const files = ['app/(auth)/login/page.tsx', 'app/(auth)/register/page.tsx'];

const map = {
    'sm': '12px',
    'md': '24px',
    'lg': '48px',
    'xl': '80px',
    'xs': '4px',
    'margin-desktop': '64px',
    'margin-mobile': '16px'
};

const regex = new RegExp(`\\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-x|space-y)-(${Object.keys(map).join('|')})\\b`, 'g');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(regex, (match, prefix, suffix) => {
        return `${prefix}-[${map[suffix]}]`;
    });
    // Replace rounded-DEFAULT with rounded-[1rem] (since I deleted --radius)
    content = content.replace(/\brounded-DEFAULT\b/g, 'rounded-[1rem]');
    fs.writeFileSync(file, content);
});
console.log('Fixed spacing in auth pages.');
