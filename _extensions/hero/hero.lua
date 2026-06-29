-- Hero filter.
--
-- Automatically injects the page hero at the top of the document body whenever the
-- document's YAML front matter contains a `hero` key.
--
--     ---
--     hero:
--       breadcrumbs:
--         - text: "Features"
--           link: "/features"
--         - "Display Support"
--       title: "Any screen. Any venue."
--       image: "/assets/image.webp"
--       badge: "Some badge text"
--       action:
--         text: "Join the Slack"
--         link: "http://example.org"
--       lede: "From a personal laptop to a 30-meter planetarium dome ..."
--     ---
--
-- `breadcrumbs`, `title`, and `lede` are required. `image`, `badge`, and `action` are
-- optional.

-- Render the hero section from the `hero` metadata table. Returns an HTML string, or nil
-- plus an error message when a required field is missing.
local function render_hero(hero_meta)
  local title = hero_meta["title"]
  if title == nil then
    return nil, "Missing parameter 'title' in the 'hero' frontmatter"
  end
  title = pandoc.utils.stringify(title)


  local breadcrumbs = hero_meta["breadcrumbs"]
  if breadcrumbs == nil then
    return nil, "Missing parameter 'breadcrumbs' in the 'hero' frontmatter"
  end


  local crumbs = {}
  for _, crumb in ipairs(breadcrumbs) do
    local link = nil
    local text
    -- A breadcrumb may be a table carrying a `text` label and an optional `link`,
    -- or a plain string that is used as the label directly
    if type(crumb) == "table" and crumb["text"] ~= nil then
      text = pandoc.utils.stringify(crumb["text"])
      if crumb["link"] ~= nil then
        link = pandoc.utils.stringify(crumb["link"])
      end
    else
      text = pandoc.utils.stringify(crumb)
    end
    crumbs[#crumbs + 1] = { text = text, link = link }
  end


  local image = hero_meta["image"]
  if image ~= nil then
    image = pandoc.utils.stringify(image)
  end


  local badge = hero_meta["badge"]
  if badge ~= nil then
    badge = pandoc.utils.stringify(badge)
  end


  local lede = hero_meta["lede"]
  if lede == nil then
    return nil, "Missing parameter 'lede' in the 'hero' frontmatter"
  end
  lede = pandoc.utils.stringify(lede)


  -- The optional `action` renders a call-to-action button after the lede. It is a table
  -- with `text` and `link` fields.
  local action = hero_meta["action"]
  local action_text = nil
  local action_link = nil
  if action ~= nil then
    if action["text"] ~= nil then
      action_text = pandoc.utils.stringify(action["text"])
    end
    if action["link"] ~= nil then
      action_link = pandoc.utils.stringify(action["link"])
    end
  end

  local crumb_parts = {}
  for index, crumb in ipairs(crumbs) do
    if index > 1 then
      crumb_parts[#crumb_parts + 1] = '<span class="bc-sep">›</span>'
    end
    local class = (index == #crumbs) and "bc-current" or "bc-parent"
    if crumb.link ~= nil then
      crumb_parts[#crumb_parts + 1] =
        '<a class="' .. class .. '" href="' .. crumb.link .. '">' .. crumb.text .. '</a>'
    else
      crumb_parts[#crumb_parts + 1] =
        '<span class="' .. class .. '">' .. crumb.text .. '</span>'
    end
  end
  local breadcrumb_html = table.concat(crumb_parts, "\n    ")

  local badge_html = ""
  if badge ~= nil then
    badge_html = [[<span class="hero-badge">]] .. badge .. [[</span>]]
  end

  local action_html = ""
  if action_text ~= nil and action_link ~= nil then
    action_html = [[
    <div class="hero-actions">
      <a class="btn-primary-os" href="]] .. action_link .. [[" target="_blank" rel="noopener">]] .. action_text .. [[</a>
    </div>]]
  end

  local style = ""
  if image ~= nil then
    style = [[style="background-image: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(']] .. image .. [['); background-size: cover; background-position: center;"]]
  end

  return [[
<section class="hero" ]] .. style .. [[>
  <nav class="page-breadcrumb" aria-label="Breadcrumb">
    ]] .. breadcrumb_html .. [[
  </nav>
  <div>
  ]] .. badge_html .. [[
    <h1>]] .. title .. [[</h1>
    <p class="hero-lede">]] .. lede .. [[</p>]] .. action_html .. [[
  </div>
</section>]]
end

return {
  {
    Pandoc = function(doc)
      local hero_meta = doc.meta and doc.meta["hero"] or nil
      if hero_meta == nil then
        return doc
      end

      local html, err = render_hero(hero_meta)
      if html == nil then
        quarto.log.error("[hero] " .. err)
        return doc
      end

      table.insert(doc.blocks, 1, pandoc.RawBlock("html", html))
      return doc
    end
  }
}
