# RPVR

RPVR is a tool written in [Meteor] to manage the download and cleanup of files from [Put IO].
Inspired by [Put IO Manager], the tool is intended to be run on a Raspberry PI download box (but will work on any Linux Meteor setup). It will:
  - Add files to put.io transfer queue
  - Watch for files that were added to put.io and trigger a download of those files using [Axel]
  - Monitor the status of the downloads (providing a web gui to Axel) using nohup / screen / similar service
  - On complete of the download, remove the file from the put.io storage and run some any follow up scripts

### Version
0.1.0

---
### Prerequesites

In order to install RPVR you will need:

 - [Put IO] - A Put.io account and API access
 - [Meteor] - A full stack framework written on top of NodeJS for web applications
 - [Axel] - A linux server with Axel installed

### Installation

// Install Instructions

```sh
$ shell commmand here
```

---
### Development

Want to contribute? Great! Feel free to get in touch with me and we can collaborate, or fork / pull as you like.

### Todo's

// Add TODOs

---
### License
The MIT License (MIT)

Copyright (c) 2015 Ian Outterside ([Ian Builds Apps]).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[Meteor]:https://www.meteor.com/
[Put IO]:http://put.io
[Put IO Manager]:https://github.com/sjlu/Put.io-Manager
[Axel]:http://axel.alioth.debian.org
[Ian Builds Apps]:http://www.ianbuildsapps.com
