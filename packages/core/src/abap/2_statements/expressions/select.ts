import {seqs, per, opt, alts, tok, str, star, Expression, altPrios, optPrio, ver} from "../combi";
import {WParenLeftW, WParenLeft} from "../../1_lexer/tokens";
import {SQLTarget, SQLFieldList, SQLFrom, SQLCond, SQLSource, DatabaseConnection, SQLTargetTable, SQLOrderBy, SQLHaving, SQLForAllEntries} from ".";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";
import {SQLGroupBy} from "./sql_group_by";

export class Select extends Expression {
  public getRunnable(): IStatementRunnable {

    const intoList = seqs(alts(tok(WParenLeft), tok(WParenLeftW)),
                          star(seqs(SQLTarget, ",")),
                          SQLTarget,
                          ")");
    const intoSimple = seqs(opt(str("CORRESPONDING FIELDS OF")),
                            SQLTarget);

    const into = alts(seqs("INTO", alts(intoList, intoSimple)), SQLTargetTable);

    const where = seqs("WHERE", SQLCond);

    const up = seqs("UP TO", SQLSource, "ROWS");
    const offset = ver(Version.v751, seqs("OFFSET", SQLSource));

    const client = str("CLIENT SPECIFIED");
    const bypass = str("BYPASSING BUFFER");

    const fields = seqs("FIELDS", SQLFieldList);

    const perm = per(new SQLFrom(), into, new SQLForAllEntries(), where,
                     new SQLOrderBy(), up, offset, client, new SQLHaving(), bypass, new SQLGroupBy(), fields, new DatabaseConnection());

    const ret = seqs("SELECT",
                     altPrios("DISTINCT", optPrio(seqs("SINGLE", optPrio(str("FOR UPDATE"))))),
                     opt(new SQLFieldList()),
                     perm);

    return ret;
  }
}