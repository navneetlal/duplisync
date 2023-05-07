# DupliSync

DupliSync is a Node.js service that helps you synchronize data across different collections in MongoDB. It allows you to scan a source collection for data based on specific criteria and synchronize it with a target collection. 

## Description

DupliSync requires you to manually insert a configuration document in the `synchronization_config` collection of your MongoDB database. The document should contain the following fields:

- **source_database**: The name of the database containing the source collection to scan for data.
- **source_collection**: The name of the source collection.
- **source_key**: The name of the field in the source collection that contains the value to check for.
- **destination_database**: The name of the database containing the target collection where the data will be synchronized.
- **destination_collection**: The name of the target collection.
- **destination_key**: The name of the field in the target collection that should match the source key.
- **destination_field**: The name of the field in the target collection where the data should be synchronized. If this field is not specified, the data will be deleted from the target collection.
- **last_sync_time**: The timestamp of the last synchronization. This field is automatically updated by DupliSync and should not be modified manually.
- **source_last_updated_key**: The name of the field in the source collection that contains the timestamp of the last update. This field is optional and can be used to synchronize only the documents that have been updated since the last synchronization.

Once you have inserted the configuration document, you can run DupliSync as a cron job to synchronize your collections at regular intervals. DupliSync will scan the source collection for data according to the configuration document and synchronize it with the target collection.

## Requirements
DupliSync requires Node.js and a MongoDB server. The service uses the MongoDB Node.js driver to connect to the database and perform operations.

## Installation
You can install DupliSync by cloning this repository and installing the dependencies using npm:

```bash
git clone https://github.com/navneetlal/duplisync.git
cd duplisync
yarn install
```

## Usage
To use DupliSync, you can start the service as a cron job by running the following command:

```bash
0 * * * * /path/to/duplisync/yarn start
```

This will start the service and begin scanning the source collection for duplicate data according to the configuration documents in the synchronization_config collection. The service will run until the synchronization is completed, and then it will stop.

You can adjust the cron schedule as needed to fit your synchronization requirements.

## License
DupliSync is released under the Apache License 2.0. See the LICENSE file for details.




