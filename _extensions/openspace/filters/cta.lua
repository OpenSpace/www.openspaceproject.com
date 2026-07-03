-- CTA filter.
--
-- Automatically appends a call-to-action section to the bottom of the document body
-- whenever the document's YAML front matter contains a `cta` key.
--
--     ---
--     cta:
--       heading: "Get involved"
--       lede: "OpenSpace is built in the open by a community ..."
--       actions:
--         - text: "View on GitHub"
--           link: "https://github.com/OpenSpace/OpenSpace"
--           style: "primary"
--           external: true
--         - text: "Get in touch"
--           link: "/community/contact.qmd"
--           style: "ghost"
--     ---
--
-- `heading` and `lede` are required. `actions` is an optional list of buttons. Each
-- button requires `text` and `link`; `style` is either "primary" (default) or "ghost",
-- and `external` (boolean) opens the link in a new tab.

-- Render the CTA section from the `cta` metadata table. Returns an HTML string, or nil
-- plus an error message when a required field is missing.
local function render_cta(cta_meta)
  local heading = cta_meta["heading"]
  if heading == nil then
    return nil, "Missing parameter 'heading' in the 'cta' frontmatter"
  end
  heading = pandoc.utils.stringify(heading)

  local lede = cta_meta["lede"]
  if lede == nil then
    return nil, "Missing parameter 'lede' in the 'cta' frontmatter"
  end
  lede = pandoc.utils.stringify(lede)

  -- The optional `actions` list renders one button per entry.
  local actions = cta_meta["actions"]
  local action_parts = {}
  if actions ~= nil then
    for _, action in ipairs(actions) do
      local text = action["text"]
      if text == nil then
        return nil, "Missing parameter 'text' in the 'cta.actions' frontmatter"
      end
      text = pandoc.utils.stringify(text)

      local link = action["link"]
      if link == nil then
        return nil, "Missing parameter 'link' in the 'cta.actions' frontmatter"
      end
      link = pandoc.utils.stringify(link)

      local style = "primary"
      if action["style"] ~= nil then
        style = pandoc.utils.stringify(action["style"])
      end
      local class = (style == "ghost") and "button__secondary" or "button__primary"

      local target = ""
      if action["external"] == true then
        class = class .. ' external'
      end

      action_parts[#action_parts + 1] =
        '<a class="' .. class .. '" href="' .. link .. '"' .. target .. '>' .. text .. '</a>'
    end
  end

  local actions_html = ""
  if #action_parts > 0 then
    actions_html = [[
    <div class="cta__actions">
      ]] .. table.concat(action_parts, "\n      ") .. [[
    </div>]]
  end

  return [[
<section class="section__cta">
  <div class="cta__card">
    <h2>]] .. heading .. [[</h2>
    <p>]] .. lede .. [[</p>]] .. actions_html .. [[
  </div>
</section>]]
end

return {
  {
    Pandoc = function(doc)
      local cta_meta = doc.meta and doc.meta["cta"] or nil
      if cta_meta == nil then
        return doc
      end

      local html, err = render_cta(cta_meta)
      if html == nil then
        quarto.log.error("[cta] " .. err)
        return doc
      end

      table.insert(doc.blocks, pandoc.RawBlock("html", html))
      return doc
    end
  }
}
