/* eslint-disable @typescript-eslint/explicit-member-accessibility */
const languages = {};
const currentLanguage = "abap";

function focusFilter() {
  document.getElementById("filter").select();
}

function searchChanged() {
  const v = document.getElementById("filter").value;
  renderRight(v);
  let newUrl = window.location.pathname;
  if (v !== "") {
    newUrl = newUrl + "?filter=" + v;
  }
  window.history.replaceState(null, document.title, newUrl);
}

function languageChanged(v) {
  console.dir(v);
}

function setFilter(filter) {
  document.getElementById("filter").value = filter;
  renderRight(filter);
}

function renderSidenavList(list) {
  let html = "";
  for(const i of list) {
    html = html + "<a href=\"javascript:setFilter('" + i.name + "');\">" + i.name + "</a><br>";
  }

  return html;
}

function renderLeft() {
  document.getElementById("sidenav_statements").innerHTML = renderSidenavList(languages[currentLanguage].statements);
  document.getElementById("sidenav_expressions").innerHTML = renderSidenavList(languages[currentLanguage].expressions);
  document.getElementById("sidenav_structures").innerHTML = renderSidenavList(languages[currentLanguage].structures);
}

function renderList(filter, list) {
  let ret = "";
  for(const i of list) {
    if (!filter || i.name.toLowerCase().includes(filter.toLowerCase())) {
      ret = ret + "<div style=\"page-break-inside:avoid;\">" +
        "<u>" + i.name + "</u><br>" +
        "<a href=\"#/" + i.type + "/" + i.name + "\"><img src=\"abap/" + i.type + "_" + i.name + ".svg\"></a></div><br>";
    }
  }
  return ret;
}

function renderRight(filter) {
  let html = "";

  const statements = renderList(filter, languages[currentLanguage].statements);
  if (statements !== "") {
    html = "<div style=\"page-break-before: always;\"><h1>Statements</h1>" + statements + "</div>";
  }

  const expressions = renderList(filter, languages[currentLanguage].expressions);
  if (expressions !== "") {
    html = html + "<div style=\"page-break-before: always;\"><h1>Expressions</h1>" + expressions + "</div>";
  }

  const structures = renderList(filter, languages[currentLanguage].structures);
  if (structures !== "") {
    html = html + "<div style=\"page-break-before: always;\"><h1>Structures</h1>" + structures + "</div>";
  }

  document.getElementById("main").innerHTML = html;
}

function renderSyntax(type, name) {
  // lookup
  let found = {};
  let prev = {};
  let next = {};
  const list = languages[currentLanguage][type + "s"];
  for(let index = 0; index < list.length; index++) {
    if (list[index].name === name) {
      found = list[index];
      prev = list[index - 1];
      next = list[index + 1];
      break;
    }
  }
  if (found.using === undefined) {
    document.getElementById("body").innerHTML = "404";
    return;
  }

  let html = "<h1>" + type + ": " + name + "</h1>\n";

  html = html + "<a href=\"#\">Home</a><br>\n";
  if (prev) {
    html = html + "<b>Prev</b>: <a href=\"#/" + type + "/" + prev.name + "\">" + prev.name + "</a><br>\n";
  }
  if (next) {
    html = html + "<b>Next</b>: <a href=\"#/" + type + "/" + next.name + "\">" + next.name + "</a><br>\n";
  }

// html = html + "<a href=\"https://github.com/abaplint/abaplint/blob/master/src/packages/core/abap/" +
// found.type + "s/" + found.filename + "\">Source</a><br>";

  const use = found.using.map((e) => { return "<a href=\"#/" + e + "\">" + e + "</a>"; });
  const by = found.used_by.map((e) => { return "<a href=\"#/" + e + "\">" + e + "</a>"; });

  html = html + found.svg + "<br>\n" +
    "<b>Using</b>: " + use.join(", ") + "<br>\n" +
    "<b>Used by</b>: " + by.join(", ") + "<br>\n";

  document.getElementById("body").innerHTML = html;
}

class Router {
  static popstate() {
    if(window.location.hash === "") {
      renderMain();
    } else {
      const split = window.location.hash.split("/");
      renderSyntax(split[1], split[2]);
    }
  }
}

function onRightClick() {
  document.getElementById("filter").value = "";
  searchChanged();
  window.event.returnValue = false;
}

function renderMain() {
  let filter = new URL(window.location).searchParams.get("filter");
  if (filter === null) {
    filter = "";
  }

  document.getElementById("body").innerHTML =
    "<div>\n" +
    "<div id=\"mySidenav\" class=\"sidenav sidenav-print\">\n" +
    "<h3>abaplint syntax diagrams</h3>\n" +
    `Language:
    <select id="language" oninput=\"javascript:languageChanged(this.value);\">
    <option value="abap">abap</option>
    <option value="ddl">ddl</option>
    <option value="cds">cds</option>
    </select>
    ` +
    "<input type=\"text\" id=\"filter\" oninput=\"javascript:searchChanged();\" onfocus=\"javascript:focusFilter()\" oncontextmenu=\"javascript:onRightClick();\" value=\"" + filter + "\"></input><br>\n" +
    "<br>\n" +
    "<b>Statements</b><br>\n" +
    "<div id=\"sidenav_statements\">Loading</div>\n" +
    "<br>\n" +
    "<b>Expressions</b><br>\n" +
    "<div id=\"sidenav_expressions\">Loading</div>\n" +
    "<br>\n" +
    "<b>Structures</b><br>\n" +
    "<div id=\"sidenav_structures\">Loading</div>\n" +
    "</div>\n" +
    "<div id=\"main\" class=\"main main-print\">Loading</div>";

  document.getElementById("filter").focus();
  renderLeft();
  searchChanged();
}

function run() {
  window.onpopstate = Router.popstate;
  languages["abap"] = abapData;
  languages["ddl"] = ddlData;
  languages["cds"] = cdsData;
  Router.popstate();
}

run();