import {ABAPFile} from "../files";
import {Unknown, Empty} from "./statements/_statement";
import {Structure} from "./structures/_structure";
import * as Structures from "./structures/";
import {Issue} from "../issue";
import {Comment as StatementComment} from "./statements/_statement";
import {StructureNode} from "./node";

export default class StructureParser {

  public static run(file: ABAPFile): {issues: Array<Issue>, node: StructureNode} {
    const structure = this.findStructureForFile(file.getFilename());
    let statements = file.getStatements().slice().filter((s) => { return !(s instanceof StatementComment || s instanceof Empty); });
    const unknowns = file.getStatements().slice().filter((s) => { return s instanceof Unknown; });
    if (unknowns.length > 0) {
// do not parse structure, file contains unknown statements(parser errors)
      return {issues: [], node: undefined};
    }

    return structure.runFile(file, statements);
  }

  private static findStructureForFile(filename: string): Structure {
// todo, not sure this is the right place for this logic
    if (filename.match(/\.clas\.abap$/)) {
      return new Structures.ClassGlobal();
    } else if (filename.match(/\.intf\.abap$/)) {
      return new Structures.Interface();
    } else {
// todo
      return new Structures.Any();
    }
  }

}