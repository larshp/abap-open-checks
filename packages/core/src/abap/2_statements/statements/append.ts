import {IStatement} from "./_statement";
import {opt, alt, seq, altPrio, optPrios, vers} from "../combi";
import {Version} from "../../../version";
import {FSTarget, Target, Field, Source, SimpleSource} from "../expressions";
import {IStatementRunnable} from "../statement_runnable";

export class Append implements IStatement {

  public getMatcher(): IStatementRunnable {
    const assigning = seq("ASSIGNING", FSTarget);
    const reference = seq("REFERENCE INTO", Target);
    const sorted = seq("SORTED BY", Field);

    const range = seq(optPrios(seq("FROM", Source)),
                      optPrios(seq("TO", Source)));

    const src = alt(vers(Version.v740sp02, Source), SimpleSource);

    return seq("APPEND",
               altPrio("INITIAL LINE", seq(optPrios("LINES OF"), src)),
               opt(range),
               optPrios(seq("TO", Target)),
               opt(altPrio(assigning, reference)),
               optPrios("CASTING"),
               optPrios(sorted));
  }

}