import {alts, tok, seqs, Expression, vers, opts, pluss} from "../combi";
import {Version} from "../../../version";
import {TypeNameOrInfer, Source, ParameterListS} from ".";
import {ParenLeftW, WParenLeftW, WParenRightW, WParenRight} from "../../1_lexer/tokens";
import {IStatementRunnable} from "../statement_runnable";

export class NewObject extends Expression {
  public getRunnable(): IStatementRunnable {
    const lines = pluss(seqs(tok(WParenLeftW), Source, tok(WParenRightW)));

    const rparen = alts(tok(WParenRightW), tok(WParenRight));

    const neww = seqs("NEW",
                      TypeNameOrInfer,
                      tok(ParenLeftW),
                      opts(alts(Source, ParameterListS, lines)),
                      rparen);

    return vers(Version.v740sp02, neww);
  }
}