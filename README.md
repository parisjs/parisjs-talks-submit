# Paris.js talks submission

Render a form to post a new talk for paris.js meetup, and save it on Trello.

## Install

    npm install

## Configuration

    cp config.json.{sample,}
    $EDITOR config.json

* host - by default https://api.trello.com
* token - the oauth token from Trello
* key - the oauth app key from Trello
* idList - the id of the Trello list

## Usage

    node server.js

## API

### Render the form

    GET /

Returns 200.

### Post the form and save to Trello

    POST /

Parameters:

* title - The title of the talk
* abstract - a small abstract of the talk (can be some markdown)
* author - the author : Author <email>
* type - the type of the talk (long or short)
* note - additional notes

Returns 201.

## Tests

    npm test

## License

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

    Copyright (C) 2013 François de Metz <francois@2metz.fr>

    Everyone is permitted to copy and distribute verbatim or modified
    copies of this license document, and changing it is allowed as long
    as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

    0. You just DO WHAT THE FUCK YOU WANT TO.
