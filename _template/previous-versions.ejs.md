<%
// Previous Versions table. The whole table is built as one string so the control-flow
// tags don't emit stray newlines that would break the markdown table.
//
// Note: Quarto's listing templates use lodash's template(), not EJS — so
// `<%#` comments are not supported, and `<%=` is raw output while `<%-`
// HTML-escapes (the opposite of EJS). Use `<%=` for anything containing
// markup like <br>.
let rows = '';
for (const release of items) {
  let cell = '';
  let first = true;
  let prevPlatform = null;
  for (const d of release.downloads) {
    if (d.platform && d.platform !== prevPlatform) {
      if (!first) cell += '<br>';
      cell += '[' + d.platform + ']{.page-previous-versions__platform} ';
    } else if (!first) {
      cell += ' · ';
    }
    cell += '[' + d.label + '](' + d.url + ')';
    first = false;
    prevPlatform = d.platform || prevPlatform;
  }
  rows += '| v' + release.version + ' | ' + release.released + ' | ' + cell +
    ' | [GitHub](' + release.notes + '){target="_blank" rel="noopener"} |\n';
}
const oldest = items[items.length - 1];
%>
| Version | Released | Downloads | Release notes |
| :------ | :------- | :-------- | :------------ |
<%= rows %>
::: {.page-previous-versions__older}
For versions older than v<%= oldest.version %>, visit the [GitHub releases page](https://github.com/OpenSpace/OpenSpace/releases){target="_blank" rel="noopener"} or the [direct download page](https://liu-se.cdn.openspaceproject.com/releases){target="_blank" rel="noopener"}.
:::
