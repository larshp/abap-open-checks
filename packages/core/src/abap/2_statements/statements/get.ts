import {IStatement} from "./_statement";
import {verNot, seq, pers, opt, pluss} from "../combi";
import {Target, Field} from "../expressions";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";

export class Get implements IStatement {

  public getMatcher(): IStatementRunnable {
    const fields = seq("FIELDS", pluss(Field));

    const options = pers("LATE", fields);

    const ret = seq("GET",
                    Target,
                    opt(options));

    return verNot(Version.Cloud, ret);
  }

}