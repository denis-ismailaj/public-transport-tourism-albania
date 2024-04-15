# Perceived importance of public transport for tourism in Albania

On Aoril 14th 2024, Blendi Fevziu, a local talk show
host, [made a social media post](https://www.instagram.com/p/C5wEjP4Np_R/)
asking "Your opinion: What is the biggest problem of tourism in Albania?".

This post, as of April 15th 2024 at 22:00 CEST, had 564 comments and replies.

I was curious to see what percentage of the commenters mentioned public transport.

This project scrapes all the comments and uses OpenAI's GPT3.5 language model to classify comments as related to
public transport or not in order to answer that question.

## TL;DR / Results

- **Total Comments:** 564
- **Public transport related:** 115 (20.39%)

The scraped comments can be seen in `comments.json` (with personal identifying information removed).

### Caveats

- Misclassifications are possible - although I did manually review some of the results and the model seemed to do well.
- Replies are considered to be public-transport-related or not based on the root comment, they are not analyzed
  separately.

## Prompting technique

For best results, classification is done in two steps: the model first answers verbosely, then it is asked to summarize
its answer to a simple 'YES' or 'NO'.

#### First prompt:

    "{}"
    
    The complaint above is written in Albanian.
    Does any part of it include any words related to public transport in Albanian, such as "transporti publik", "autobuz", "furgon", "tren", "tramvaj", etc...?

#### Second prompt:

    Summarize the above answer as just 'YES' or 'NO', don't use any punctuation or anything else.

## Reproducing

1. First fetch the comments by executing the contents of `fetch-comments.js` in your browser's developer console.
2. Copy the results as an object and paste into `comments.json`.
3. Use the `analyze-comments.ipynb` notebook to look at the data (Note that you need to install the requirements, and
   have
   an [OpenAI API key](https://platform.openai.com/account/api-keys) in `.env`).
