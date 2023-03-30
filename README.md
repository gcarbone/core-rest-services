# Core REST Services
![](https://github.com/gcarbone/core-rest-services/raw/main/public/ui/core-rest-services-logo-zip-file/png/logo-no-background.png)


## Description

Designed to be easily extensible, Core REST Services aims to provide a REST interface to common data center functions.  Many organizations continue to adopt next-gen iPaaS platforms to automate processes and remove manual "swivel-chair" data entry across multiple systems.  However, most organizations are still tied to some "legacy" systems that do not provide a modern way to access them.  This project (hopefully) will make it easier to include these systems in their process automation efforts.

## Major Features

### API Security

    * Includes both API Key and JWT schemes (API Key enabled by default)

### Filesystem Access

    * Access to common filesystem operations

### Command Line Execution

    * Run a command line function and either return immediately or wait to retrieve the response back

### Active Directory

    * Common AD functions, mostly centered around user management

### PGP

    * Create keys and encrypt and decrypt files

## Getting Started

### Dependencies

    * node v14+
    * maybe others

### Installing

    * Clone this project or download the zip file and extract it into a folder
    * On the command line, execute `npm install`

### Executing program

    * On the command line, execute `npm start`
    * By default, HTTPS server starts on port 4000
    * The default API Key is located in the `.env` file in the root directory of this project.  I HIGHLY reccomend changing it immediately.
    * The default certificates used for HTTPS are simple, self-signed certs.  I HIGHLY reccomend changing these immediately.
    * Open a browser window to https://host:port/api-docs to view the documentation on each endpoint

## The Configuration File (.env)
### Basic System Config
    * NODE_ENV: the environment this server is running in.  Warning: If set to PROD, the OAS documentation will not be auto-generated
    * HTTPS: Boolean (true | false) turns on HTTPS support
    * PORT: The port to open for HTTP traffic
    * SERVER_CERT: path to the server's public certificate (you should change this immediately)
    * SERVER_KEY: path to the server's private key (you should change this immediately)

### Security Configuration (see further down for how to turn on/off various features)
#### API Key Security (default)
    * API_KEY = The key to provide for authentication in the "api-key" header

#### JWT Security (default)
    * ACCESS_TOKEN_SECRET: the "Authentication" header must contain "Bearer <token>"

### Logging Options
    * LOG_TO_CONSOLE: Boolean (true | false) to control logging traffic to the console. Logging will never happen if NODE_ENV is set to 'production' or 'PROD'
    * LOG_LEVELS: (access,error,warn,info,debug) sets the log level to output
    * LOG_FILE_DIR: directory to create log files
    * LOG_FILE_BASE_NAME: base filename for the log files

### Active Directory
This provides a REST interface to an on-prem Active Directory instance.  Ensure that secure communications are enabled to AD to enable certain operations through this service (i.e. passwords)

    * AD_URL: the URL to connect the service to (ldaps is highly reccomended) i.e. ldaps://host:port
    * AD_PRINCIPAL: this is in email format (i.e. cn@domain.com)
    * AD_CREDENTIALS = password for the principal user id

### PGP

    * PGP_PASSPHRASE: The passphrase to decrypt files sent to you
    * PGP_PUBLIC_KEY: The ASCII-armored public key (surround in double quotes) for signing
    * PGP_PRIVATE_KEY: The ASCII-armored private key (surround in double quotes) for decrypting


## Help

Check the API Docs here:  `https://host:port/api-docs`

If that does not address your issues, please log a ticket

## Authors

Contributors names and contact info

[@Gene Carbone](https://github.io/gcarbone)

## Version History

* 0.1
    * Initial Release

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

