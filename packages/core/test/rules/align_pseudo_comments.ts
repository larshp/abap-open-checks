import {expect} from "chai";
import {MemoryFile} from "../../src/files/memory_file";
import {Registry} from "../../src/registry";
import {AlignPseudoComments} from "../../src/rules";
import {Issue} from "../../src/issue";
import {testRuleFixSingle} from "./_utils";

function testFix(input: string, expected: string, noIssuesAfter = true) {
  testRuleFixSingle(input, expected, new AlignPseudoComments(), undefined, undefined, noIssuesAfter);
}

async function findIssues(abap: string): Promise<readonly Issue[]> {
  const reg = new Registry().addFile(new MemoryFile("zfoo.prog.abap", abap));
  await reg.parseAsync();
  const rule = new AlignPseudoComments();
  return rule.initialize(reg).run(reg.getFirstObject()!);
}

describe("Rule: align_pseudo_comments", () => {

  it("parser error, no issues expected", async () => {
    const issues = await findIssues("hello world.");
    expect(issues.length).to.equal(0);
  });

  it("ok1", async () => {
    const issues = await findIssues(`WRITE 'sdf'.                                                "#EC sdf`);
    expect(issues.length).to.equal(0);
  });

  it("ok2", async () => {
    const issues = await findIssues(`WRITE 'sdf'.                                                "#EC sdfaaa`);
    expect(issues.length).to.equal(0);
  });

  it("ok3", async () => {
    const issues = await findIssues(`WRITE 'sdf'.                                    "#EC sdfsdfsdfsdfsdfsdf`);
    expect(issues.length).to.equal(0);
  });

  it("err1, fix insert spaces", async () => {
    const input = `WRITE 'sdf'. "#EC sdf`;
    const expected = `WRITE 'sdf'.                                                "#EC sdf`;
    testFix(input, expected);
  });

  it("err1, fix removes spaces", async () => {
    const input = `WRITE 'sdf'.                                                               "#EC sdf`;
    const expected = `WRITE 'sdf'.                                                "#EC sdf`;
    testFix(input, expected);
  });

  it("err2", async () => {
    const issues = await findIssues(`WRITE 'sdf'.            "#EC sdf`);
    expect(issues.length).to.equal(1);
  });

  it("ok, long", async () => {
    const issues = await findIssues(`WRITE 'ssdfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffdf'. "#EC sdf`);
    expect(issues.length).to.equal(0);
  });

  it("ok, select, nested", async () => {
    const issues = await findIssues(`
IF sy-subrc = 0.
  IF sy-subrc = 0.
    IF sy-subrc = 0.
      SELECT SINGLE time_zone FROM adrc INTO @DATA(lv_time_zone)
        WHERE addrnumber = @lv_adrnr
        AND nation = '' ##SUBRC_OK.                     "#EC CI_NOORDER
    ENDIF.
  ENDIF.
ENDIF.`);
    expect(issues.length).to.equal(0);
  });

  it("ok, select", async () => {
    const issues = await findIssues(`
SELECT SINGLE time_zone FROM adrc INTO @DATA(lv_time_zone)
  WHERE addrnumber = @lv_adrnr
  AND nation = '' ##SUBRC_OK.                           "#EC CI_NOORDER`);
    expect(issues.length).to.equal(0);
  });

  it("ok, method parameter", async () => {
    const issues = await findIssues(`
    "! Test comment 1
    METHODS test_method_1 ABSTRACT
      RETURNING VALUE(result) TYPE zsometype.

    "! Test comment 2
    METHODS test_method_2
      RETURNING VALUE(result) TYPE zverylongclassname=>verylongtypenamelongerthan71 "#EC NEEDED
      RAISING   zcx_exception.`);
    expect(issues.length).to.equal(0);
  });
});
