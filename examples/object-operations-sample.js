/**
 * This sample demonstrates how to do object-related operations
 * (such as create/delete/get/copy object, do object ACL) 
 * on OBS using the OBS SDK for Nodejs.
 */

'use strict';
 
var ObsClient;
try{
	ObsClient = require('esdk-obs-nodejs');
}catch(e){
	try{
		ObsClient = require('./lib/obs');
	}catch(e){
		ObsClient = require('../lib/obs');//sample env
	}
}

/*
 * Initialize a obs client instance with your account for accessing OBS
 */
var obs = new ObsClient({
	access_key_id: '*** Provide your Access Key ***',
	secret_access_key: '*** Provide your Secret Key ***',
	server : 'https://your-endpoint'
});


var bucketName = 'my-obs-bucket-demo';
var objectKey = 'my-obs-object-key-demo';

/*
 * Create bucket 
 */
obs.createBucket({
	Bucket : bucketName
}).then((result) => {
	if(result.CommonMsg.Status < 300){
		console.log('Create bucket for demo\n');
		 /*
         * Create object
         */
		return obs.putObject({
			Bucket: bucketName,
			Key : objectKey,
			Body : 'Hello OBS'
		});
	}
}).then((result) => {
	if(result && result.CommonMsg.Status < 300){
		console.log('Create object:' + objectKey + ' successfully!\n');
		 /*
         * Get object metadata
         */
		obs.getObjectMetadata({
			Bucket: bucketName,
			Key : objectKey
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Get object metadata');
				console.log('\tETag-->' + result.InterfaceResult.ETag);
				console.log('\tContentLength-->' + result.InterfaceResult.ContentLength);
				console.log('\n');
			}
		});
		
        /*
         * Get object
         */
		obs.getObject({
			Bucket: bucketName,
			Key : objectKey
		}).then((result) =>{
			if(result.CommonMsg.Status < 300){
				console.log('Get object content');
				console.log('\tContent-->' + result.InterfaceResult.Content);
				console.log('\n');
			}
		});
		
		/*
         * Copy object
         */
		obs.copyObject({
			Bucket: bucketName,
			Key: objectKey + '-back',
			CopySource : bucketName + '/' + objectKey,
			MetadataDirective : obs.enums.CopyMetadata
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Copy object');
				console.log('\tETag-->' + result.InterfaceResult.ETag);
				console.log('\n');
			}
		});
		
		/*
         * Put/Get object acl operations
         */
		obs.setObjectAcl({
			Bucket: bucketName,
			Key: objectKey,
			ACL : obs.enums.AclPublicRead
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Set object ACL to ' + obs.enums.AclPublicRead + ' finished. \n');
				return obs.getObjectAcl({
					Bucket: bucketName,
					Key: objectKey
				});
			}
		}).then((result) => {
			if(result && result.CommonMsg.Status < 300){
				console.log('Get object ACL:');
				console.log('\tOwner[ID]-->' + result.InterfaceResult.Owner.ID);
				console.log('\tGrants:');
				for(let i=0;i<result.InterfaceResult.Grants.length;i++){
					console.log('\tGrant[' + i + ']:');
					console.log('\tGrantee[ID]-->' + result.InterfaceResult.Grants[i]['Grantee']['ID']);
					console.log('\tGrantee[URI]-->' + result.InterfaceResult.Grants[i]['Grantee']['URI']);
					console.log('\tPermission-->' + result.InterfaceResult.Grants[i]['Permission']);
				}
				console.log('\n');
			}
		});
		
	}
});


var process = require('process');
var isDeleteObjectFinished = false;
process.on('beforeExit', (code) => {
	if(!isDeleteObjectFinished){
		/*
		 * Delete object
		 */
		obs.deleteObject({
			Bucket: bucketName,
			Key: objectKey
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Delete object ' + objectKey +  ' finished.\n');
			}
			return obs.deleteObject({
				Bucket: bucketName,
				Key: objectKey + '-back'
			});
		}).then((result) => {
			if(result && result.CommonMsg.Status < 300){
				console.log('Delete object ' + objectKey + '-back' +  ' finished.\n');
			}
			obs.close();
		});
		isDeleteObjectFinished = true;
	}
});