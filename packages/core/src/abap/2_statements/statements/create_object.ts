import {IStatement} from "./_statement";
import {seqs, optPrio, altPrios, per} from "../combi";
import {Target, ParameterListS, ParameterListExceptions, Source, ClassName, Dynamic} from "../expressions";
import {IStatementRunnable} from "../statement_runnable";

export class CreateObject implements IStatement {

  public getMatcher(): IStatementRunnable {
    const exporting = seqs("EXPORTING", ParameterListS);
    const exceptions = seqs("EXCEPTIONS", ParameterListExceptions);
    const table = seqs("PARAMETER-TABLE", Source);
    const area = seqs("AREA HANDLE", Source);
    const type = seqs("TYPE", altPrios(ClassName, Dynamic));

    const ret = seqs("CREATE OBJECT",
                     Target,
                     optPrio(per(type, area)),
                     optPrio(altPrios(exporting, table)),
                     optPrio(exceptions));

    return ret;
  }

}