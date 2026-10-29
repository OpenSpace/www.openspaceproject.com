-- Release version filter.
--
-- Replaces every `%RELEASE_VERSION%` placeholder with the current release
-- version from the `release.version` metadata (see _release.yml). The
-- placeholder may appear in page content (text and link targets) as well as
-- in frontmatter (pagetitle, description, hero crumbs, ...), so this filter
-- walks both the document body and the metadata tree.
--
-- The placeholder uses `%` delimiters because other obvious choices are
-- mangled by pandoc's markdown reader before this filter runs: `__text__`
-- becomes bold emphasis and `@key@` becomes a citation. `%` is inert in
-- markdown, and the placeholder only ever exists in source files (it is
-- replaced before HTML output), so its appearance in URLs is harmless.
--
-- This filter runs for all output formats (including the llms.txt markdown
-- pages, where the real version should appear in titles and descriptions).
-- The companion `release-html` filter (HTML output only) additionally exposes
-- the version to client-side code via `window.__RELEASE_VERSION__`.

-- As a Lua pattern, each `%` must be doubled (it is the pattern escape char).
local PLACEHOLDER = "%%RELEASE_VERSION%%"
local PLACEHOLDER_TEXT = "%RELEASE_VERSION%"

local version = nil

local function gsub_str(s)
  if type(s) ~= "string" then
    return s
  end
  return (s:gsub(PLACEHOLDER, version))
end

-- Recursively replace the placeholder in every place it can occur: text,
-- link/image targets, raw HTML, and metadata values.
--
-- Shapes to handle (verified against Quarto's bundled pandoc):
--   * AST elements are userdata with a `.t` field (Str, Link, Para, ...)
--   * metadata inlines (pagetitle, description, ...) are plain Lua arrays
--     of inline elements (a table with numeric keys and no `.t`)
--   * nested metadata is a plain map (a table with string keys)
--   * metadata also contains plain scalars (booleans, numbers, strings)
local function walk(el)
  local et = type(el)
  if et == "userdata" then
    local t = el.t
    if t == "Str" or t == "Text" or t == "RawInline" or t == "RawBlock" then
      el.text = gsub_str(el.text)
    elseif t == "Link" or t == "Image" then
      el.target = gsub_str(el.target)
    end
    for _, field in ipairs({ "blocks", "inlines", "content", "c", "caption" }) do
      local f = el[field]
      if type(f) == "table" then
        walk(f)
      end
    end
    return
  elseif et == "table" then
    local is_array = true
    for k in pairs(el) do
      if type(k) ~= "number" then
        is_array = false
        break
      end
    end
    if is_array then
      for _, v in ipairs(el) do
        walk(v)
      end
    else
      for k, v in pairs(el) do
        if type(v) == "string" then
          el[k] = gsub_str(v)
        else
          walk(v)
        end
      end
    end
  end
end

return {
  {
    Pandoc = function(doc)
      local release = doc.meta and doc.meta["release"]
      version = release and pandoc.utils.stringify(release["version"])
      if version == nil or version == "" then
        quarto.log.warning(
          "[release] No release.version metadata found (see _release.yml); "
          .. PLACEHOLDER_TEXT .. " placeholders are left as-is"
        )
        return doc
      end

      walk(doc)
      if type(doc.meta) == "table" then
        for _, v in pairs(doc.meta) do
          walk(v)
        end
      end
      return doc
    end
  }
}
