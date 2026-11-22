-- Release version (HTML) filter.
--
-- Appends a script at the end of the document body that exposes the release
-- version to client-side code: the footer's "Version X" link reads
-- `window.__RELEASE_VERSION__` (see _template/footer.html and
-- assets/js/footer.js).
--
-- Registered under `format: html: filters` only, so the script tag does not
-- leak into the llms.txt markdown output.

return {
  {
    Pandoc = function(doc)
      local release = doc.meta and doc.meta["release"]
      local version = release and pandoc.utils.stringify(release["version"])
      if version == nil or version == "" then
        return doc
      end
      table.insert(doc.blocks, pandoc.RawBlock(
        "html",
        '<script>window.__RELEASE_VERSION__ = "' .. version .. '";</script>'
      ))
      return doc
    end
  }
}
