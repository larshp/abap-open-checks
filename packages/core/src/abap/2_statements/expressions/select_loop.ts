import {seqs, pers, opts, alts, tok, vers, stars, Expression, optPrios} from "../combi";
import {WParenLeftW, WParenLeft} from "../../1_lexer/tokens";
import {SQLSource, SQLFrom, DatabaseTable, Dynamic, SQLCond, SQLFieldName, SQLAggregation, SQLTargetTable, SQLGroupBy, SQLForAllEntries} from ".";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";
import {SQLOrderBy} from "./sql_order_by";
import {SQLHaving} from "./sql_having";
import {SQLTarget} from "./sql_target";

export class SelectLoop extends Expression {
  public getRunnable(): IStatementRunnable {

    const intoList = seqs(alts(tok(WParenLeft), tok(WParenLeftW)),
                          stars(seqs(SQLTarget, ",")),
                          SQLTarget,
                          ")");
    const intoSimple = seqs(opts("CORRESPONDING FIELDS OF"), SQLTarget);

    const into = seqs("INTO", alts(intoList, intoSimple));

    const where = seqs("WHERE", SQLCond);

    const comma = opts(vers(Version.v740sp05, ","));
    const someField = seqs(alts(SQLFieldName, SQLAggregation), comma);
    const fieldList = seqs(stars(someField), SQLFieldName, comma, stars(someField));

// todo, use SQLFieldList instead?
    const fields = alts("*", Dynamic, fieldList);

    const client = "CLIENT SPECIFIED";
    const bypass = "BYPASSING BUFFER";

    const up = seqs("UP TO", SQLSource, "ROWS");

    const pack = seqs("PACKAGE SIZE", SQLSource);

    const from2 = seqs("FROM", DatabaseTable);

    const tab = seqs(SQLTargetTable, alts(pack, seqs(from2, pack), seqs(pack, from2)));

    const perm = pers(SQLFrom,
                      where,
                      up,
                      SQLOrderBy,
                      SQLHaving,
                      client,
                      bypass,
                      SQLGroupBy,
                      SQLForAllEntries,
                      alts(tab, into));

    const ret = seqs("SELECT",
                     optPrios("DISTINCT"),
                     fields,
                     perm);

    return ret;
  }
}