import {ABAPFile} from "../abap/abap_file";
import {ABAPRule} from "./_abap_rule";
import {BasicRuleConfig} from "./_basic_rule_config";
import {IRuleMetadata, RuleTag} from "./_irule";
import {Issue} from "../issue";
import {Comment} from "../abap/2_statements/statements/_statement";
import {Position} from "../position";

export class AlignPseudoCommentsConf extends BasicRuleConfig {
}

export class AlignPseudoComments extends ABAPRule {
  private conf = new AlignPseudoCommentsConf();

  public getMetadata(): IRuleMetadata {
    return {
      key: "align_pseudo_comments",
      title: "Align pseudo comments",
      shortDescription: `Align code inspector pseudo comments in statements`,
      tags: [RuleTag.SingleFile, RuleTag.Whitespace, RuleTag.Quickfix],
      badExample: `WRITE 'sdf'. "#EC sdf`,
      goodExample: `WRITE 'sdf'.                                                "#EC sdf`,
    };
  }

  public getConfig() {
    return this.conf;
  }

  public setConfig(conf: AlignPseudoCommentsConf) {
    this.conf = conf;
  }

  public runParsed(file: ABAPFile) {
    const issues: Issue[] = [];

    let previousEnd: Position | undefined = undefined;

    for (const statement of file.getStatements()) {
      if (!(statement.get() instanceof Comment)) {
        previousEnd = statement.getLastToken().getEnd();
        continue;
      }
      const firstToken = statement.getFirstToken();
      if (firstToken.getStr().startsWith(`"#`) === false) {
        continue;
      } else if (previousEnd === undefined) {
        continue;
      } else if (previousEnd.getCol() < 60 && firstToken.getStart().getCol() !== 60) {
        const message = "Align pseudo comment to column 60";
        issues.push(Issue.atStatement(file, statement, message, this.getMetadata().key, this.conf.severity));
      }
    }

    return issues;
  }

}