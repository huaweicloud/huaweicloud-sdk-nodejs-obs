Version 3.24.3

New Features:
1. Added the abort upload to the ObsClient.uploadFile API.

Documentation & Demo: None

-----------------------------------------------------------------------------------

Version 3.23.11

New Features:
1. Added three API, ObsClient.setObjectTagging、ObsClient.getObjectTagging and ObsClient.deleteObjectTagging；
2. ObsClient.uploadFile supports specifying the Expires parameter to set the expiration time of the uploaded object；

Documentation & Demo: None

-----------------------------------------------------------------------------------

Version 3.23.9

New Features:
1. Supported the getObject,uploadFile and downloadFile ProgressCallback；
2. Supported the Special character；
3. Supported listBucket by pages；

Documentation & Demo: None

Resolved Issues:
1. Fixed the issue that GetBucketMetadata RequestPayer parameter does not take effect;
2. Added the x-image-save-object and x-image-save-bucket header；

-----------------------------------------------------------------------------------

Version 3.21.6

New Features: None

Documentation & Demo: None

Resolved Issues:

1. [Function] Fixed the issue that data inconsistency may occur when the resumable download API is used in some scenarios.
2. [Function] Modified the intelligent segmentation logic for resumable download and upload.
3. [Function] Fixed the issue that the resumable download of SSE-C encrypted objects fails.

----
Version 3.1.4

New Features:
1. Supported the configuration of the maximum HTTP connections by specifying parameter max_connections during ObsClient initialization.
2. Supported the HTTP agent customization by specifying parameters http_agent and https_agent when during ObsClient initialization.
3. Supported the configuration of parameter user_agent during ObsClient initialization.
4. Allowed all APIs to return Indicator, the internal error code of OBS.
5. Added the log printing of the time required for setting up a socket connection.
6. Added the ObsClient.setObjectMetadata API for modifying object metadata.
7. Added parameter ProgressCallback into ObsClient.putObject, ObsClient.uploadPart, and ObsClient.appendObject to obtain the upload progress.


Documentation & Demo: None

Resolved Issues:

1. [Function] Added the verification of empty strings, null values, or undefined values for mandatory fields.
2. [Function] Fixed the issue that the error message returned by the OBS server cannot be obtained when error code 3xx is returned for a request.
3. [Function] Fixed the issue that an error occurs when parameter StorageClass is configured for ObsClient.putObject, ObsClient.appendObject, and ObsClient.InitiateMultipartUpload.
-----------------------------------------------------------------------------------

Version 3.1.3

New Features:
1. Allowed the log module to integrate the existing configurations.

Documentation & Demo: None

Resolved Issues:
1. Fixed the issue that the LastModified field is not in the UTC format in the responses returned by the following APIs: ObsClient.listObjects, ObsClient.listVersions, ObsClient.getObject, ObsClient.getObjectMetadata, ObsClient.copyObject, ObsClient.listParts, and ObsClient.copyPart.
2. Fixed the issue that ObsClient.close cannot be used to disconnect the link in persistent connection mode.
-----------------------------------------------------------------------------------

Version 3.1.2

New Features:
1. Upgraded the log4js dependency to the latest version.
2. Supported the FunctionGraph configuration and query in the bucket event notification APIs ObsClient.setBucketNotification and ObsClient.getBucketNotification.

Documentation & Demo:
1. Added the FunctionGraph configuration description in the event notification section of the Developer Guide.
2. Added the parameter description of FunctionGraph in sections related to configuring and obtaining bucket event notifications in the API Reference.

Resolved Issues:
Fixed the issue that the error message reported by the ObsClient.createBucket API is incorrect due to protocol negotiation.
