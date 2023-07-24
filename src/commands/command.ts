import { Command as CommandCli } from 'commander'

export abstract class Command {
    public abstract load(program: CommandCli): void
    public abstract action(args: any): Promise<void>
}
