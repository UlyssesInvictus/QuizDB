# About QuizDB

QuizDB is a searchable question database for the popular scholastic activity of Quizbowl. [^1]

Right now, I know what you're thinking: _another_ question database?

### So what makes this one so different, so appealing?

I appreciated the existing options, but each had at its own issues I was unhappy with (poor question coverage in QBDB, file-search only in AseemDB, and poor UI / aged tech stack in Quinterest).

Rather than waste manhours learning and improving the code for these sites, I decided to build a new site, using frameworks I was familiar with, and implementing the features I knew I wanted. [^2]

From the outset, I focused on three core philosophies:

- A **user-friendly interface** built for both desktop and mobile, with continuing updates from a web-experienced dev (me!).
- The **largest searchable** question database online (unless you happen to work for NAQT or HSAPQ), with constantly improving coverage of question meta-information, like tournament source, category and subcategory, and pretty stats.
- An **integrated admin and user report system** ensuring that, long after I myself may stop working on this project, the power of the open source community will continue to add material to QuizDB.

While you may already be happy with Quinterest, I encourage you to use QuizDB instead, as it's meant to be a self-feeding machine, improving in quality as new users arrive.

## Features

All that aside, here are the features:

- Search using mixable and combinable filters including:
  - Tossups and bonuses
  - Answerline and content
  - Category and subcategory
  - Tournament source and difficulty
  - Breakfast food of the question writer at time question was written [^3]
- Responsive UI, suitable for any size screen [^4]
- Admin portal for editing, fixing, uploading, or otherwise improving question content and metainfo by trusted QB peers.
- User error and correction report system.
- Search for answerlines in Google, Wikipedia, or QuizDB from within question itself.
- Easy export of questions to text, JSON, or CSV.
- Dedicated quizbowl resource page compiled from 8 years of QB experience.

And all this on a live server instance connected to my codebase, meaning I can deploy new features at the push of a button. Speaking of which...

## Future

Here are supplementary features I'd like to add over time, organized roughly by likelihood of being added:

- Improved question formatting for powers and answerlines. (The issue here is that, ultimately, questions have to be manually marked to display things like bold and underline. It's a high priority, but it'll be slow.)
- Advanced "google-style" search, allowing you to do things like "do NOT include" or "includes any of the following."
- Interactive charts and statistics showing answer distribution and quality over time. (I imagine it'll be useful for seeing which way the winds are blowing with stock clues. [^5])
- User accounts, with:
  - Starring questions & packets, and viewing/filtering starred questions.
  - Creating memory cards and notes using live highlighting
  - Tracking questions read (or at least searched for)
- Although I personally don't find them that useful, likely a primitive question reader, potentially with integration into user accounts to track performance over time.
- Improved appearance customization, with dark themes and font customization.
- Who knows..?

### Monetization

Unfortunately, the elephant in the room is

## Credits

## Tech Specs

## Contact

[^1]: And the one word spelling is the one QuizDB adheres religiously to, so that's what we're going with here. Also, GIF is prounounced "jiff."

[^2]: "I'll build my own website! With blackjack and hookers!"

[^3]: Okay, not really. But I wonder if there's a difference in question quality between the kind of writer who has Wheaties for breakfast and the kind that has Red Bull...

[^4]: Except, perhaps, a screen "made for ants."

[^5]: Although, my understanding of the QB world tells me it will likely just be used to make fun of bad question writers.
