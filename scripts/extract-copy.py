#!/usr/bin/env python3
"""
Extract human-readable text copy from all QMD pages and write to website-copy.md.
Run directly:  python3 scripts/extract-copy.py
Or triggered automatically by the pre-commit hook when .qmd files change.
"""

import re
import os
from pathlib import Path

ROOT = Path(__file__).parent.parent

# Pages to include, in display order
PAGES = [
    ("Homepage",                          "index.qmd"),
    ("About OpenSpace",                   "about/about-openspace.qmd"),
    ("Team",                              "about/team.qmd"),
    ("Partners",                          "about/partners.qmd"),
    ("Impact",                            "about/impact.qmd"),
    ("Research",                          "about/research.qmd"),
    ("Brand & Attribution",               "about/brand.qmd"),
    ("Globe Browsing",                    "features/globe-browsing.qmd"),
    ("Mission Visualizations",            "features/mission-visualizations.qmd"),
    ("Space Weather",                     "features/space-weather.qmd"),
    ("Display Support",                   "features/display-support.qmd"),
    ("Use Cases",                         "community/use-cases.qmd"),
    ("Community Slack",                   "community/slack.qmd"),
    ("Projects",                          "community/projects/index.qmd"),
    ("Ocean World's Roadshow",            "community/projects/ocean-worlds-roadshow/index.qmd"),
    ("Spinning Stars (2025)",             "community/projects/spinning-stars-2025/index.qmd"),
    ("Spinning Stars (2023)",             "community/projects/spinning-stars/index.qmd"),
    ("Weird Worlds",                      "community/projects/weird-worlds/index.qmd"),
    ("Arecibo Wow!",                      "community/projects/arecibo-wow/index.qmd"),
    ("Lost City",                         "community/projects/lost-city/index.qmd"),
    ("Events",                            "community/events/index.qmd"),
    ("Annual User Meetings",              "community/user-meetings/index.qmd"),
    ("2025 Annual User Meeting",          "community/user-meetings/2025/index.qmd"),
    ("2026 Annual User Meeting",          "community/user-meetings/2026/index.qmd"),
    ("Download",                          "install/version-0213.qmd"),
    ("Tutorials",                         "resources/tutorials.qmd"),
]

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
        if not copy:
            continue

        output_lines.append(f"# {title}")
        output_lines.append("")
        output_lines.append(copy)
        output_lines.append("")
        output_lines.append("---")
        output_lines.append("")

    output = "\n".join(output_lines)
    out_path = ROOT / "website-copy.md"
    out_path.write_text(output, encoding="utf-8")
    print(f"✓ website-copy.md updated ({len(output.splitlines())} lines)")


if __name__ == "__main__":
    main()
