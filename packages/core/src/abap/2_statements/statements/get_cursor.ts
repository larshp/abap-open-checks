import {IStatement} from "./_statement";
import {verNot, str, seqs, per, opt} from "../combi";
import {Target} from "../expressions";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";

export class GetCursor implements IStatement {

  public getMatcher(): IStatementRunnable {
    const line = seqs("LINE", Target);
    const field = seqs("FIELD", Target);
    const offset = seqs("OFFSET", Target);
    const value = seqs("VALUE", Target);
    const length = seqs("LENGTH", Target);
    const area = seqs("AREA", Target);

    const ret = seqs("GET CURSOR",
                     per(line, opt(str("DISPLAY")), field, offset, value, length, area));

    return verNot(Version.Cloud, ret);
  }

}