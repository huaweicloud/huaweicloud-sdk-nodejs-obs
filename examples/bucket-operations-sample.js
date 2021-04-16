/**
 * Copyright 2019 Huawei Technologies Co.,Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 *
 */

/**
 * This sample demonstrates how to do bucket-related operations
 * (such as do bucket ACL/CORS/Lifecycle/Logging/Website/Location/Tagging) 
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

/*
 * Put bucket operation
 */
obs.createBucket({
	Bucket : bucketName,
}).then((result) => {
	if(result.CommonMsg.Status > 300){
		console.error('Create bucket failed.');
		return;
	}
	
	console.log('Create bucket:' + bucketName + ' successfully!\n');
	
	/*
     * Get bucket location operation
     */
	obs.getBucketLocation({
		Bucket : bucketName
	}).then((result) => {
		if(result.CommonMsg.Status < 300){
			console.log('Get bucket location ' + result.InterfaceResult.Location + '\n');
		}
	});
	
    /*
     * Get bucket storageInfo operation 
     */
	obs.getBucketStorageInfo({
		Bucket : bucketName
	}).then((result) => {
		if(result.CommonMsg.Status < 300){
			console.log('Get bucket storageInfo:');
			console.log('\tsize:' + result.InterfaceResult.Size);
			console.log('\tobjectNumber:' + result.InterfaceResult.ObjectNumber);
			console.log('\n');
		}
	});
	
	 /*
     * Put/Get bucket quota operations
     */
	obs.setBucketQuota({
		Bucket : bucketName,
		StorageQuota : 1024 * 1024 * 1024
	}).then((result) => {
		return obs.getBucketQuota({
			Bucket : bucketName
		});
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Get bucket quota ' + result.InterfaceResult.StorageQuota + '\n');
		}
	});
	
	/*
	 * Put/Get bucket versioning operations
	 */
	obs.getBucketVersioningConfiguration({
		Bucket : bucketName
	}).then((result) => {
		if(result.CommonMsg.Status < 300){
			console.log('Default bucket versioning config ' + result.InterfaceResult.VersionStatus + '\n');
			return obs.setBucketVersioningConfiguration({
				Bucket : bucketName,
				VersionStatus : 'Enabled'
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Enable bucket versioning finished.' + '\n');
			obs.getBucketVersioningConfiguration({
				Bucket : bucketName
			}).then((result) => {
				console.log('Current bucket versioning config ' + result.InterfaceResult.VersionStatus + '\n');
			});
		}
	});
	
	
    /*
     * Put/Get bucket acl operations
     */
	obs.setBucketAcl({
		Bucket : bucketName,
		ACL : obs.enums.AclPublicRead
	}).then((result) => {
		if(result.CommonMsg.Status < 300){
			console.log('Set bucket ACL to public read finished. \n');
			return obs.getBucketAcl({
				Bucket : bucketName
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Get bucket ACL:');
			console.log('\tOwner[ID]-->' + result.InterfaceResult.Owner.ID);
			console.log('\tGrants:');
			for(let i=0;i<result.InterfaceResult.Grants.length;i++){
				console.log('\tGrant[' + i + ']:');
				console.log('\tGrantee[ID]-->' + result.InterfaceResult.Grants[i]['Grantee']['ID']);
				console.log('\tGrantee[URI]-->' + result.InterfaceResult.Grants[i]['Grantee']['URI']);
				console.log('\tPermission-->' + result.InterfaceResult.Grants[i]['Permission']);
			}
			console.log('\n');
			
		    /*
		     * Put/Get/Delete bucket logging operations
		     */
			return obs.setBucketLoggingConfiguration({
				Bucket: bucketName,
				Agency: 'test',
				LoggingEnabled:{
					TargetBucket:bucketName,
					TargetPrefix:'log-'
				}
			});
			
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Set bucket logging finished.\n');
		}
		return obs.getBucketLoggingConfiguration({
			Bucket : bucketName
		});
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Get bucket logging:');
			if(result.InterfaceResult && result.InterfaceResult.LoggingEnabled){
				console.log('\tTargetBucket-->' + result.InterfaceResult.LoggingEnabled.TargetBucket);
				console.log('\tTargetPrefix-->' + result.InterfaceResult.LoggingEnabled.TargetPrefix);
				console.log('\n');
			}
			
			return obs.setBucketLoggingConfiguration({
				Bucket : bucketName
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Delete bucket logging finished.\n');
		}
	});
	
    /*
     * Put/Get/Delete bucket cors operations
     */
	obs.setBucketCors({
		Bucket : bucketName,
		CorsRules:[
		    {
				AllowedMethod:['PUT','HEAD','GET'],
				AllowedOrigin:['http://www.a.com','http://www.b.com'],
				AllowedHeader: ['Authorization'],
				ExposeHeader:['x-obs-test1', 'x-obs-test2'],
				MaxAgeSeconds:100
			},
			{
				AllowedMethod:['PUT','POST','GET'],
				AllowedOrigin:['http://www.c.com','http://www.d.com'],
				AllowedHeader: ['Authorization'],
				ExposeHeader:['x-obs-test3','x-obs-test4'],
				MaxAgeSeconds:50
			}
			]
	}).then((result) => {
		if(result.CommonMsg.Status < 300){
			console.log('Set bucket CORS finished.\n');
			return obs.getBucketCors({
				Bucket : bucketName
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Get bucket CORS:');
			for(let k=0;k<result.InterfaceResult.CorsRules.length;k++){
				console.log('\tCorsRule[',k,']');
				console.log('\tCorsRule[ID]-->' + result.InterfaceResult.CorsRules[k]['ID']);
				console.log('\tCorsRule[MaxAgeSeconds]-->' + result.InterfaceResult.CorsRules[k]['MaxAgeSeconds']);
				for (let i=0;i<result.InterfaceResult.CorsRules[k]['AllowedMethod'].length;i++){
					console.log('\tCorsRule[AllowedMethod][' , (i+1) ,']-->'+result.InterfaceResult.CorsRules[k]['AllowedMethod'][i]);
				}
				for(let i=0;i<result.InterfaceResult.CorsRules[k]['AllowedOrigin'].length;i++){
					console.log('\tCorsRule[AllowedOrigin][',(i+1) ,']-->'+result.InterfaceResult.CorsRules[k]['AllowedOrigin'][i]);
				}
				for(let i=0;i<result.InterfaceResult.CorsRules[k]['AllowedHeader'].length;i++){
					console.log('\tCorsRule[AllowedHeader]',(i+1),']-->'+result.InterfaceResult.CorsRules[k]['AllowedHeader'][i]);
				}
				for(let i=0;i<result.InterfaceResult.CorsRules[k]['ExposeHeader'].length;i++){
					console.log('\tCorsRule[ExposeHeader][',(i+1) ,']-->'+result.InterfaceResult.CorsRules[k]['ExposeHeader'][i]);
				}	
			}
			console.log('\n');
			 /*
		     * Get bucket metadata operation
		     */
			return obs.getBucketMetadata({
				Bucket : bucketName,
				Origin : 'http://www.a.com',
				RequestHeader : 'Authorization'
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Get bucket metadata:');
			console.log('StorageClass-->' + result.InterfaceResult.StorageClass);
			console.log('AllowOrigin-->' + result.InterfaceResult.AllowOrigin);
			console.log('MaxAgeSeconds-->' + result.InterfaceResult.MaxAgeSeconds);
			console.log('ExposeHeader-->' + result.InterfaceResult.ExposeHeader);
			console.log('AllowMethod-->' + result.InterfaceResult.AllowMethod);
			console.log('AllowHeader-->' + result.InterfaceResult.AllowHeader);
			console.log('\n');
		}
	});
    
	
    /*
     * Put/Get/Delete bucket lifecycle operations
     */
	obs.setBucketLifecycleConfiguration({
		Bucket : bucketName,
		Rules:[
				{ID:'delete obsoleted files',Prefix:'obsoleted/',Status:'Enabled',Expiration:{Days:10}},
				{ID:'delete temporary files',Prefix:'temporary/',Status:'Enabled',Expiration:{Date:'2017-12-31T00:00:00Z'}},
				{ID:'delete temp files',Prefix:'temp/',Status:'Enabled',NoncurrentVersionExpiration:{NoncurrentDays : 10}}
		]
	}).then((result) => {
		if(result.CommonMsg.Status < 300){
			console.log('Set bucket lifecyle finished.\n');
			return obs.getBucketLifecycleConfiguration({
				Bucket : bucketName
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Get bucket lifecyle:');
			for(let i=0;i<result.InterfaceResult.Rules.length;i++){
				console.log('Rule[' + i + ']:');
				console.log('ID-->' + result.InterfaceResult.Rules[i]['ID']);
				console.log('Prefix-->' + result.InterfaceResult.Rules[i]['Prefix']);
				console.log('Status-->' + result.InterfaceResult.Rules[i]['Status']);
				if(result.InterfaceResult.Rules[i]['Expiration']){
					console.log('Expiration[Date]-->' + result.InterfaceResult.Rules[i]['Expiration']['Date']);
					console.log('Expiration[Days]-->' + result.InterfaceResult.Rules[i]['Expiration']['Days']);
				}
				if(result.InterfaceResult.Rules[i]['NoncurrentVersionExpiration']){
					console.log('NoncurrentVersionExpiration[Days]-->' + result.InterfaceResult.Rules[i]['NoncurrentVersionExpiration']['NoncurrentDays']);
				}
			}
			console.log('\n');
			
			return obs.deleteBucketLifecycleConfiguration({
				Bucket : bucketName
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Delete bucket lifecyle finished.\n');
		}
	});
	
	
	
    /*
     * Put/Get/Delete bucket website operations
     */
	obs.setBucketWebsiteConfiguration({
		Bucket : bucketName,
		IndexDocument:{Suffix:'index.html'},
		ErrorDocument:{Key:'error.html'}
	}).then((result) => {
		if(result.CommonMsg.Status < 300){
			console.log('Set bucket website finished.\n');
			return obs.getBucketWebsiteConfiguration({
				Bucket : bucketName
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Get bucket website:');
			console.log('\tIndexDocument[Suffix]-->' + result.InterfaceResult.IndexDocument['Suffix']);
			console.log('\tErrorDocument[Key]-->' + result.InterfaceResult.IndexDocument['Key']);
			console.log('\n');
			return obs.deleteBucketWebsiteConfiguration({
				Bucket : bucketName
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Delete bucket website finished.\n');
			console.log('\n');
		}
	});
	
    /*
     * Put/Get/Delete bucket tagging operations
     */
	obs.setBucketTagging({
		Bucket : bucketName,
		Tags :[{'Key':'key1','Value':'value1'}, {'Key':'key2', 'Value':'value2'}]
	}).then((result) => {
		if(result.CommonMsg.Status < 300){
			console.log('Set bucket tagging finished.\n');
			return obs.getBucketTagging({
				Bucket : bucketName
			});
		}
	}).then((result)=>{
		if(result && result.CommonMsg.Status < 300){
			console.log('Get bucket tagging:');
			for(let i=0;i<result.InterfaceResult.Tags.length;i++){
				let tag = result.InterfaceResult.Tags[i];
				console.log('Tag-->' + tag.Key + ':' + tag.Value);
			}
			console.log('\n');
			return obs.deleteBucketTagging({
				Bucket : bucketName
			});
		}
	}).then((result) => {
		if(result && result.CommonMsg.Status < 300){
			console.log('Delete bucket tagging finished.\n');
		}
	});
	
}).catch(function(err){
	console.error('err:' + err);
});


var process = require('process');
var deleteFinished = false;

process.on('beforeExit', (code) => {
	if(!deleteFinished){
		/*
		 * Delete bucket operation
		 */
		obs.deleteBucket({
			Bucket : bucketName
		}).then((result) => {
			if(result.CommonMsg.Status < 300){
				console.log('Delete bucket finished.\n');
			}else{
				console.log('Delete bucket failed.\n');
			}
			obs.close();
		}).catch(function(err){
			console.log('Delete bucket failed.\n');
		});
		deleteFinished = true;
	}
});


