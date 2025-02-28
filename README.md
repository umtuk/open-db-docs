# open-db-docs

A standard format for defining databases, ensuring structured and consistent tables, columns, indexes, and relationships.

## Features

- Create default domain format
- Generate DBML using domain formats
- Support for various SQL database formats (MySQL, PostgreSQL, etc.)
- Command-line interface (CLI) for easy usage

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed. Then, install dependencies:

```sh
npm install
```

## Usage

Run the CLI:

```sh
npm run start
```

### Available Commands

#### `create-domain`
Create a default domain format.

```sh
open-db-docs> create-domain -h
```

Output:
```
Usage: cli [options] [command]

Options:
  -h, --help               display help for command

Commands:
  create-domain [options]  create default domain format
  generate-dbml [options]  generate dbml using domain formats
  exit                     exit the cli
  help [command]           display help for command
```

#### `generate-dbml`
Generate DBML using domain formats.

```sh
open-db-docs> generate-dbml -h
```

Output:
```
Usage: cli generate-dbml [options]

generate dbml using domain formats

Options:
  -s, --sql <type>     SQL file path
  -f, --format <type>  SQL file database format (mysql, postgres, ...)
  -h, --help           display help for command
```

#### `exit`
Exit the CLI.

```sh
open-db-docs> exit
```

Output:
```
Goodbye!
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.