import {IStatement} from "./_statement";
import {seqs, vers} from "../combi";
import {SimpleName, Target} from "../expressions";
import {IStatementRunnable} from "../statement_runnable";
import {Version} from "../../../version";

export class CommitEntities implements IStatement {

  public getMatcher(): IStatementRunnable {
    const s = seqs("COMMIT ENTITIES RESPONSE OF", SimpleName,
                   "FAILED", Target,
                   "REPORTED", Target);
    return vers(Version.v754, s);
  }

}