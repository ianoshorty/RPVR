# RPVR - Axel Download Manager With Put.io Integration

RPVR is a tool written in [Meteor] to manage the download and cleanup of files using [Axel].
Inspired by [Put IO Manager], the tool is intended to be run on a Linux download box and offer [Put IO] integration. It will:

##### General  

  - Download, monitor, pause and cancel files using [Axel] - offering a Web GUI.
  - When the download completes, clean up and run any follow up scripts you like

##### Put IO Integration

  - Add files to put.io transfer queue
  - Watch for files that were added to put.io and trigger a download of those files using [Axel]
  - When the download completes, remove the file from the put.io storage 

### Version
0.1.0

---
### Prerequesites

In order to install RPVR you will need:

 - [Meteor] - A full stack framework written on top of NodeJS for web applications
 - [Axel] 	- A linux server with Axel installed
 - [Put IO] - A Put.io account and API access for PutIO integration

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

  - Method to add completeion scripts
  - Put.IO integration
  - Refactor AxelDownloader as a standalone node package (remove underscore / meteor dependancy)
  - Improve AxelDownloader methods to use a single interface (the download object)
  - Handle items better to instill reactivity
  - Optimise timeouts  

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
