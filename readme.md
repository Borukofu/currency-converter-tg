ChatGPT4 | Midjourney, [15.04.2025 20:42]
# Telegram Currency Converter Bot

This is a simple Telegram bot that allows you to:

*   Get current exchange rates
*   Get information about currency symbols
*   Convert currencies

## Prerequisites

*   [Node.js](https://nodejs.org/en/) installed
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager
*   A Telegram bot token.  You can get one by talking to the [BotFather](https://t.me/BotFather) on Telegram.
*   An API key from [Fixer.io](https://fixer.io/).  You'll need to sign up for a free account.

## Installation

1.  Clone the repository:

    
bash
    git clone <repository_url>
    cd <repository_name>
2.  Install the dependencies:

    
bash
    npm install  # or yarn install
3.  Create a .env file in the root of the project and add your Telegram bot token and Fixer.io API key:

    
tokenTg=<your_telegram_bot_token>
    apiKey=<your_fixer_api_key>
    **Important:**  Never commit your .env file to a public repository.

## Usage

1.  Run the bot:

    
bash
    npm start  # or yarn start
2.  Open Telegram and start a conversation with your bot.

3.  Use the following commands:

    *   /start -  Greets you.
    *   /rates -  Displays the current exchange rates (based on EUR).
    *   /symbols - Displays available currency symbols and their descriptions.

4.  You can also convert currencies by sending a message in the following formats:

    *   **Check Symbol Information:**  Send a three-letter currency symbol (e.g., "USD", "EUR", "GBP"). The bot will return the description of that currency if it's found in the symbols list.
    *   **Convert Currency:** Send a message in the format: <amount> <from_currency> <to_currency> [<to_currency2> ...].  For example:  "10 USD EUR GBP".  This will convert 10 USD to EUR and GBP using the latest exchange rates.

    **Example Interactions:**

    
User: /start
    Bot: Hello, [Your Name]!

    User: /rates
    Bot: current (2023-10-27) exchange rates
    Bot: 1 EUR it
    USD : 1.054261
    GBP : 0.868828
    ...

    User: /symbols
    Bot: current exchange symbols
    Bot: USD : United States Dollar
    EUR : Euro
    GBP : British Pound
    ...

    User: USD
    Bot: USD : United States Dollar

    User: 10 USD EUR
    Bot: 10 USD --> EUR 9.4853
## Project Structure


.
├── .env              # Environment variables (API keys, tokens)
├── index.ts          # Main application file (Telegram bot logic)
├── Data.ts           # Class for handling API requests and data storage
├── package.json      # Project dependencies and scripts
├── package-lock.json # Dependency lockfile
├── README.md         # This file
├── rates.json        # Cached exchange rates (automatically created)
└── symbols.json      # Cached currency symbols (automatically created)
## Dependencies

*   node-telegram-bot-api:  For interacting with the Telegram Bot API.
*   dotenv: For loading environment variables from a .env file.

## Error Handling

The bot includes basic error handling:

*   It checks for the presence of the tokenTg and apiKey environment variables and exits if they are missing.
*   It handles errors during API requests and logs them to the console.
*   It caches the currency data locally to reduce the number of API requests and to allow the bot to continue functioning even if the API is temporarily unavailable.

## Future Enhancements

*   Add support for more currencies.
*   Implement a command to manually refresh the exchange rates.
*   Improve error handling and logging.
*   Add unit tests.
*   Implement a more sophisticated currency parsing logic.
*   Allow users to specify the base currency for the /rates command.
*   Use a database instead of JSON files for data storage.
*   Implement more robust error handling for invalid user inputs.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.