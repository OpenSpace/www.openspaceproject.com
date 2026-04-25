# OpenSpace Project Website
To build the webpage:
  - For development, run `quarto preview` in the root folder. A brower will open to `localhost:12800`. This uses hot reloading, so whenever any file is changed the webpage will reload
  - For deployment, run `quarto render`. The generated webpage is created in the `_site` folder


## General considerations
For loading performance, consider converting image files to `.webp` format using, for example, [ImageMagick](https://imagemagick.org).

File formats used in the webpage:
  - [YML](https://learn.getgrav.org/17/advanced/yaml): Both used for configuration and data files
  - [SCSS](https://sass-lang.com/): Style sheets
  - [EJS](https://ejs.co/#docs): Templating language to turn files/YML into HTML

## File locations
  - `assets`: Assets used globally
    - `assets/images`: General folder for images
      - `assets/images/banner`: Images used for the hero banner section. Images in this folder should be of the aspect ratio φ:1 (1.61803398874989:1)
      - `assets/images/resources`: Images that will end up automatically on the resources page
    - `assets/logos`: Logos for softwares, institutions
    - `asset/style`: Style files
    - `asset/team`: Information about team members.
      - `asset/team/team.yml`: Information about the different team members
  - `events`: A list of events that will automatically be added to the events page. Each event should be in a subfolder that has a `index.qmd`
  - `_quarto.yml`: Root configuration file for Quarto
  - `_variables.yml`: Global variables that can be reused in different documents

## Checklists
### Add new Team Member / Student
 - [ ] Resize profile image to 500x500 pixels
 - [ ] Copy profile image into the correct subfolder in `assets/team`. The first two characters should be a sequence number within that folder
 - [ ] Add the new person to the `assets/team/team.yml`

### Team Member becomes inactive
- [ ] Move profile image from the current folder in `assets/team` to the `-previous` version
- [ ] Update the profile image file name to have the correct sequence number. We try our best to have previous members ordered based on their seniority; longer time in the project -> lower number
- [ ] Move the persons entry in the `assets/team/team.yml` to the current group, update `type` and `image` entries

## Templates
### Team
```yml
- name: <Name>
  title: <Title>
  affiliation: <Affiliation of the team member>
  image: <path to image file in assets/team/<type>
  type: <One of 'admin', 'admin-previous', 'advisor', 'advisor-previous', 'coordinator', 'developer', 'developer-previous', 'student'>
  thesis-affiliation: <Needed if type=student; where was the student located during their thesis work>
```

### Event
```yml
---
title: <Event Title>
description: <Short description of the vent>
date: <Date in format  YYYY-MM-DD>
time: <Time in format HH:MM -- HH:MM timezone>
image: <Optional path to a representative image>
categories: [ "<Category 1>", "<Category 2>" ]
google-cal: <Link to a google calender>
---
```
