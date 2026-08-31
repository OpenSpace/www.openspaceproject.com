# OpenSpace Project Website

The website is built using [Quarto](https://quarto.org/), an open-source scientific and technical publishing system. Before building the webpage, make sure to install the Quarto CLI on your system, by following the instructions on the [Quarto website](https://quarto.org/docs/get-started/). You also need a working Python installation.

To build the webpage:

  - Run `pip install -r requirements.txt` from the root folder to install Python dependencies
  - For development, run `quarto preview` in the root folder. A brower will open to `localhost:12800`. This uses hot reloading, so whenever any file is changed the webpage will reload
  - For deployment, run `quarto render`. The generated webpage is created in the `_site` folder

## General considerations

For loading performance, consider converting image files to `.webp` format using, for example, [ImageMagick](https://imagemagick.org).

File formats and tools used in the webpage:

  - [YML](https://learn.getgrav.org/17/advanced/yaml): Both used for configuration and data files
  - [SCSS](https://sass-lang.com/): Style sheets
  - [EJS](https://ejs.co/#docs): Templating language to turn files/YML into HTML
  - [Bootstrap](https://getbootstrap.com): Layout for the webpage

## File locations

  - `assets`: Assets used globally for the webpage itself
    - `assets/images`: General folder for images. Images should have a naming scheme of separating individual words using `_`. If multiple images are present for a single name, `-1`, `-2`, etc are appended. If a specific image variant is used (black, white, color, ...) it is separated with `--`, for example `logo--white.webp`
      - `assets/images/banner`: Images used for the hero banner section. Images in this folder should be of the aspect ratio φ:1 (1.61803398874989:1)
      - `assets/images/carousel`: Images that are automatically rotated through in the main page carousel
      - `assets/images/features`: Images used on feature pages
      - `assets/images/use-cases`: Images used on the use-cases page
      - `assets/images/user-meetings`: Images used on user meeting pages
    - `assets/brand`: Brand assets (logos, wordmarks) for OpenSpace and partner institutions
    - `assets/js`: JavaScript files used by the webpage
    - `assets/style`: SCSS style files used for the webpage
    - `assets/team`: Profile images and information about team members
    - `assets/listing`: Different listings that are used to generate content on different pages. Each `.yml` in this folder is named after the webpage on which it is used
    - `assets/videos`: Video assets used on the webpage
  - `community/events`: A list of events that will automatically be added to the events page. Each event should be in a subfolder that has an `index.qmd`
  - `resources`: Resources that are provided by the webpage for external use
  - `_template`: Partial pages that are included or EJS file templates used by other pages
  - `_announcement.yml`: Configuration file to control a top-level announcement banner
  - `_footer.yml`: Configuration file to control the information provided in the footer
  - `_navbar.yml`: Configuration file to control the top navigation bar
  - `_sidebars.yml`: Configuration file to control per-page sidebars
  - `_quarto.yml`: Root configuration file for Quarto
  - `404.qmd`: Special 404 page that gets displayed when someone navigates to a page that doesn't exist
  - `index.qmd`: Root page

## Shortcodes

We use a variety of shortcodes to insert dynamic content into the webpage. More information about shortcodes can be found in the [Quarto documentation](https://quarto.org/docs/authoring/shortcodes.html).

### Adding an announcement banner to the front page

Use the following information to the front matter of `index.qmd` to update the announcement banner on the front page:

```yaml
announcement:
  label: 2026 OpenSpace User Meeting · Norrköping, Sweden
  date: "2026-08-26T09:30:00+02:00"
  action:
    text: Register
    link: community/user-meetings/2026/
  show: true
```

This adds an event banner counting down to the event date and linking to the specified page. To hide the banner, set `show: false`.

More information about this shortcode can be found in [`_extensions\openspace\shortcodes\announcement-banner.lua`](https://github.com/OpenSpace/www.openspaceproject.com/blob/master/_extensions/openspace/shortcodes/announcement-banner.lua).

## Checklists

### Add new Team Member / Student

 - [ ] Resize profile image to 500x500 pixels
 - [ ] Copy profile image into the correct subfolder in `assets/team`. The first two characters should be a sequence number within that folder
 - [ ] Add the new person to the `assets/team/team.yml`

### Team Member becomes inactive

- [ ] Move profile image from the current folder in `assets/team` to the `-previous` version
- [ ] Update the profile image file name to have the correct sequence number. We try our best to have previous members ordered based on their seniority; longer time in the project -> lower number
- [ ] Move the persons entry in the `assets/team/team.yml` to the current group, update `type` and `image` entries
