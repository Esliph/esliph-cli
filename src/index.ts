import { Command } from "commander";
import { CommandType } from "./@types/command.d";
import * as ModuleCommand from "./commands/module";

const program = new Command();

const commands: { option: CommandType; execModule: () => void }[] = [
  ModuleCommand,
];

program.name("liph").description("").version("");

commands.forEach(
  ({ option: { flags, defaultValue, description }, execModule }) => {
    program.option(flags, description, defaultValue);
  }
);

program.parse(process.argv);

const options = program.opts();

if (options.module) console.log(options.module);
