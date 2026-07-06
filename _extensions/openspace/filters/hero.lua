-- Hero filter.
--
-- Automatically injects the page hero at the top of the document body whenever the
-- document's YAML front matter contains a `hero` key.
--
--     ---
--     hero:
--       crumbs:
--         - text: "Features"
--           link: "/features"
--         - "Display Support"
--       title: "Any screen. Any venue."
--       image: "/assets/image.webp"
--       badge: "Some badge text"
--       action:
--         text: "Join the Slack"
--         link: "http://example.org"
--         external: true
--       lede: "From a personal laptop to a 30-meter planetarium dome ..."
--     ---
--
-- `crumbs`, `title`, and `lede` are required. `image`, `badge`, and `action` are
-- optional.

-- Render the hero section from the `hero` metadata table. Returns an HTML string, or nil
-- plus an error message when a required field is missing.
local function render_hero(hero_meta)
  local title = hero_meta["title"]
  if title == nil then
    return nil, "Missing parameter 'title' in the 'hero' frontmatter"
  end
  title = pandoc.utils.stringify(title)


  local crumbs_meta = hero_meta["crumbs"]
  if crumbs_meta == nil then
    return nil, "Missing parameter 'crumbs' in the 'hero' frontmatter"
  end


  local crumbs = {}
  for _, crumb in ipairs(crumbs_meta) do
    local link = nil
    local text
    -- A breadcrumb may be a table carrying a `text` label and an optional `link`, or a
    -- plain string that is used as the label directly
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
  local action_external = ""
  if action ~= nil then
    if action["text"] ~= nil then
      action_text = pandoc.utils.stringify(action["text"])
    end
    if action["link"] ~= nil then
      action_link = pandoc.utils.stringify(action["link"])
    end

    if (action_text == nil) ~= (action_link == nil) then
      quarto.log.warning("[hero] 'action' requires both 'text' and 'link'")
    end

    if action["external"] and pandoc.utils.stringify(action["external"]) == "true" then
      action_external = " external"
    end
  end

  local crumb_parts = {}
  for index, crumb in ipairs(crumbs) do
    if index > 1 then
      crumb_parts[#crumb_parts + 1] = '<span class="crumbs__separator" aria-hidden="true">›</span>'
    end
    local class = (index == #crumbs) and "crumbs__current" or "crumbs__parent"
    if crumb.link ~= nil then
      crumb_parts[#crumb_parts + 1] = string.format(
        '<a class="%s" href="%s">%s</a>', class, crumb.link, crumb.text
      )
    else
      crumb_parts[#crumb_parts + 1] = string.format(
        '<span class="%s">%s</span>', class, crumb.text
      )
    end
  end
  local crumbs_html = table.concat(crumb_parts, "\n    ")

  local badge_html = ""
  if badge ~= nil then
    badge_html = string.format('<span class="hero__badge">%s</span>', badge)
  end

  local action_html = ""
  if action_text ~= nil and action_link ~= nil then
    action_html = string.format([[
<div class="hero__actions">
      <a class="button__primary %s" href="%s" target="_blank" rel="noopener">%s</a>
</div>
    ]], action_external, action_link, action_text)
  end

  local style = ""
  if image ~= nil then
    style = string.format([[style="--hero-image: url('%s')"]], image)
  end

  return string.format([[
    <section class="hero" %s>
      <nav class="crumbs" aria-label="Breadcrumb">%s</nav>
      <div>
        %s
        <h1>%s</h1>
        <p class="hero__lede">%s</p>
        %s
      </div>
    </section>
  ]],
    style, crumbs_html, badge_html, title, lede, action_html
  )
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
