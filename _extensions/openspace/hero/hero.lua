-- @param args The lede text
-- @param kwargs
--          - parent Parent node for the breadcrumbs
--          - current Curret node for the breadcrumbs
--          - title The title
-- @param meta
return {
  ['hero'] = function(args, kwargs, meta)
    local parent = kwargs["parent"]
    if parent == nil then
      return quarto.shortcode.error_output(
        "hero",
        "Missing parameter 'parent'",
        "inline"
      )
    end
    parent = pandoc.utils.stringify(parent)

    local current = kwargs["current"]
    if current == nil then
      return quarto.shortcode.error_output(
        "hero",
        "Missing parameter 'current'",
        "inline"
      )
    end
    current = pandoc.utils.stringify(current)

    local title = kwargs["title"]
    if title == nil then
      return quarto.shortcode.error_output(
        "hero",
        "Missing parameter 'title'",
        "inline"
      )
    end
    title = pandoc.utils.stringify(title)

    if args == nil then
      return quarto.shortcode.error_output(
        "hero",
        "Missing parameter for lede text",
        "inline"
      )
    end
    args = pandoc.utils.stringify(args)

    local text = [[
<section class="ds-hero">
  <nav class="page-breadcrumb" aria-label="Breadcrumb">
    <span class="bc-parent">]] .. parent .. [[</span>
    <span class="bc-sep">›</span>
    <span class="bc-current">]] .. current .. [[</span>
  </nav>
  <div>
    <h1>]] .. title .. [[</h1>
    <p class="ds-hero-lede">]] .. args .. [[</p>
  </div>
</section>]]

    return pandoc.RawInline('html', text)
  end
}
