import {IStatement} from "./_statement";
import {alt, plus, seq, ver} from "../combi";
import {SimpleName, Source, Target} from "../expressions";
import {IStatementRunnable} from "../statement_runnable";
import {Version} from "../../../version";

export class ModifyEntities implements IStatement {

  public getMatcher(): IStatementRunnable {
    const operation = alt(
      seq("UPDATE SET FIELDS WITH", Source),
      seq("CREATE FIELDS (", plus(SimpleName), ") WITH", Source));

    const s = seq("MODIFY ENTITIES OF", SimpleName,
                  "ENTITY", SimpleName,
                  operation,
                  "FAILED", Target,
                  "REPORTED", Target);
    return ver(Version.v754, s);
  }

}