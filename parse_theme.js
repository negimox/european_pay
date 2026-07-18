const fs = require('fs');
const html = fs.readFileSync('design/login_desktop/code.html', 'utf8');
const match = html.match(/tailwind\.config\s*=\s*(\{.*?\})\s*\}catch/s);
if (match) {
    const configStr = match[1].replace(/"/g, '"');
    // It's a JS object, let's eval it
    const config = eval('(' + configStr + ')');
    const { colors, spacing, fontSize, borderRadius, fontFamily } = config.theme.extend;
    let css = '\n/* Custom Theme from Design */\n@theme inline {\n';
    for (const [k, v] of Object.entries(colors)) {
        css += `  --color-${k}: ${v};\n`;
    }
    for (const [k, v] of Object.entries(spacing)) {
        css += `  --spacing-${k}: ${v};\n`;
    }
    for (const [k, v] of Object.entries(borderRadius)) {
        if (k === 'DEFAULT') css += `  --radius: ${v};\n`;
        else css += `  --radius-${k}: ${v};\n`;
    }
    for (const [k, v] of Object.entries(fontFamily)) {
        css += `  --font-${k}: ${v[0]};\n`;
    }
    for (const [k, v] of Object.entries(fontSize)) {
        css += `  --text-${k}: ${v[0]};\n`;
        css += `  --text-${k}--line-height: ${v[1].lineHeight};\n`;
        css += `  --text-${k}--font-weight: ${v[1].fontWeight};\n`;
        if (v[1].letterSpacing) css += `  --text-${k}--letter-spacing: ${v[1].letterSpacing};\n`;
    }
    css += '}\n';
    fs.writeFileSync('theme_vars.css', css);
    console.log('Saved to theme_vars.css');
}
