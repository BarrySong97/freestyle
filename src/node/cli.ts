import cac from 'cac';
import { createDevServer } from './dev';
import { resolve } from 'path';
import { build } from './build';
import path from 'path';

const cli = cac('freestyle').version('0.0.1').help();

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  root = root ? path.resolve(root) : process.cwd();
  const server = await createDevServer(root);
  await server.listen(9999);
  server.printUrls();
});
cli
  .command('build [root]', 'build in production')
  .action(async (root: string = process.cwd()) => {
    try {
      root = resolve(root);
      await build(root);
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
