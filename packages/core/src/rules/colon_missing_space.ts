import {Issue} from "../issue";
import {ABAPRule} from "./_abap_rule";
import {BasicRuleConfig} from "./_basic_rule_config";
import {Position} from "../position";
import {EditHelper} from "../edit_helper";
import {IRuleMetadata, RuleTag} from "./_irule";
import {ABAPFile} from "../abap/abap_file";
import {Comment, NativeSQL} from "../abap/2_statements/statements/_statement";

export class ColonMissingSpaceConf extends BasicRuleConfig {
}

export class ColonMissingSpace extends ABAPRule {

  private conf = new ColonMissingSpaceConf();

  public getMetadata(): IRuleMetadata {
    return {
      key: "colon_missing_space",
      title: "Colon missing space",
      shortDescription: `Checks for missing spaces after colons in chained statements.`,
      tags: [RuleTag.Whitespace, RuleTag.Quickfix, RuleTag.SingleFile],
      badExample: `WRITE:hello, world.`,
      goodExample: `WRITE: hello, world.`,
    };
  }

  private getMessage(): string {
    return "Missing space after the colon";
  }

  public getConfig() {
    return this.conf;
  }

  public setConfig(conf: ColonMissingSpaceConf) {
    this.conf = conf;
  }

  public runParsed(file: ABAPFile) {
    const issues: Issue[] = [];

    for (const statement of file.getStatements()) {
      const colon = statement.getColon();
      if (colon === undefined
          || statement.get() instanceof NativeSQL
          || statement.get() instanceof Comment) {
        continue;
      }

      // todo: this can be more smart, performance wise
      const tokens = [...statement.getTokens()];
      tokens.push(colon);
      tokens.sort((a, b) => a.getStart().isAfter(b.getStart()) ? 1 : -1 );

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.getStr() === ":"
            && tokens[i + 1] !== undefined
            && tokens[i + 1].getRow() === token.getRow()
            && tokens[i + 1].getCol() === token.getCol() + 1) {
          const start = token.getStart();
          const end = new Position(start.getRow(), start.getCol() + 1);
          const fix = EditHelper.insertAt(file, end, " ");
          const issue = Issue.atRange(file, start, end, this.getMessage(), this.getMetadata().key, this.conf.severity, fix);
          issues.push(issue);
        }
      }
    }

    return issues;
  }
}