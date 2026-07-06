-- Dotnav shortcode.
--
-- Renders the dotnav container used for section navigation. The dotnav JS in
-- `_template/dotnav.html` auto-populates the buttons at runtime by scanning for
-- `.content-section[id]` elements, so no manual button markup is required.
--
-- Usage:
--
--     {{< dotnav >}}
--
-- An optional `label` kwarg overrides the default `aria-label`:
--
--     {{< dotnav label="Navigate to venue section" >}}

return {
  ['dotnav'] = function(args, kwargs)
    local label = "Navigate to section"
    if kwargs["label"] ~= nil then
      label = pandoc.utils.stringify(kwargs["label"])
    end

    local html = string.format(
      '<nav class="dotnav" aria-label="%s"></nav>',
      label:gsub('"', '&quot;')
    )

    return pandoc.RawInline('html', html)
  end
}
