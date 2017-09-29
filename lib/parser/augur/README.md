# Augur

> In ancient Rome, **augurs** were those responsible for interpreting the signs of the gods into human wisdom.

**Augur** is a Python based Quizbowl packet parser. It operates from the command line (so some h4xx0r familiarity required).

Augur can load and format Quizbowl packets into data formats both easily human and machine understandable. It is primarily designed for use with **QuizDB**, which uses Augur as its primary method for loading packets.

See **Using Augur** for what inputs Augur can _in_ and what outputs Augur can _out_.

## Dependencies

To use Augur, you must have the following installed:
  - Python 2.7 (so not Python 3!)
  - the following python packages (use pip):
    - beautifulsoup (for parsing HTML)
    - PyYAML (for dumping data to yaml)
  - the following system tools:
    - pandoc (for background loading of doc/docx files)
      - (make sure it can be called by running `pandoc`)

## Using Augur

Make sure you have all the dependencies installed. You can use Augur by cloning or downloading this Github repo, navigating into the folder holding Augur, and running `python augur.py` (yes, it's not the most advanced Python module). To encourage clean data output, you _must_ also pass Augur certain options, which you can see in the **All Options** table.

### Input

Augur currently accepts only doc, docx, text, or HTML files. This excludes PDF by design, as PDF parsing is naturally difficult, and you are encouraged to either find the original source, or convert the PDF yourself so as to review any conversion errors yourself before feeding the packet into Augur. If you'd like to see other input formats, please contact me or file a Github issue.

Augur works best with the following packet formats, which decrease the chance that it'll mistakenly parse anything. It'll probably do okay anyways, but these are your best practices:

- Place a single line reading "Tossups" before the tossups and a single line reading "Bonuses" before the "Bonuses" e.g.

```
Tossups

1. [...]
2. [...]

Bonuses

1. [...]
2. [...]
```

- Remove all extraneous text before, between, and after questions, which Augur will parse by default as part of a question. See **All Options** to see how to help Augur ignore unimportant text.

```
# BAD

HFT XVI: Round 2

1. [...] ANSWER: something

[Literature/American : by Raynor Kuang]

2. [...] ANSWER: something else

This is the end of Round 2!

# GOOD

1. [...] ANSWER: something
2. [...] ANSWER: something else

```

- Preface tossup questions with the format `1. This author...` (or `2.`, `3.`, etc.) and tossup answers with the format `ANSWER: [...]`. See **All Options** to teach Augur how to recognize other formats.
- Preface bonus leadins with the format `1. This author...` (or `2.`, `3.`, etc.), bonus texts with the format `[10] This war...`, and bonus answers with the format `ANSWER: [...]`. See **All Options** to teach Augur how to recognize other formats.



### Output

TODO: talk about file output name.

Currently, Augur only produces YAML output. It's pretty easy to produces JSON as well, but since YAML is fairly universally readable, my current motivation is low to code in other methods. Bother me if it's something you'd really like to see.

### All Options

Augur can be tweaked by passing it options from the command line.



## TODOs

- convert all unicode to string
  - (so no python/unicode!! output in yaml)
- add comments in yaml output
  - tossup/bonus separators
  - num tossups/bonuses
  - settings used to generate file
- classifier
