##mocki
simple server to route requests to mock json files.

it should:

	- be used as middleware that can be swapped out for the real api based on NODE_ENV
	- deal with verbs differently
		GET
			- default to index.json

		POST
			- save json to a file

		PUT 
			- reflect back json sent
			
		DELETE
			- move to a deleted folder
