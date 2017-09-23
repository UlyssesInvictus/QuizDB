# Help

This page is an attempt to answer some common questions about QuizDB, without much regard for rhyme nor reason of organization.

If you have further questions, you can contact me anytime at [kuang@raynor.me](mailto:kuang@raynor.me), or by PM at my QB forum account [here](http://hsquizbowl.org/forums/memberlist.php?mode=viewprofile&u=5867).

You can use the Error Report system to report any errors on individual questions, or email me to report broader errors. Feel free to contact me about anything QB related, ranging from how to study to why I neg so much.

## Search

- **I get results of a nature I wasn't expecting:** this could be for a lot of reasons, so I'll try to address them all by carefully explaining the exact logic behind search:
  - Your search input is split up into words based on the space within your input. (So "Saint-Gaudens" will be treated differently from "Saint Gaudens.")
  - All words from your input must appear _exactly_ at one point or another within the question, whether within the question text or the answer text, based on your filters.
    - So "Mark Twain" will return a positive result for a question with a sentence like "I **mark**ed on my calendar that the date lay **twain** Monday and Friday."
  - Any other provided filters are applied.
  - Questions are capped at 15 to prevent accidentally loading everything at once when you do things like input a search for the letter "a," or uncapped if you've explicitly used "Load All."
  - All of this is changing when Advanced Search is implemented, so that smart search will become the default.
- **I see funny characters or missing spaces:** this is an artifact of Quinterest's database. QuizDB uses Quinterest questions, but is much better at handling special characters (diacritics, foreign characters, etc.), so that things that were just silently ignored in Quinterest actually show up in QuizDB.
  - We're improving this gradually as we find these, but it depends on you **reporting errors!** when you see them.
  - If you're curious, these most commonly happened when enterers on Quinterest copy-pasted from PDFs, since PDF rendering isn't always precise and can confuse your OS, leading to the common mistaking of "f"s for Chinese characters.

## Stats

- **Aren't the usage stats being separated by difficulty or category kind of useless without also normalizing for the overall number of questions in that difficulty or category?**: Yup. That's why I put a warning to take the results with a grain of salt.
- **The keywords feature is pretty cool, but totally useless sometimes e.g. giving "novel" as the best keyword for things like _Catcher in the Rye_.**: Yup, I know--thus the usage warning again. I used a pretty simple algorithm to get it working quickly, but I'll probably sit down and improve this someday, especially when Moxon becomes a feature. For now, it's kind of cool how well it does in some cases regardless.

## Settings

- **How do these work?:** Settings use your browser cache to save your settings and reload them between sessions. This is why it doesn't work across devices: the cache is specific to devices. (And also why it doesn't work if you use things like Chrome's Incognito Mode, since those wipe your cache.)
- **What's this about offline usage?:** QuizDB uses some Progressive Web App ("PWA") strategies, meaning the site actually loads without internet if you've previously cached the site (which should happen automatically). This is mostly useless right now, since you still have to load questions (and even the search filters) from the internet, but it still lets you do things like read the Resources guide. ¯\\\_(ツ)\_/¯
  - **Actually,** it's a tabled feature to get offline questions (i.e. search/stats without internet) working as well. The cost-benefit ratio is kind of wack right now, since I have to totally reimplement search using locally saved questions, but if it's a feature you really want to see, make your voice heard.
