// invoked in master
const fs = require('fs');
const { join } = require('path');
const childProcess = require('child_process');
const fn = think.promisify(childProcess.exec, childProcess);
const isPkg = think.env === 'pkg';

think.beforeStartServer(async() => {
  if (!fs.existsSync(join(process.cwd(), '/view'))) {
    const view = fs.readFileSync(join(think.ROOT_PATH, './view.tar.gz'));
    fs.writeFileSync(join(process.cwd(), './view.tar.gz'), view);
    fs.mkdirSync(join(process.cwd(), './view'));
    await fn(`tar -xf view.tar.gz -C view`, {
      cwd: process.cwd()
    }).catch(() => '');
    fs.unlinkSync(join(process.cwd(), './view.tar.gz'));
  }

  if (
    isPkg &&
    (process.platform === 'win32' || process.platform === 'darwin')
  ) {
    await fn(`start http://127.0.0.1:${think.config('port')}`);
  }
});
