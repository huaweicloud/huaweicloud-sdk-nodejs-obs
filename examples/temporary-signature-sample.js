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
 * This sample demonstrates how to do common operations in temporary signature way
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

var events = require('events');
var eventEmitter = new events.EventEmitter();

/*
 * Initialize a obs client instance with your account for accessing OBS
 */
var obs = new ObsClient({
	access_key_id: '*** Provide your Access Key ***',
	secret_access_key: '*** Provide your Secret Key ***',
	server : 'http://your-endpoint',
    signature : 'obs'
});


var bucketName = 'my-obs-bucket-demo';
var objectKey = 'my-obs-object-key-demo';

var http = require('http');
var urlLib = require('url');
var crypto = require('crypto');

function doAction(msg,method, _url, content,headers){
	var url = urlLib.parse(_url);
	var req = http.request({
		method : method,
		host : url.hostname,
		port : url.port,
		path : url.path,
		rejectUnauthorized : false,
		headers : headers || {}
	});

	req.on('response', 	(serverback) => {
		var buffers = [];
		serverback.on('data', (data) => {
			buffers.push(data);
		}).on('end', () => {
			if(serverback.statusCode < 300){
				console.log(msg + ' using temporary signature successfully.');
				console.log('\turl:' + _url);
				eventEmitter.emit(msg);
			}else{
				console.log(msg + ' using temporary signature failed!');
				console.log('status:' + serverback.statusCode);
				console.log('\n');
			}
			buffers = Buffer.concat(buffers);
			if(buffers.length > 0){
				console.log(buffers.toString());
			}
			console.log('\n');
		});
	});

	req.on('error',(err) => {
		console.log(msg + ' using temporary signature failed!');
		console.log(err);
		console.log('\n');
	});
	
	if(content){
		req.write(content);
	}
	req.end();
}

/*
 * Create bucket
 */
let method = 'PUT';
let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName});
let loc = 'your-location';
let content  = `<CreateBucketConfiguration><Location>${loc}</Location></CreateBucketConfiguration>`;
doAction('Create bucket', method, res.SignedUrl, content, res.ActualSignedRequestHeaders);


/*
 * Set/Get/Delete bucket cors
 */
eventEmitter.on('Create bucket', ()=>{
	let method = 'PUT';
	let content  = '<CORSConfiguration><CORSRule><AllowedMethod>PUT</AllowedMethod><AllowedOrigin>http://www.a.com</AllowedOrigin><AllowedHeader>header1</AllowedHeader><MaxAgeSeconds>100</MaxAgeSeconds><ExposeHeader>header2</ExposeHeader></CORSRule></CORSConfiguration>';
	let headers = {};
	headers['Content-Length'] = content.length;
	headers['Content-MD5'] = crypto.createHash('md5').update(content).digest('base64');
	let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName, SpecialParam: 'cors', Headers : headers});
	doAction('Set bucket cors', method, res.SignedUrl, content, res.ActualSignedRequestHeaders);
});

eventEmitter.on('Set bucket cors', ()=>{
	let method = 'GET';
	let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName, SpecialParam: 'cors'});
	doAction('Get bucket cors', method, res.SignedUrl, null, res.ActualSignedRequestHeaders);
});


eventEmitter.on('Get bucket cors', ()=>{
	let method = 'DELETE';
	let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName, SpecialParam: 'cors'});
	doAction('Delete bucket cors', method, res.SignedUrl, null, res.ActualSignedRequestHeaders);
});


/*
 * Create object
 */
eventEmitter.on('Set bucket cors', ()=>{
	let method = 'PUT';
	let content = 'Hello OBS';
	let headers = {};
	headers['Content-Length'] = content.length;
	let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName, Key: objectKey, Headers: headers});
	doAction('Create object', method, res.SignedUrl, content, res.ActualSignedRequestHeaders);
});


/*
 * Get object
 */
eventEmitter.on('Create object', ()=>{
	let method = 'GET';
	let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName, Key: objectKey});
	doAction('Get object', method, res.SignedUrl, null, res.ActualSignedRequestHeaders);
});


/*
 * Set/Get object acl
 */
eventEmitter.on('Get object', ()=>{
	let method = 'PUT';
	let headers = {'x-obs-acl' : obs.enums.AclPublicRead};
	let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName, Key: objectKey, SpecialParam: 'acl', Headers: headers});
	doAction('Set object acl', method, res.SignedUrl, null, res.ActualSignedRequestHeaders);
});

eventEmitter.on('Set object acl', ()=>{
	let method = 'GET';
	let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName, Key: objectKey, SpecialParam: 'acl'});
	doAction('Get object acl', method, res.SignedUrl, null, res.ActualSignedRequestHeaders);
});


/*
 * Delete object
 */
eventEmitter.on('Get object acl', ()=>{
	let method = 'DELETE';
	let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName, Key: objectKey});
	doAction('Delete object', method, res.SignedUrl, null, res.ActualSignedRequestHeaders);
});


/*
 * Delete bucket
 */
eventEmitter.on('Delete object', ()=>{
	let method = 'DELETE';
	let res = obs.createSignedUrlSync({Method : method, Bucket : bucketName});
	doAction('Delete bucket', method, res.SignedUrl, null, res.ActualSignedRequestHeaders);
});


var process = require('process');
process.on('beforeExit', (code) => {
	obs.close();
});