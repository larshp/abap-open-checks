import {IStatement} from "./_statement";
import {seqs, alts, pers, opts, vers} from "../combi";
import * as Expressions from "../expressions";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";

export class Type implements IStatement {

  public getMatcher(): IStatementRunnable {
    const simple = pers(Expressions.Type, Expressions.Decimals, Expressions.Length);

    const def = seqs(Expressions.NamespaceSimpleName,
                     opts(Expressions.ConstantFieldLength),
                     opts(alts(simple, Expressions.TypeTable)));

// todo, BOXED is only allowed with structures inside structures?
    const boxed = vers(Version.v702, "BOXED");

    const ret = seqs("TYPES", def, opts(boxed));

    return ret;
  }

}