import {tok, ver, seqs, starPrios, altPrios, Expression, optPrios} from "../combi";
import * as Tokens from "../../1_lexer/tokens";
import {Version} from "../../../version";
import {Source, StringTemplateFormatting} from ".";
import {IStatementRunnable} from "../statement_runnable";

export class StringTemplate extends Expression {
  public getRunnable(): IStatementRunnable {

    const nest = seqs(tok(Tokens.StringTemplateBegin),
                      Source,
                      optPrios(StringTemplateFormatting),
                      starPrios(seqs(tok(Tokens.StringTemplateMiddle), Source, optPrios(StringTemplateFormatting))),
                      tok(Tokens.StringTemplateEnd));

    return ver(Version.v702, altPrios(nest, tok(Tokens.StringTemplate)));
  }
}