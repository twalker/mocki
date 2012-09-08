##mocki
simple server to route requests to mock json files.

do it as middleware so I can do it per collection.

it should:

- be used as middleware that can be swapped out for the real restful resource api based on NODE_ENV

- deal with verbs differently
	GET collection/:id?
		- list: default to index.json or dynamically return a index.json with dir list
		- show: if id
			if file, return the file
			if directory, return a list.json

	POST collection/
		- create: save json to a file

	PUT collection/id
		- update: reflect back json sent
		
	DELETE collection/id
		- delete: delete file

