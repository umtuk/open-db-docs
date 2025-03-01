# open-db-docs

A JSON format for defining databases, ensuring structured and consistent tables, columns, indexes, and relationships.

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

Once inside the CLI, you can use the following commands:

### Available Commands

#### `help`
Display help information about the CLI or specific commands.

```sh
open-db-docs> help
```

#### `create-domain`
Create a default domain format.

```sh
open-db-docs> create-domain -h
```

Output:
```
Usage: cli create-domain [options]

create default domain format

Options:
  -n, --name <type>  domain name
  -h, --help         display help for command
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
  -s, --sql <type>         SQL file path
  -f, --format <type>      SQL file database format (mysql, postgres, ...)
  -c, --connection <type>  Database connection string (e.g., postgresql://user:password@localhost:5432/dbname)
  -h, --help               display help for command
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

## Examples

### Creating a Domain Format
To create a default domain format with the name `hello`:

```sh
open-db-docs> create-domain -n hello
```

### Generating DBML from a Database Connection
To generate DBML using a PostgreSQL database connection string:

```sh
open-db-docs> generate-dbml -c postgresql://postgres:s3cret@localhost:5432/keycloak -f postgres
```

### Generating DBML from an SQL File
To generate DBML from an existing SQL file:

```sh
open-db-docs> generate-dbml -s example/keycloak.sql -f postgres
```

### Exiting the CLI
To exit the CLI:

```sh
open-db-docs> exit
```

## Global Environment Variables

The following environment variables can be configured to customize the behavior of `open-db-docs`:

| Variable Name           | Default Value        | Description |
|------------------------|---------------------|-------------|
| `outDir`               | `out`               | Output directory for generated files. |
| `formatFilename`       | `format.json`       | Filename for the generated format file. |
| `generateDbmlFilename` | `generated.dbml`    | Filename for the generated DBML file. |

## Development and Self-Management

At this time, external contributions are not being accepted. However, if you wish to modify or extend `open-db-docs` for personal or organizational use, you can follow these steps to manage your own version:

1. Fork the repository to your own GitHub account.
2. Clone your fork to your local development environment.
3. Create a feature branch to make changes (`git checkout -b feature-branch`).
4. Implement your changes and commit them (`git commit -m 'Describe your changes'`).
5. Push the changes to your fork (`git push origin feature-branch`).
6. Manage updates and modifications independently as needed.

For any discussions or questions, please consider managing them within your own team or network.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.