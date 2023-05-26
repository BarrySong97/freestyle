import cac from "cac";
import { createDevServer } from "./dev";

const cli = cac("freestyle").version("0.0.1").help();

cli.command("dev [root]", "start dev server").action(async (root: string) => {
  const server = await createDevServer(root);
  await server.listen(9999);
  server.printUrls();
});

cli.parse();
