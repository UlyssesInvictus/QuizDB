# About QuizDB

QuizDB is a searchable question database for the popular scholastic activity of Quizbowl. [^1](#endnote-1)

Right now, I know what you're thinking: _another_ question database?

### So what makes this one so different, so appealing?

I appreciated the existing options, but each had at its own issues I was unhappy with (poor question coverage in QBDB, file-search only in AseemDB, and poor UI / aged tech stack in Quinterest).

Rather than waste manhours learning and improving the code for these sites, I decided to build a new site, using frameworks I was familiar with, and implementing the features I knew I wanted. [^2](#endnote-2)

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
  - Breakfast food of the question writer at time question was written [^3](#endnote-3)
- Responsive UI, suitable for any size screen [^4](#endnote-4)
- Admin portal for editing, fixing, uploading, or otherwise improving question content and metainfo.
  - With accompanying API exposing all questions and data for machine readable public consumption.
- User error and correction report system.
- Search for answerlines in Google, Wikipedia, or QuizDB from within question itself.
- Easy export of questions to text, JSON, or CSV.
- Dedicated quizbowl resource page compiled from 8 years of QB experience.

And all this on a live server instance connected to my codebase, meaning I can deploy new features at the push of a button. Speaking of which...

## Future

You can find an up-to-date list planned feature release list [here](/future).

A very quick list, though, includes:

- Better coverage of question formatting and metainfo
- Advanced search
- Offline improvements
- Stats
- **Moxon**, a question reader

### Monetization

Unfortunately, the elephant in the room is that this website requires time and money to run. I don't mind so much about the time, but the money for server and domain costs adds up over a year.

I will almost definitely be adding ads for this reason. I will also add a PayPal donation button. I don't mind if you use an ad-blocker; but if you do, please consider donating a little if you use the site frequently.

Any significant leftover money after paying for maintenance costs will be donated back into the QB community.

I'm also chewing on an idea of "pro" user accounts, wherein some newer questions and features will be gated. I'll share the profits here with the authors of the questions being hidden. I'm still workshopping all the details so contact me with feedback.

<div id='credits' class='anchor'></div>

## Credits

This site was first created in the summer of 2017 by Raynor Kuang. It is graciously sponsored by [PACE](https://www.pace-nsc.org/).

It was inspired by Rohit Lalchandani's Quinterest, Jerry Vinokurov's QBDB, and Aseem Keyal's aseemDB.

Its question content was largely seeded by Quinterest and the work of its maintainers Jacob Reed and Nicholas Karas, and all the others who've helped upload questions to Quinterest.

Much is owed to the users who in turn helped maintain this website.

## Tech Specs

QuizDB is hosted on Heroku, connected to a Namecheap DNS. It uses React to compile its frontend client, which connects through a proxy to a Rails-powered backend API.

Both the frontend and backend live in the following repository: [https://github.com/UlyssesInvictus/QuizDB](https://github.com/UlyssesInvictus/QuizDB).

The repo is open source. If you'd like to contribute, please fork the repo and make a pull request. You can find full tech specs and contribution guidelines in the README at the base of the repo.

<div id='api' class='anchor'></div>

### Accessing the QuizDB API

The QuizDB API, and the body of question data it gives access to, is more-or-less free to use. I haven't added an official license, but it generally boils down to:
1. If you will be making money off the questions in any way (e.g., by creating a question reader app using QuizDB questions, that includes ads), please contact me so we can discuss how to make sure that your app is not construed by the public as an officially licensed QuizDB product.
2. Otherwise, you are free to use the questions for research projects, hobby projects, personal study tools, etc.

If you create a tool using the QuizDB API, and you feel it would be helpful to the quizbowl community, please contact me and I can add it to the [Resources](/resources) page.

There are three main ways to access the API:
1. [HIGHLY RECOMMENDED] By far the most recommended solution is to download a copy of the QuizDB database. Copies are stored in a public Amazon S3 bucket [here](https://s3.console.aws.amazon.com/s3/buckets/quizdb-public/?region=us-east-1&tab=overview), and are manually uploaded every few months. An example copy (uploaded 1/22/19) is [here](https://s3.amazonaws.com/quizdb-public/quizdb-01222019.sql.zip). These files are very large (~50MB zipped). **This is the MOST recommended solution**, because it introduces no extra load to the QuizDB servers. If you use the other solutions, you may unintentionally DDOS the servers as it tries to load questions for your request.
2. [RECOMMENDED WITH CAUTION] There is an admin interface at [https://quizdb.org/admin](/admin). If you make an account, you will gain access to an interface with the same filters as the main client, but with additional TXT/JSON links that you can either use in the browser or directly copy into any web request-making program (i.e. these are the API "endpoints"). This will introduce load to the API, but if you take caution and spread out your API requests over time, the server should be OK.
3. [NOT RECOMMENDED EXCEPT FOR THE NON-TECHNICAL] You can also use the main client at the QuizDB homepage. By default, all requests are limited to 150 questions returned because of the extreme extra load of requests made through this format. If you're very non-technical and do not want to make an admin account, then you can just request "all" questions by searching without any input. To retrieve more than the 150 questions you're limited to, you can segment your searches by smaller groups such as difficulty, year, or tournament.

Please contact me if you need any extra help interfacing with the API.

<div id='contact' class='anchor'></div>

## Contact

You can contact me at [kuang@raynor.me](mailto:kuang@raynor.me), or by PM at my QB forum account [here](http://hsquizbowl.org/forums/memberlist.php?mode=viewprofile&u=5867).

You can use the Error Report system to report any errors on individual questions, or email me to report broader errors. Feel free to contact me about anything QB related, ranging from how to study to why I neg so much.

## Endnotes

<div id='endnote-1' class='anchor'></div>

[^1]: And the one word spelling is the one QuizDB adheres religiously to, so that's what we're going with here. Also, GIF is prounounced "jiff."

<div id='endnote-2' class='anchor'></div>

[^2]: "I'll build my own website! With blackjack and hookers!"

<div id='endnote-3' class='anchor'></div>

[^3]: Okay, not really. But I wonder if there's a difference in question quality between the kind of writer who has Wheaties for breakfast and the kind that has Red Bull...

<div id='endnote-4' class='anchor'></div>

[^4]: Except, perhaps, a screen "made for ants."
