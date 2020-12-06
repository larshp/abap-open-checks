import {IStatement} from "./_statement";
import {seq, alt, opt, vers, optPrios, altPrio} from "../combi";
import {Version} from "../../../version";
import {Source, Field, ParameterListS, ClassName, MessageSource, BasicSource} from "../expressions";
import {IStatementRunnable} from "../statement_runnable";

export class Raise implements IStatement {

  public getMatcher(): IStatementRunnable {
    const wit = seq("WITH",
                    Source,
                    opt(Source),
                    opt(Source),
                    opt(Source));

    const mess = seq("MESSAGE",
                     MessageSource,
                     opt(wit));

    const messid = seq("MESSAGE ID",
                       Source,
                       "NUMBER",
                       Source,
                       optPrios(wit));

    const exporting = seq("EXPORTING", ParameterListS);

    const from = altPrio(seq("TYPE", ClassName),
                         altPrio(vers(Version.v752, Source), BasicSource));

    const clas = seq(optPrios("RESUMABLE"),
                     "EXCEPTION",
                     from,
                     opt(alt(vers(Version.v750, alt(mess, messid)), vers(Version.v752, "USING MESSAGE"))),
                     optPrios(exporting));

    const ret = seq("RAISE", altPrio(clas, Field));

    return ret;
  }

}