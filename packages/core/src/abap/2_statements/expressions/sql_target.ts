import {alts, seqs, vers, tok, Expression} from "../combi";
import {Version} from "../../../version";
import {WAt, At} from "../../1_lexer/tokens";
import {Target} from ".";
import {IStatementRunnable} from "../statement_runnable";

export class SQLTarget extends Expression {
  public getRunnable(): IStatementRunnable {
    const at = vers(Version.v740sp05, seqs(alts(tok(WAt), tok(At)), Target));

    return alts(Target, at);
  }
}