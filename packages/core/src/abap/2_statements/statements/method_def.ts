import {Version} from "../../../version";
import {IStatement} from "./_statement";
import {seq, alt, altPrio, vers, regex as reg, plusPrios, optPrios} from "../combi";
import {MethodDefChanging, MethodDefReturning, Redefinition, MethodName, MethodDefExporting, MethodDefImporting, EventHandler, Abstract, MethodDefRaising, NamespaceSimpleName} from "../expressions";
import {IStatementRunnable} from "../statement_runnable";

export class MethodDef implements IStatement {

  public getMatcher(): IStatementRunnable {

    const exceptions = seq("EXCEPTIONS", plusPrios(NamespaceSimpleName));

    const def = vers(Version.v740sp08, seq("DEFAULT", altPrio("FAIL", "IGNORE")));

    const parameters = seq(optPrios(altPrio(seq(Abstract, optPrios("FOR TESTING")), "FINAL", "FOR TESTING", def)),
                           optPrios(MethodDefImporting),
                           optPrios(MethodDefExporting),
                           optPrios(MethodDefChanging),
                           optPrios(MethodDefReturning),
                           optPrios(alt(MethodDefRaising, exceptions)));

// todo, this is only from version something
    const tableFunction = seq("FOR TABLE FUNCTION", reg(/^\w+?$/));

    const ret = seq(altPrio("CLASS-METHODS", "METHODS"),
                    MethodName,
                    alt(seq(optPrios(Abstract), EventHandler),
                        parameters,
                        tableFunction,
                        "NOT AT END OF MODE",
                        optPrios(Redefinition)));

    return ret;
  }

}