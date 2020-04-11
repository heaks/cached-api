## Run the API

- run
```bash
npm install;
npm start;
```
or
```bash
npm install;
npm run dev;
```

## Configuration
Configure your environment variables in .env file
Example:
```
# Application PORT
PORT = 8080

# DB Configs
DATABASE_URL = mongodb://localhost:27017/cached_keys

# Time to live for all entries
TTL = 3600000

# Limit of entries in database
LIMIT = 10
```

## API DOCS
Available enpoints:
- ``GET /api/all`` returns all the awailable keys with values
- ``GET /api/?key=geronimo`` returns value for key 'geronimo', or creates it if missing
- ``PUT /api/?key=geronimo`` updates key, requires body ``{ name: newName }`` to set a new name
- ``DELETE /api/?key=geronimo`` deletes certain key
- ``GET /api/all`` deletes all existing keys