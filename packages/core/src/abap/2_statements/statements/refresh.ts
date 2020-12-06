import {IStatement} from "./_statement";
import {verNot, seqs, optPrio} from "../combi";
import {Target, DatabaseTable} from "../expressions";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";

export class Refresh implements IStatement {

  public getMatcher(): IStatementRunnable {
    const from = seqs("FROM TABLE", DatabaseTable);

    const ret = seqs("REFRESH", Target, optPrio(from));

    return verNot(Version.Cloud, ret);
  }

}