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
      - lxml, the parser used with beautifulsoup
      - scipy, numpy, and scikitlearn (for question subject classification purposes)
    - PyYAML (for dumping data to yaml)
  - the following system tools:
    - pandoc (for background loading of doc/docx files)
      - (make sure it can be called by running `pandoc`)

## Using Augur

Make sure you have all the dependencies installed. You can use Augur by cloning or downloading this Github repo, navigating into the folder holding Augur, and running `python augur.py` (yes, it's not the most advanced Python module). To encourage clean data output, you _must_ also pass Augur certain options, which you can see in the **All Options** table.

### Input

Augur currently accepts only doc, docx, text, or HTML files. This excludes PDF by design, as PDF parsing is naturally difficult, and you are encouraged to either find the original source, or convert the PDF yourself so as to review any conversion errors yourself before feeding the packet into Augur. If you'd like to see other input formats, please contact me or file a Github issue.

Augur currently accepts only single files (as opposed to directories). If you want to parse a directory at once, you're encouraged to write your own bash script. This is also intentional, to encourage passing accurate round names. Basically, Augur is going to purposefully restrictive in a lot of cases to make sure produce good data.

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

tl;dr You should reformat your parsed files to match the Augur-standard format. If you won't, or it's too laborious to do so, specify your own regices. If you're curious about the default regices, look inside the `Packet` class.

### Output

By default, Augur appends `.yml` to the input file for use as the output file. You can override this by setting the output file option.

Currently, Augur only produces YAML structured output. It's pretty easy to produces JSON as well, but since YAML is fairly universally readable, my current motivation is low to code in other methods. Bother me if it's something you'd really like to see.

### All Options

Augur can be tweaked by passing it options from the command line. You can see these options by running `python augur.py --help`. This README can potentially go out of date, so consider the help description given by running this command the most authoritative example.

Argument  |  Description
--|--
`input_file [output_file]`    |  First and second arguments to Augur. Input file and output file, respectively; output defaults to `[input_file].yml` if not given.
`--help`, `-h`    |  Display Augur help.
`--round`, `-r`   |  Round of parsed questions.
`--tournament`, `-t`    |  Tournament of parsed questions.
`--num-tossups`    |  Number of tossups in packet. Helps Augur figure out tossup/bonus boundary if "Bonuses" header not used; defaults to looking for "Bonuses" header otherwise.
`--tossup-text-re`   |  Regex describing the format of tossup question text.
`--tossup-answer-re`    |  Regex describing the format of tossup question answer.
`--bonus-leadin-re`    |  Regex describing the format of bonus leadin.
`--bonuspart-text-re`   |  Regex describing the format of a bonus part text.
`--bonuspart-answer-re`   |  Regex describing the format of a bonus part answer.
`--strippable-lines-res`  |  Regices describing any lines within the packet that can be safely ignored. (So as to avoid accidentally including in a question.)
`--classifier_data_filename`  |  Filepath of the classifier data to use



## TODOs

Augur can always be improved. Add a Github issue or get in touch if you'd like to see new features!

- category/subcategory classifier
