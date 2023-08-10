const fs = require('fs');

const viewPath = process.cwd() + '/view';
const dirnames = fs.readdirSync(viewPath);
think.config('locale.support', dirnames);
