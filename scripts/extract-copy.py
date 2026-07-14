#!/usr/bin/env python3
"""
Extract human-readable text copy from all QMD pages and write to website-copy.md.
Run directly:  python3 scripts/extract-copy.py
Or triggered automatically by the pre-commit hook when .qmd files change.
"""

import re
import os
from pathlib import Path

import yaml

ROOT = Path(__file__).parent.parent

# Pages to include, in display order
PAGES = [
    ("Homepage",                          "index.qmd"),
    ("About OpenSpace",                   "about/about.qmd"),
    ("Team",                              "about/team.qmd"),
    ("Partners",                          "about/partners.qmd"),
    ("Impact",                            "about/impact.qmd"),
    ("Research",                          "about/research.qmd"),
    ("Brand & Attribution",               "about/brand.qmd"),
    ("Globe Browsing",                    "features/globe-browsing.qmd"),
    ("Mission Visualizations",            "features/mission-visualizations.qmd"),
    ("Heliophysics",                      "features/heliophysics.qmd"),
    ("Display Support",                   "features/display-support.qmd"),
    ("Use Cases",                         "community/use-cases.qmd"),
    ("Community Slack",                   "community/slack.qmd"),
    ("Contact",                           "community/contact.qmd"),
    ("Contribute",                        "community/contribute.qmd"),
    ("Events",                            "community/events/index.qmd"),
    ("Annual User Meetings",              "community/user-meetings/index.qmd"),
    ("2025 Annual User Meeting",          "community/user-meetings/2025/index.qmd"),
    ("2026 Annual User Meeting",          "community/user-meetings/2026/index.qmd"),
    ("Download",                          "install/download.qmd"),
    ("Previous Versions",                 "install/previous-versions.qmd"),
    ("Tutorials",                         "resources/tutorials.qmd"),
    ("Internships",                       "resources/internships.qmd"),
]

# Quarto listings (`assets/listing/*.yml` rendered through an .ejs.md template) hold real
# on-page copy — card titles, bios, descriptions — that never appears in the QMD source
# itself. Each entry maps a page's rel_path to the listing YAML file(s) it renders, the
# label to head each item with, and which fields are actually shown as text on the page
# (as opposed to image paths, coordinates, or internal ids — verified against each
# _template/*.ejs.md). "field" may be a dotted path into a list of dicts, e.g.
# "cta[].text" pulls the `text` field out of each item in a `cta` list.
PAGE_LISTINGS = {
    "index.qmd": [
        ("assets/listing/carousel.yml", "title", ["title", "eyebrow"]),
    ],
    "resources/tutorials.qmd": [
        ("assets/listing/tutorials.yml", "title", ["title", "header", "description"]),
    ],
    "features/globe-browsing.qmd": [
        ("assets/listing/globe-browsing.yml", "title", ["title", "tag", "tagline", "description"]),
    ],
    "features/heliophysics.qmd": [
        ("assets/listing/heliophysics.yml", "title", ["title", "tag", "tagline", "description"]),
    ],
    "features/mission-visualizations.qmd": [
        ("assets/listing/mission-visualizations.yml", "title", ["title", "tag", "tagline", "description"]),
    ],
    "about/research.qmd": [
        ("assets/listing/theses.yml", "title", ["title", "authors[].name", "year", "partner"]),
        ("assets/listing/publications.yml", "title", ["author", "title", "location", "year"]),
    ],
    "about/partners.qmd": [
        ("assets/listing/partners.yml", "name", ["name", "description"]),
    ],
    "about/team.qmd": [
        ("assets/listing/team.yml", "name", ["name", "title", "affiliation"]),
    ],
    "community/use-cases.qmd": [
        ("assets/listing/use-cases.yml", "title", ["title", "shorttitle", "institution", "location", "body", "tags"]),
    ],
    "community/events/index.qmd": [
        ("assets/listing/events.yml", "title", ["title", "type", "datetime", "description", "description_past", "cta[].text"]),
    ],
    "about/impact.qmd": [
        ("assets/listing/organizations.yml", "name", ["name", "city"]),
    ],
}

# Human-readable labels for the raw YAML field names above
FIELD_LABELS = {
    "title": "Title",
    "eyebrow": "Eyebrow",
    "header": "Header",
    "description": "Description",
    "tag": "Tag",
    "tagline": "Tagline",
    "authors[].name": "Author(s)",
    "author": "Author(s)",
    "location": "Location",
    "year": "Year",
    "partner": "Partner",
    "name": "Name",
    "affiliation": "Affiliation",
    "shorttitle": "Short title",
    "institution": "Institution",
    "body": "Body",
    "tags": "Tags",
    "type": "Type",
    "datetime": "Date/time (UTC)",
    "description_past": "Description (once past)",
    "cta[].text": "Button text",
    "city": "City",
}

# HTML entities to decode
HTML_ENTITIES = [
    ("&amp;",   "&"),
    ("&mdash;", "—"),
    ("&ndash;", "–"),
    ("&middot;","·"),
    ("&times;", "×"),
    ("&rarr;",  "→"),
    ("&larr;",  "←"),
    ("&copy;",  "©"),
    ("&nbsp;",  " "),
    ("&rsquo;", "'"),
    ("&lsquo;", "'"),
    ("&rdquo;", "”"),
    ("&ldquo;", "“"),
    ("&hellip;","…"),
    ("&bull;",  "•"),
    ("&deg;",   "°"),
    ("&ouml;",  "ö"),
    ("&ocirc;", "ô"),
    ("&eacute;","é"),
    ("&agrave;","à"),
    ("&lt;",    "<"),
    ("&gt;",    ">"),
]


