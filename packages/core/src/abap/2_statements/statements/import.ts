import {IStatement} from "./_statement";
import {verNot, str, seqs, opt, alt, regex, per, plus, tok} from "../combi";
import {ParenLeft, ParenRightW} from "../../1_lexer/tokens";
import {Target, Source, Dynamic, ComponentChainSimple, NamespaceSimpleName, FieldSymbol} from "../expressions";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";

export class Import implements IStatement {

  public getMatcher(): IStatementRunnable {
    const dto = seqs("TO", Target);
    const client = seqs("CLIENT", Source);
    const id = seqs("ID", Source);
    const using = seqs("USING", Source);

    const cluster = seqs(NamespaceSimpleName,
                         tok(ParenLeft),
                         regex(/^[\w$%\^]{2}$/),
                         tok(ParenRightW));

    const buffer = seqs("DATA BUFFER", Source);
    const memory = seqs("MEMORY ID", Source);
    const table = seqs("INTERNAL TABLE", Source);
    const shared = seqs(alt(str("SHARED MEMORY"), str("SHARED BUFFER")), cluster, per(dto, client, id));
    const database = seqs("DATABASE", cluster, per(dto, client, id, using));

    const source = alt(buffer, memory, database, table, shared);

    const to = plus(seqs(ComponentChainSimple,
                         alt(str("TO"), str("INTO")),
                         Target));

    const toeq = plus(seqs(alt(new ComponentChainSimple(), new FieldSymbol()),
                           "=",
                           Target));

    const target = alt(toeq,
                       to,
                       new Dynamic(),
                       plus(new Target()));

    const options = per(str("ACCEPTING PADDING"),
                        str("IGNORING CONVERSION ERRORS"),
                        str("IN CHAR-TO-HEX MODE"),
                        str("IGNORING STRUCTURE BOUNDARIES"),
                        str("ACCEPTING TRUNCATION"),
                        seqs("REPLACEMENT CHARACTER", Source),
                        seqs("CODE PAGE INTO", Source),
                        seqs("ENDIAN INTO", Source));

    const ret = seqs("IMPORT", target, "FROM", source, opt(options));

    return verNot(Version.Cloud, ret);
  }

}
