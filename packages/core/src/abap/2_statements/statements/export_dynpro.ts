import {IStatement} from "./_statement";
import {verNot, seqs} from "../combi";
import {Source} from "../expressions";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";

export class ExportDynpro implements IStatement {

  public getMatcher(): IStatementRunnable {
    const ret = seqs("EXPORT DYNPRO",
                     Source,
                     Source,
                     Source,
                     Source,
                     "ID",
                     Source);

    return verNot(Version.Cloud, ret);
  }

}