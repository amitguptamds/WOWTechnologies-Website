const fs = require('fs');
let html = fs.readFileSync('public/scraped.html', 'utf8');

// 1. Fix unclosed span
html = html.replace(
  '<span style="color:rgba(255,255,255,0.7) !important;">WOWzer Technologies Inc. is a technology company',
  '<span style="color:rgba(255,255,255,0.7) !important;">WOWzer Technologies Inc. is a technology company'
);
// Wait, let's find the exact string for the unclosed span