def strip_yaml(text):
    """Remove YAML front matter."""
    return re.sub(r"^---\s*\n.*?\n---\s*\n", "", text, flags=re.DOTALL)


def strip_html_tags(text):
    """Remove HTML tags, keeping inner text."""
    # Remove script blocks entirely
    text = re.sub(r"<script[^>]*>.*?</script>", "", text, flags=re.DOTALL | re.IGNORECASE)
    # Remove style blocks entirely
    text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL | re.IGNORECASE)
    # Remove SVG blocks entirely
    text = re.sub(r"<svg[^>]*>.*?</svg>", "", text, flags=re.DOTALL | re.IGNORECASE)
    # Remove HTML comments
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    # Remove all remaining tags
    text = re.sub(r"<[^>]+>", "", text)
    return text


def decode_entities(text):
    for entity, char in HTML_ENTITIES:
        text = text.replace(entity, char)
    # Numeric entities
    text = re.sub(r"&#(\d+);", lambda m: chr(int(m.group(1))), text)
    return text


def strip_quarto_fences(text):
    """Remove ```{=html} ... ``` fences but keep the content inside."""
    text = re.sub(r"```\{[^}]*\}\s*\n", "", text)
    text = re.sub(r"\n```\s*\n?", "\n", text)
    return text


def clean_whitespace(text):
    """Strip indentation, collapse blank lines, and strip trailing spaces."""
    lines = [line.strip() for line in text.splitlines()]
    # Collapse 2+ blank lines into 1
    result = []
    blank_count = 0
    for line in lines:
        if line == "":
            blank_count += 1
            if blank_count <= 1:
                result.append(line)
        else:
            blank_count = 0
            result.append(line)
    return "\n".join(result).strip()


def extract_copy(path):
    """Extract readable text from a single QMD file."""
    text = path.read_text(encoding="utf-8")
    text = strip_yaml(text)
    text = strip_quarto_fences(text)
    text = strip_html_tags(text)
    text = decode_entities(text)
    # Remove leftover Quarto shortcode syntax
    text = re.sub(r"\{\{<.*?>\}\}", "", text)
    # Remove inline CSS style attributes that leak through
    text = re.sub(r'\bstyle="[^"]*"', "", text)
    # Remove data-* attributes
    text = re.sub(r'\bdata-[a-z-]+="[^"]*"', "", text)
    text = clean_whitespace(text)
    return text


def field_value(item, field):
    """Resolve a plain or dotted `authors[].name`-style field path against one YAML item."""
    if field.endswith("[].name") or field.endswith("[].text"):
        list_key, sub_key = field[:-7], field.split(".")[-1]
        entries = item.get(list_key) or []
        values = [str(e.get(sub_key, "")).strip() for e in entries if e.get(sub_key)]
        return ", ".join(values)

    value = item.get(field)
    if value is None:
        return ""
    if isinstance(value, list):
        return ", ".join(str(v).strip() for v in value)
    return str(value).strip()


def format_listing_item(item, fields):
    """Render one YAML listing entry as `Label: value` lines."""
    lines = []
    for field in fields:
        value = field_value(item, field)
        if not value:
            continue
        label = FIELD_LABELS.get(field, field)
        value = " ".join(value.split())  # collapse YAML's folded-block newlines
        lines.append(f"**{label}:** {value}")
    return "\n".join(lines)


def extract_listing(yml_rel_path, title_field, fields):
    """Render every entry of a listing YAML file as a series of copy blocks."""
    path = ROOT / yml_rel_path
    if not path.exists():
        return f"_Listing file not found: {yml_rel_path}_"

    items = yaml.safe_load(path.read_text(encoding="utf-8")) or []
    blocks = []
    for item in items:
        heading = field_value(item, title_field) or "(untitled)"
        body = format_listing_item(item, fields)
        if body:
            blocks.append(f"### {heading}\n\n{body}")
    return "\n\n".join(blocks)


def main():
    output_lines = [
        "# OpenSpace Website Copy",
        "",
        "_Auto-generated from QMD source files. Do not edit directly — run `python3 scripts/extract-copy.py` to regenerate._",
        "",
        "---",
        "",
    ]

    for title, rel_path in PAGES:
        path = ROOT / rel_path
        if not path.exists():
            output_lines.append(f"# {title}\n\n_File not found: {rel_path}_\n\n---\n")
            continue

        copy = extract_copy(path)

        listings = PAGE_LISTINGS.get(rel_path, [])
        listing_blocks = [
            (f"## {yml_path.rsplit('/', 1)[-1]}", extract_listing(yml_path, title_field, fields))
            for yml_path, title_field, fields in listings
        ]
        listing_blocks = [(h, b) for h, b in listing_blocks if b]

        if not copy and not listing_blocks:
            continue

        output_lines.append(f"# {title}")
        output_lines.append("")
        if copy:
            output_lines.append(copy)
            output_lines.append("")
        for heading, body in listing_blocks:
            output_lines.append(heading)
            output_lines.append("")
            output_lines.append(body)
            output_lines.append("")
        output_lines.append("---")
        output_lines.append("")

    output = "\n".join(output_lines)
    out_path = ROOT / "website-copy.md"
    out_path.write_text(output, encoding="utf-8")
    print(f"✓ website-copy.md updated ({len(output.splitlines())} lines)")


if __name__ == "__main__":
    main()
