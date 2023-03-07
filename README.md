# Core REST Services
![](https://github.com/gcarbone/core-rest-services/raw/main/public/ui/core-rest-services-logo-zip-file/png/logo-no-background.png)


## Description

Designed to be easily extensible, Core REST Services aims to provide a REST interface to common data center functions.  Many organizations continue to adopt next-gen iPaaS platforms to automate processes and remove manual "swivel-chair" data entry across multiple systems.  However, most organizations are still tied to some "legacy" systems that do not provide a modern way to access them.  This project (hopefully) will make it easier to include these systems in their process automation efforts.

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

## The Configuration File (.env)

    *NODE_ENV: the environment this server is running in.  Warning: If set to PROD, the OAS documentation will not be auto-generated
    *PORT: The port to open for HTTP traffic
    *LOG_TO_CONSOLE: Boolean (true | false) to control logging traffic to the console
## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

Contributors names and contact info


ex. [@Gene Carbone](https://github.io/gcarbone)

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)
