import {seq, opt, alt, vers, pers, Expression, altPrio, pluss, plusPrios, optPrios} from "../combi";
import {Constant, FieldSub, TypeName, Integer, Field} from ".";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";
import {FieldChain} from "./field_chain";

export class TypeTable extends Expression {
  public getRunnable(): IStatementRunnable {
    const header = "WITH HEADER LINE";
    const initial = seq("INITIAL SIZE", Constant);

    const uniqueness = alt("NON-UNIQUE", "UNIQUE");
    const defaultKey = "DEFAULT KEY";
    const emptyKey = vers(Version.v740sp02, "EMPTY KEY");

    const key = seq("WITH",
                    opt(uniqueness),
                    altPrio(defaultKey, emptyKey,
                            seq(opt(alt("SORTED", "HASHED")),
                                "KEY",
                                alt(seq(Field, "COMPONENTS", pluss(FieldSub)),
                                    pluss(FieldSub)))));

    const normal1 = seq(opt(alt("STANDARD", "HASHED", "INDEX", "SORTED", "ANY")),
                        "TABLE",
                        opt("OF"),
                        opt("REF TO"),
                        opt(TypeName));

    const likeType = seq(opt(alt("STANDARD", "HASHED", "INDEX", "SORTED", "ANY")),
                         "TABLE OF",
                         optPrios("REF TO"),
                         opt(FieldChain),
                         opt(key),
                         opt(header));

    const range = seq("RANGE OF", TypeName);

    const typetable = seq(alt(normal1, range),
                          opt(pers(header, initial, plusPrios(key))));

    const occurs = seq("OCCURS", Integer);

    const old = seq(TypeName,
                    alt(seq(occurs, opt(header)), header));

    const ret = altPrio(
      seq("LIKE", alt(likeType, range)),
      seq("TYPE", alt(old, typetable)));

    return ret;
  }

}
