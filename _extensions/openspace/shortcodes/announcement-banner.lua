-- Announcement banner shortcode.
--
-- Renders a banner from the document's `announcement` frontmatter, wherever
-- `{{< announcement-banner >}}` is placed. On the homepage that's inside the hero's
-- raw HTML block (see index.qmd), which is what gives it the hero's absolute
-- positioning against the video (.page-index__hero .announcement-banner in
-- index.scss) — placed anywhere else, it renders as a plain static bar using just
-- the shared styles in components/announcement-banner.scss.
--
-- Renders nothing if the document has no `announcement` key, so removing that
-- frontmatter block (or the shortcode call) turns the banner off without deleting
-- any content — turn it back on by restoring the frontmatter.
--
-- `label` is required. `date` is optional and enables a live countdown (an ISO 8601
-- timestamp with a UTC offset, read by announcement-banner.js). `action` is optional
-- and renders a single button (`text` + `link`).
--
-- Usage:
--
--     ---
--     announcement:
--       label: "2026 OpenSpace User Meeting · Norrköping, Sweden"
--       date: "2026-08-26T09:30:00+02:00"
--       action:
--         text: Register
--         link: community/user-meetings/2026/
--     ---
--
--     {{< announcement-banner >}}

local function render_banner(meta)
  local label = meta["label"]
  if label == nil then
    return nil, "Missing parameter 'label' in the 'announcement' frontmatter"
  end
  label = pandoc.utils.stringify(label)

  local date = meta["date"]
  if date ~= nil then
    date = pandoc.utils.stringify(date)
  end

  local action = meta["action"]
  local action_html = ""
  if action ~= nil then
    local action_text = action["text"]
    local action_link = action["link"]
    if (action_text == nil) ~= (action_link == nil) then
      quarto.log.warning("[announcement-banner] 'action' requires both 'text' and 'link'")
    elseif action_text ~= nil and action_link ~= nil then
      action_html = string.format(
        '<a class="announcement-banner__action" href="%s">%s</a>',
        pandoc.utils.stringify(action_link),
        pandoc.utils.stringify(action_text)
      )
    end
  end

  local timer_html = ""
  local date_attr = ""
  if date ~= nil then
    date_attr = string.format(' data-date="%s"', date)
    timer_html = [[
    <div class="announcement-banner__timer" aria-live="polite">
      <div class="announcement-banner__unit">
        <span class="announcement-banner__value" data-unit="days">00</span>
        <span class="announcement-banner__unit-label">Days</span>
      </div>
      <div class="announcement-banner__unit">
        <span class="announcement-banner__value" data-unit="hours">00</span>
        <span class="announcement-banner__unit-label">Hrs</span>
      </div>
      <div class="announcement-banner__unit">
        <span class="announcement-banner__value" data-unit="minutes">00</span>
        <span class="announcement-banner__unit-label">Min</span>
      </div>
    </div>]]
  end

  local script_html = ""
  if date ~= nil then
    script_html = '\n<script src="/assets/js/announcement-banner.js"></script>'
  end

  return string.format([[
<div class="announcement-banner"%s>
  <p class="announcement-banner__label">%s</p>
  %s
  %s
</div>%s]],
    date_attr, label, timer_html, action_html, script_html
  )
end

return {
  ['announcement-banner'] = function(args, kwargs, meta)
    local announcement_meta = meta and meta["announcement"] or nil
    if announcement_meta == nil then
      return pandoc.Inlines({})
    end

    local html, err = render_banner(announcement_meta)
    if html == nil then
      quarto.log.error("[announcement-banner] " .. err)
      return pandoc.Inlines({})
    end

    return pandoc.RawInline('html', html)
  end
}
