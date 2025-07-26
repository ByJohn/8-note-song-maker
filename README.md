# 8 Note Song Maker

A tool to make simple songs using the eight notes of the major scale. Great as a guide for playing songs with handbells!

The eight notes are based on the C major scale. Number colours are based on the Tobar 7958 Rainbow Music Bells.

Inspired by the Handbell Harmony mini-game in Wii Music (Nintendo).

## Creating Songs

Notes are added by typing numbers 1-8 in the text box. Multiple lines of numbers can be used to create harmonies.

### Song Options

The first line can also be reserved for song options. Options are formatted with a designated letter and a value (`[LETTER][VALUE]` eg. `t140`).

| Option | Description | Letter | Value | Example |
| --- | --- | --- | --- | --- |
| Tempo | The beats per minute of the song. Default is 120 BPM. | `t` | Positive integer | `t200` (200 BPM) |

## Sharing Songs

The song data (notes and options) is automatically encoded into the URL, making songs easy to share.

## To Do

Possible improvements...

- [ ] Highlight melody notes
- [ ] Display messages to browser without support for:
  - [ ] CSS variables
  - [ ] CSS calc
  - [ ] ES6
- [ ] Add Note pulse animation when played
- [ ] Add asset cache-buster
- [ ] Support custom note colours
- [ ] Add numbers on mobile keyboard
- [ ] Add song filters for category, date added, duration, complexity
- [ ] Add extra song details:
  - [ ] Total steps
  - [ ] Note distribution
- [ ] Add support for note accidentals
