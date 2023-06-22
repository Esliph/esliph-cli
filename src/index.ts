import { Command } from "commander";

const program = new Command();

program.name("liph").description("").version("");

program.option("-m, --module <type>", "module name");

program.parse(process.argv);

const options = program.opts();

if (options.module) console.log(options.module);
