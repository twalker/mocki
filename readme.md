##mocki
simple server to route requests to mock json files.  
saves files in `mocks/` + collectionname

it should be used as middleware that can be swapped out for the real restful resource api based on NODE_ENV

should be middleware so I can use it per collection. 

something like [nock](https://github.com/flatiron/nock), only 1/1000th the coolness.
need to figure out how exactly I want to use it in app (middleware, proxy server, etc.) before I get too far.

currently 

---------------

GET collection/:id?
	- list: default to list.json or dynamically return a index.json with dir list
	- show: if id
		if file, return the file
		if directory, return a list.json

POST collection/
	- create: save json to a file

PUT collection/id
	- update: reflect back json sent
	
DELETE collection/id
	- delete: delete file

