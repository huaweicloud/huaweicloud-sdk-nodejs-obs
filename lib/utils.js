'use strict';

const crypto = require('crypto');
const fs = require('fs');
const events = require('events');
const httpLib = require('http');
const httpsLib = require('https');
const xml2js = require('xml2js');
const urlLib = require('url');
const pathLib = require('path');
const streamLib = require('stream');
const obsModel = require('./obsModel');
const v2Model = require('./v2Model');

const CONTENT_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const OBS_SDK_VERSION = '3.0.2';

const mimeTypes = {
    '7z' : 'application/x-7z-compressed',
    'aac' : 'audio/x-aac',
    'ai' : 'application/postscript',
    'aif' : 'audio/x-aiff',
    'asc' : 'text/plain',
    'asf' : 'video/x-ms-asf',
    'atom' : 'application/atom+xml',
    'avi' : 'video/x-msvideo',
    'bmp' : 'image/bmp',
    'bz2' : 'application/x-bzip2',
    'cer' : 'application/pkix-cert',
    'crl' : 'application/pkix-crl',
    'crt' : 'application/x-x509-ca-cert',
    'css' : 'text/css',
    'csv' : 'text/csv',
    'cu' : 'application/cu-seeme',
    'deb' : 'application/x-debian-package',
    'doc' : 'application/msword',
    'docx' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'dvi' : 'application/x-dvi',
    'eot' : 'application/vnd.ms-fontobject',
    'eps' : 'application/postscript',
    'epub' : 'application/epub+zip',
    'etx' : 'text/x-setext',
    'flac' : 'audio/flac',
    'flv' : 'video/x-flv',
    'gif' : 'image/gif',
    'gz' : 'application/gzip',
    'htm' : 'text/html',
    'html' : 'text/html',
    'ico' : 'image/x-icon',
    'ics' : 'text/calendar',
    'ini' : 'text/plain',
    'iso' : 'application/x-iso9660-image',
    'jar' : 'application/java-archive',
    'jpe' : 'image/jpeg',
    'jpeg' : 'image/jpeg',
    'jpg' : 'image/jpeg',
    'js' : 'text/javascript',
    'json' : 'application/json',
    'latex' : 'application/x-latex',
    'log' : 'text/plain',
    'm4a' : 'audio/mp4',
    'm4v' : 'video/mp4',
    'mid' : 'audio/midi',
    'midi' : 'audio/midi',
    'mov' : 'video/quicktime',
    'mp3' : 'audio/mpeg',
    'mp4' : 'video/mp4',
    'mp4a' : 'audio/mp4',
    'mp4v' : 'video/mp4',
    'mpe' : 'video/mpeg',
    'mpeg' : 'video/mpeg',
    'mpg' : 'video/mpeg',
    'mpg4' : 'video/mp4',
    'oga' : 'audio/ogg',
    'ogg' : 'audio/ogg',
    'ogv' : 'video/ogg',
    'ogx' : 'application/ogg',
    'pbm' : 'image/x-portable-bitmap',
    'pdf' : 'application/pdf',
    'pgm' : 'image/x-portable-graymap',
    'png' : 'image/png',
    'pnm' : 'image/x-portable-anymap',
    'ppm' : 'image/x-portable-pixmap',
    'ppt' : 'application/vnd.ms-powerpoint',
    'pptx' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'ps' : 'application/postscript',
    'qt' : 'video/quicktime',
    'rar' : 'application/x-rar-compressed',
    'ras' : 'image/x-cmu-raster',
    'rss' : 'application/rss+xml',
    'rtf' : 'application/rtf',
    'sgm' : 'text/sgml',
    'sgml' : 'text/sgml',
    'svg' : 'image/svg+xml',
    'swf' : 'application/x-shockwave-flash',
    'tar' : 'application/x-tar',
    'tif' : 'image/tiff',
    'tiff' : 'image/tiff',
    'torrent' : 'application/x-bittorrent',
    'ttf' : 'application/x-font-ttf',
    'txt' : 'text/plain',
    'wav' : 'audio/x-wav',
    'webm' : 'video/webm',
    'wma' : 'audio/x-ms-wma',
    'wmv' : 'video/x-ms-wmv',
    'woff' : 'application/x-font-woff',
    'wsdl' : 'application/wsdl+xml',
    'xbm' : 'image/x-xbitmap',
    'xls' : 'application/vnd.ms-excel',
    'xlsx' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xml' : 'application/xml',
    'xpm' : 'image/x-xpixmap',
    'xwd' : 'image/x-xwindowdump',
    'yaml' : 'text/yaml',
    'yml' : 'text/yaml',
    'zip' : 'application/zip',	
};


const allowedResourceParameterNames = [        
	'acl',
	'backtosource',
    'policy',
    'torrent',
    'logging',
    'location',
    'storageinfo',
    'quota',
    'storageclass',
    'storagepolicy',
    'requestpayment',
    'versions',
    'versioning',
    'versionid',
    'uploads',
    'uploadid',
    'partnumber',
    'website',
    'notification',
    'replication',
    'lifecycle',
    'deletebucket',
    'delete',
    'cors',
    'restore',
    'tagging',
    'append',
    'position',
    'response-content-type',
    'response-content-language',
    'response-expires',
    'response-cache-control',
    'response-content-disposition',
    'response-content-encoding',
    'x-image-process',
    'x-oss-process'
];


const allowedResponseHttpHeaderMetadataNames = [
    'content-type',
    'content-md5',
    'content-length',
    'content-language',
    'expires',
    'origin',
    'cache-control',
    'content-disposition',
    'content-encoding',
    'x-default-storage-class',
    'location',
    'date',
    'etag',
    'host',
    'last-modified',
    'content-range',
    'x-reserved',
    'access-control-allow-origin',
    'access-control-allow-headers',
    'access-control-max-age',
    'access-control-allow-methods',
    'access-control-expose-headers',
    'connection'
];

const commonHeaders = {
	'content-length' : 'ContentLength',
	'date' : 'Date',
	'x-reserved' : 'Reserved'
};

const obsAllowedStorageClass = ['STANDARD', 'WARM', 'COLD'];

const v2AllowedStorageClass = ['STANDARD', 'STANDARD_IA', 'GLACIER'];

const obsAllowedAcl = ['private', 'public-read', 'public-read-write', 'public-read-delivered', 'public-read-write-delivered'];

const v2AllowedAcl = ['private', 'public-read', 'public-read-write', 'authenticated-read', 'bucket-owner-read', 'bucket-owner-full-control', 'log-delivery-write'];

const obsAllowedUri = ['Everyone'];

const v2AllowedUri = ['http://acs.amazonaws.com/groups/global/AllUsers', 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers', 'http://acs.amazonaws.com/groups/s3/LogDelivery'];

const obsAllowedEvent = ['ObjectCreated:*', 'ObjectCreated:Put', 'ObjectCreated:Post', 'ObjectCreated:Copy', 
    'ObjectCreated:CompleteMultipartUpload', 'ObjectRemoved:*', 'ObjectRemoved:Delete', 'ObjectRemoved:DeleteMarkerCreated'];
const v2AllowedEvent = ['s3:ObjectCreated:*', 's3:ObjectCreated:Put', 's3:ObjectCreated:Post', 's3:ObjectCreated:Copy', 
    's3:ObjectCreated:CompleteMultipartUpload', 's3:ObjectRemoved:*', 's3:ObjectRemoved:Delete', 's3:ObjectRemoved:DeleteMarkerCreated'];

const negotiateMethod = 'HeadApiVersion';

const obsSignatureContext = {
	signature :	'obs',
	headerPrefix : 'x-obs-',
	headerMetaPrefix : 'x-obs-meta-',
	authPrefix : 'OBS'
};

const v2SignatureContext = {
	signature :	'v2',
	headerPrefix : 'x-amz-',
	headerMetaPrefix : 'x-amz-meta-',
	authPrefix : 'AWS'
};

const bucketEventEmitters = {
		
};

function encodeURIWithSafe(str, safe, skipEncoding){
	str = String(str);
	if(str.length === 0){
		return '';
	}
	if(skipEncoding){
		return str;
	}
	let ret;
	if(safe){
		ret = [];
		for(let i=0;i<str.length;i++){
			ret.push(safe.indexOf(str[i]) >=0 ? str[i] : encodeURIComponent(str[i]));
		}
		ret = ret.join('');
	}else{
		ret = encodeURIComponent(str);
	}
	return ret.replace(/!/g, '%21')
			  .replace(/~/g,'%7E')
			  .replace(/\*/g, '%2A')
			  .replace(/'/g, '%27')
			  .replace(/\(/g, '%28')
			  .replace(/\)/g, '%29');
}

function headerTostring(obj){
	return JSON ? JSON.stringify(obj) : '';
}

function parseObjectFromHeaders(sentAs, headers){
	var metadata = {};
	for(let key in headers){
		let k = String(key).toLowerCase();
		if(k.indexOf(sentAs) === 0){
			metadata[k.slice(sentAs.length)] = headers[key];
		}
	}
	return metadata;
}

function mkdirsSync(dirname){
    if(fs.existsSync(dirname)){
        return true;
    }
    if(mkdirsSync(pathLib.dirname(dirname))){
        fs.mkdirSync(dirname);
        return true;
    }
    return false
}

function isArray(obj){
	return Object.prototype.toString.call(obj) === '[object Array]';
}

function isObject(obj){
	return Object.prototype.toString.call(obj) === '[object Object]';
}

function utcToLocaleString(utcDate){
	return utcDate ? new Date(Date.parse(utcDate)).toLocaleString() : '';
}

function makeObjFromXml(xml, bc){
	xml2js.parseString(xml, {explicitArray:false, ignoreAttrs:true}, function(err, result){
		if(err){
			bc(err, null);
			return;
		}
		bc(null, result);
	});
}


function getExpireDate(utcDateStr){
	var date = new Date(Date.parse(utcDateStr));
	var hour = date.getUTCHours();
	var min = date.getUTCMinutes();
	var sec = date.getUTCSeconds();
	var day = date.getUTCDate();
	var moth = date.getUTCMonth() + 1;
	var year = date.getUTCFullYear();
	var shortDate = '';
	var longDate = '';
	var expireDate = '';
	expireDate += year + '-';
	
	if(moth < 10){
		expireDate += '0';
	}
	expireDate += moth + '-';
	
	if(day < 10){
		expireDate += '0';
	}
	expireDate += day + 'T';
	
	if(hour < 10){
		expireDate += '0';
	}
	expireDate += hour + ':';
	
	if(min < 10){
		expireDate += '0';
	}
	expireDate += min + ':';
	
	if(sec < 10){
		expireDate += '0';
	}
	expireDate += sec + 'Z';
	return expireDate;
}

function getDates(utcDateStr){
	var date = new Date(Date.parse(utcDateStr));
	var hour = date.getUTCHours();
	var min = date.getUTCMinutes();
	var sec = date.getUTCSeconds();
	var day = date.getUTCDate();
	var moth = date.getUTCMonth() + 1;
	var year = date.getUTCFullYear();
	var shortDate = '';
	var longDate = '';
	shortDate += year;
	
	if(moth < 10){
		shortDate += '0';
	}
	shortDate += moth;
	
	if(day < 10){
		shortDate += '0';
	}
	shortDate += day;
	
	longDate += shortDate + 'T';
	if(hour < 10){
		longDate += '0';
	}
	longDate +=  hour;
	
	if(min < 10){
		longDate += '0';
	}
	longDate +=  min;
	
	if(sec < 10){
		longDate += '0';
	}
	longDate +=  sec + 'Z';
	return [shortDate, longDate];
}

function getSignedAndCanonicalHeaders(header){
	var arrheadKey = [];
	var arrhead = {};
	for(let key in header){
		arrheadKey.push(key.toLowerCase());
		arrhead[key.toLowerCase()] = header[key];
	}
	arrheadKey = arrheadKey.sort();
	var signedHeaders = '';
	var canonicalHeaders = '';
	for(let i = 0; i < arrheadKey.length; i++){
		if(i !== 0){
			signedHeaders += ';';
		}
		signedHeaders += arrheadKey[i];
		canonicalHeaders +=  arrheadKey[i] + ':' + arrhead[arrheadKey[i]] + '\n';
	}
	return [signedHeaders, canonicalHeaders];
}

function createV4Signature(shortDate, sk, region, stringToSign){
	var dateKey = crypto.createHmac('sha256', 'AWS4' + sk).update(shortDate).digest();
	var dateRegionKey = crypto.createHmac('sha256', dateKey).update(region).digest();
	var dateRegionServiceKey = crypto.createHmac('sha256', dateRegionKey).update('s3').digest();
	var signingKey = crypto.createHmac('sha256',dateRegionServiceKey).update('aws4_request').digest();
	return crypto.createHmac('sha256',signingKey).update(stringToSign).digest('hex');
}

function getV4Signature(shortDate, longDate, sk, region, canonicalRequest){
	var scop = shortDate + '/' + region + '/s3/aws4_request';
	var stringToSign = 'AWS4-HMAC-SHA256' + '\n';
	stringToSign += longDate + '\n';
	stringToSign += scop + '\n';
	stringToSign += crypto.createHash('sha256').update(canonicalRequest).digest('hex');
	return createV4Signature(shortDate, sk, region, stringToSign);
}

function Utils(logger) {
	this.log = logger;
	this.ak = null;
	this.sk = null;
	this.securityToken = null;
	this.isSecure = true; 
	this.server = null;
	this.pathStyle = false;
	this.signatureContext = null;
	this.isSignatureNegotiation = true;
	this.bucketSignatureCache = {};
	this.region = 'region';
	this.port = null;
	this.maxRetryCount = 3;
	this.timeout = 60;
	this.sslVerify = false;
	this.httpAgent = false;
	this.httpsAgent = false;
	this.obsSdkVersion = OBS_SDK_VERSION;
	this.isCname = false;
}

Utils.prototype.encodeURIWithSafe = encodeURIWithSafe;

Utils.prototype.mimeTypes = mimeTypes;

Utils.prototype.close = function(){
	if(this.httpAgent){
		this.httpAgent.destroy();
	}
	if(this.httpsAgent){
		this.httpsAgent.destroy();
	}
};

Utils.prototype.refresh = function(ak, sk, securityToken){
	this.ak = ak ? String(ak).trim() : null;
	this.sk = sk ? String(sk).trim(): null;
	this.securityToken = securityToken ? String(securityToken).trim() : null;
};

Utils.prototype.initFactory = function(ak, sk, isSecure,
		server, pathStyle, signature, region, port, maxRetryCount, timeout, sslVerify, longConnection, securityToken, isSignatureNegotiation, isCname){
	
	this.refresh(ak, sk, securityToken);
	
	if (!server) {
		throw new Error('Server is not set');
	}
	server = String(server).trim();
	
	if(server.indexOf('https://') === 0){
		server = server.slice('https://'.length);
		isSecure = true;
	}else if(server.indexOf('http://') === 0){
		server = server.slice('http://'.length);
		isSecure = false;
	}
	
	let index = server.lastIndexOf('/');
	while(index >= 0){
		server = server.slice(0, index);
		index = server.lastIndexOf('/');
	}
	
	index = server.indexOf(':');
	if(index >= 0){
		port = server.slice(index + 1);
		server = server.slice(0, index);
	}
	this.server = server;
	
	if(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(this.server)){
		pathStyle = true;
	}
	
	if (isSecure !== undefined) {
		this.isSecure = Boolean(isSecure);				
	}
	if (pathStyle !== undefined) {
		this.pathStyle = Boolean(pathStyle);				
	}
	
	if (signature !== undefined) {
		signature = String(signature).trim().toLowerCase();			
	}else{
		signature = 'obs';
	}
	
	if(isSignatureNegotiation !== undefined){
		this.isSignatureNegotiation = Boolean(isSignatureNegotiation);
	}

	this.isCname = isCname;
	
	if(this.pathStyle || this.isCname){
		this.isSignatureNegotiation = false;
		if(signature === 'obs'){
			signature = 'v2';
		}
	}
	
	this.signatureContext = signature === 'obs' ? obsSignatureContext : v2SignatureContext;
	
	if(region !== undefined){
		this.region = String(region).trim();
	}
	
	this.port = port ? parseInt(port) : (this.isSecure ? 443 : 80);
	
	if(maxRetryCount !== undefined){
		this.maxRetryCount = parseInt(maxRetryCount);
	}
	
	if(timeout !== undefined){
		this.timeout = parseInt(timeout);
	}
	
	if(sslVerify !== undefined){
		this.sslVerify = sslVerify;
	}
	
	if(longConnection !== undefined && Number(longConnection) >= 0){
		this.httpAgent = new httpLib.Agent({keepAlive : true, keepAliveMsecs : Number(longConnection) * 1000});
		this.httpsAgent = new httpsLib.Agent({keepAlive : true, keepAliveMsecs : Number(longConnection) * 1000});
	}
	
};

Utils.prototype.SseKmsAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value);
	let index = value.indexOf('aws:');
	if(signatureContext.signature === 'obs'){
		return index === 0 ? value.slice(4) : value;
	}
	return index === 0 ? value : 'aws:' + value;
};

Utils.prototype.BucketAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value);
	let index = value.indexOf('arn:aws:s3:::');
	if(signatureContext.signature === 'obs'){
		return index === 0 ? value.slice('arn:aws:s3:::'.length) : value;
	}
	return index === 0 ? value : 'arn:aws:s3:::' + value;
};


Utils.prototype.EventAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value);
	if(signatureContext.signature === 'obs'){
		if(obsAllowedEvent.indexOf(value) >= 0){
			return value;
		}
		if(v2AllowedEvent.indexOf(value) >= 0){
			return value.substring(3);
		}
		return '';
	}
	if(v2AllowedEvent.indexOf(value) >= 0){
		return value;
	}
	if(obsAllowedEvent.indexOf(value) >= 0){
		return 's3:' + value;
	}
	return '';
};

Utils.prototype.URIAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value);
	if(signatureContext.signature === 'obs'){
		if(obsAllowedUri.indexOf(value) >= 0){
			return value;
		}
		if(value === 'AllUsers' || value === 'http://acs.amazonaws.com/groups/global/AllUsers'){
			return 'Everyone';
		}
		
		return '';
		
	}
	if(v2AllowedUri.indexOf(value) >= 0){
		return value; 
	}
	if(value === 'Everyone' || value === 'AllUsers'){
		return 'http://acs.amazonaws.com/groups/global/AllUsers';
	}
	if(value === 'AuthenticatedUsers'){
		return 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers';
	}
	if(value === 'LogDelivery'){
		return 'http://acs.amazonaws.com/groups/s3/LogDelivery';
	}
	return '';
};


Utils.prototype.StorageClassAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value).toUpperCase();
	if(signatureContext.signature === 'obs'){
		if(obsAllowedStorageClass.indexOf(value) >= 0){
			return value;
		}
		if(value === 'STANDARD_IA'){
			return 'WARM';
		}
		if(value === 'GLACIER'){
			return 'COLD';
		}
		return '';
	}
	
	if(v2AllowedStorageClass.indexOf(value) >= 0){
		return value; 
	}
	if(value === 'WARM'){
		return 'STANDARD_IA';
	}
	if(value === 'COLD'){
		return 'GLACIER';
	}
	return '';
};

Utils.prototype.ACLAdapter = function(value, signatureContext){
	value = value || '';
	value = String(value).toLowerCase();
	if(signatureContext.signature === 'obs'){
		if(obsAllowedAcl.indexOf(value) >= 0){
			return value;
		}
		
		return '';
	}
	
	if(value === 'public-read-delivered'){
		value = 'public-read';
	}else if(value === 'public-read-write-delivered'){
		value = 'public-read-write';
	}
	
	if(v2AllowedAcl.indexOf(value) >= 0){
		return value;
	}
	return '';
};

Utils.prototype.doExec = function(funcName, param, callback){
	var opt = this.makeParam(funcName, param);
	if('err' in opt){
		return callback(opt.err, null);
	}
	this.sendRequest(funcName, opt, callback);
};

Utils.prototype.doNegotiation = function(funcName, param, callback, checkBucket, checkCache, setCache){
	let o = null;
	let that = this;
	if(checkCache && param.Bucket){
		o = bucketEventEmitters[param.Bucket];
		if(!o){
			o = {
				e : new events.EventEmitter(),
				s : 0,
			}
			bucketEventEmitters[param.Bucket] = o;
		}
		let item = that.bucketSignatureCache[param.Bucket];
		if(item && item.signatureContext && item.expireTime > new Date().getTime()){
			param.signatureContext = item.signatureContext;
			var opt = that.makeParam(funcName, param);
			if('err' in opt){
				return callback(opt.err, null);
			}
			opt.signatureContext = item.signatureContext;
			return that.sendRequest(funcName, opt, callback);
		}
		if(o.s){
			o.e.once('done', () => {
				that.doNegotiation(funcName, param, callback, checkBucket, checkCache, setCache);
			});
			return;
		}
		o.s = 1;
	}
	this.doExec(negotiateMethod, checkBucket ? {Bucket:param.Bucket} : {},  function(err, result){
		if(err){
			callback(err, null);
			if(o){
				o.e.emit('done');
				o.s = 0;
			}
			return;
		}
		if((checkBucket && result.CommonMsg.Status === 404) || result.CommonMsg.Status >= 500){
			callback(err, result);
			if(o){
				o.e.emit('done');
				o.s = 0;
			}
			return;
		}
		
		var signatureContext = v2SignatureContext;
		if(result.CommonMsg.Status < 300 && result.InterfaceResult && result.InterfaceResult.ApiVersion >= '3.0'){
			signatureContext = obsSignatureContext;
		}
		if(setCache){
			that.bucketSignatureCache[param.Bucket] = {
				signatureContext : signatureContext,
				expireTime : new Date().getTime() + 15 + (Math.ceil(Math.random()*5)) * 60 * 1000
			};
		}
		if(o){
			o.e.emit('done');
			o.s = 0;
		}
		param.signatureContext = signatureContext;
		var opt = that.makeParam(funcName, param);
		if('err' in opt){
			return callback(opt.err, null);
		}
		opt.signatureContext = signatureContext;
		that.sendRequest(funcName, opt, callback);
	});
};

Utils.prototype.exec = function(funcName, param, callback){
	if(this.isSignatureNegotiation && funcName !== negotiateMethod){
		if(funcName === 'ListBuckets'){
			this.doNegotiation(funcName, param, callback, false, false, false);
		}else if(funcName === 'CreateBucket'){
			this.doNegotiation(funcName, param, callback, false, true, false);
		}else{
			this.doNegotiation(funcName, param, callback, true, true, true);
		}
		return;
	}
	this.doExec(funcName, param, callback);
};


Utils.prototype.toXml = function(mXml, xmlMeta, root, sentAs){
	var xml = ''; 
	if(root !== null){
		xml += this.buildXml(mXml, xmlMeta, root, sentAs);
		return xml;
	}
	for (let key in xmlMeta){
		if(key in mXml){
			let meta = xmlMeta[key];
			xml += this.buildXml(mXml, meta, key, meta.sentAs || key);
		}
	}
	return xml;
};

Utils.prototype.buildXml = function(mXml, xmlMeta, key, sentAs){
	var xml = '';
	let type = xmlMeta.type;
	if(type === 'array'){
		for(let i = 0; i < mXml[key].length; i++){
			if(xmlMeta.items.type === 'object'){
				let result = this.toXml(mXml[key][i], xmlMeta.items.parameters, null);
				if(result !== ''){
					xml += '<' + sentAs + '>'+ result + '</' + sentAs + '>';
				}
			}else if(xmlMeta.items.type === 'adapter'){
				xml += '<' + sentAs + '>' + String(this[key + 'Adapter'](mXml[key][i])).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '</' + sentAs + '>';
			}else if(xmlMeta.items.type !== 'array'){
				xml += '<' + sentAs + '>'+ String(mXml[key][i]).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '</' + sentAs +'>';
			}
		}
	}else if(type === 'object'){
		let result = this.toXml(mXml[key], xmlMeta.parameters, null);
		if(result !== ''){
			xml += '<' + sentAs;
			if('data' in xmlMeta){
				if('xsiNamespace' in xmlMeta.data){
					xml += ' xmlns:xsi="' +  xmlMeta.data.xsiNamespace + '"';
				}
				if('xsiType' in xmlMeta.data){
					xml += ' xsi:type="' + mXml[key][xmlMeta.data.xsiType] + '"';
				}
			}
			xml += '>';
			xml += result + '</' + sentAs + '>';
		}
		
	}else if(type === 'adapter'){
		xml += '<' + sentAs + '>' + String(this[key + 'Adapter'](mXml[key])).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '</' + sentAs + '>';
	}else if(type !== 'ignore'){
		xml += '<' + sentAs + '>' + String(mXml[key]).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '</' + sentAs + '>';
	}
	if(xml && xmlMeta.wrapper){
		let _wrapper = xmlMeta.wrapper;
		xml = '<' + _wrapper + '>' + xml + '</' + _wrapper + '>';
	}
	return xml;
};



Utils.prototype.jsonToObject = function(model, obj, root){
	var opt = {};
	if(root !== null){
		this.buildObject(model, obj, root, opt);
	}else{
		for(let key in model){
			this.buildObject(model, obj, key, opt);
		}
	}
	return opt;
};

Utils.prototype.buildObject = function(model, obj, key, opt){
	if(isObject(obj)){
		let flag = true;
		let wrapper = model[key].wrapper;
		if(wrapper && wrapper in obj){
			obj = obj[wrapper];
			flag = isObject(obj);
		}
		if(flag){
			let sentAs = model[key].sentAs || key;
			if(sentAs in obj){
				if(model[key].type === 'object'){
					opt[key] = this.jsonToObject(model[key].parameters, obj[sentAs], null);
				}else if(model[key].type === 'array'){
					let arr = [];
					if(!isArray(obj[sentAs])){
						arr[0] = model[key].items.type === 'object' ? this.jsonToObject(model[key].items.parameters, obj[sentAs], null) : obj[sentAs];
					}else{
						for (let i = 0; i < obj[sentAs].length; i++ ){
							arr[i] = model[key].items.type === 'object' ? this.jsonToObject(model[key].items.parameters, obj[sentAs][i], null) : obj[sentAs][i];
						}
					}
					opt[key] = arr;
				}else if(model[key].type === 'date'){
					opt[key] = utcToLocaleString(obj[sentAs]);
				}else{
					opt[key] = obj[sentAs];
				}
			}
		}
	}
	
	if(opt[key] === undefined){
		if(model[key].type === 'object'){
			opt[key] = model[key].parameters ? this.jsonToObject(model[key].parameters, null, null) : {};
		}else if(model[key].type === 'array'){
			opt[key] = [];
		}else{
			opt[key] = '';
		}
	}
};

Utils.prototype.makeParam = function(methodName, param){
	var signatureContext = param.signatureContext || this.signatureContext;
	var model = signatureContext.signature === 'obs' ? obsModel[methodName] : v2Model[methodName];
	var method = model.httpMethod;
	var uri = '/';
	var urlPath = '';
	var xml = '';
	var exheaders = {};
	var opt = {};
	
	if ('urlPath' in model){
		urlPath += '?';
		urlPath += model.urlPath;
	}
	for (let key in model.parameters){
		let meta = model.parameters[key];
		if(key === 'Bucket' && this.isCname){
			continue;
		}
		if (meta.required && !(key in param)){
			opt.err = key + ' is a required element!';
			if(this.log.isLevelEnabled('warn')){
				this.log.runLog('warn', methodName, opt.err);
			}
			return opt;
		}
		
		if(param[key] !== null && param[key] !== undefined){
			
			if(meta.type === 'srcFile' || meta.type === 'dstFile'){
				opt[meta.type] = param[key];
				continue;
			}
			
			if(meta.type === 'plain'){
				opt[key] = param[key];
			}
			
			let sentAs = meta.sentAs || key;
			
			if(meta.withPrefix){
				sentAs = signatureContext.headerPrefix + sentAs;
			}
			
			if(meta.location === 'uri'){
				if(uri !== '/'){
					uri += '/';
				}
				uri += param[key];
			}else if(meta.location === 'header'){
				let safe = meta.encodingSafe || ' ;/?:@&=+$,';
				if(meta.type === 'object'){
					if(signatureContext.headerMetaPrefix === sentAs){
						for(let item in param[key]){
							let value = param[key][item];
							item = String(item).trim().toLowerCase();
							exheaders[item.indexOf(sentAs) === 0 ? item: sentAs + item] = encodeURIWithSafe(value, safe);
						}
					}
				}else if(meta.type === 'array'){
					let arr = [];
					for(let i=0;i<param[key].length;i++){
						arr.push(encodeURIWithSafe(param[key][i], safe));
					}
					exheaders[sentAs] = arr;
				}else if(meta.type === 'password'){
					exheaders[sentAs] = Buffer.from(param[key],'utf8').toString('base64');
					let pwdSentAs = sentAs + '-MD5';
					exheaders[pwdSentAs] = this.bufMD5(param[key]);
				}else if(meta.type === 'number' && Number(param[key])){
					exheaders[sentAs] = encodeURIWithSafe(String(param[key]), safe);
				}else if(meta.type === 'boolean'){
					exheaders[sentAs] = encodeURIWithSafe(param[key] ? 'true' : 'false', safe);
				}else if(meta.type === 'adapter'){
					let val = this[key + 'Adapter'](param[key], signatureContext);
					if(val){
						exheaders[sentAs] = encodeURIWithSafe(String(val), safe);
					}
				}else {
					exheaders[sentAs] = encodeURIWithSafe(String(param[key]), safe, meta.skipEncoding);
				}
			}else if(meta.location === 'urlPath'){
				let sep = urlPath === '' ? '?' : '&';
				let value = param[key];
				if(meta.type !== 'number' || (meta.type === 'number' && Number(value) >= 0)){
					urlPath += sep + encodeURIWithSafe(sentAs, '/') + '=' + encodeURIWithSafe(String(value), '/');
				}
			}else if(meta.location === 'xml'){
				let mxml = this.toXml(param, meta, key, sentAs);
				if(mxml){
					xml += mxml;
				}
			}else if(meta.location === 'body'){
				xml = param[key];
			}		
		}
	}
	
	if('data' in model && 'xmlRoot' in model.data){
		if(xml || model.data.xmlAllowEmpty){
			let xmlRoot = model.data.xmlRoot;
			xml = '<' + xmlRoot + '>' + xml + '</' + xmlRoot + '>';
		}
	}
	
	exheaders.Host = this.server;
	if(!this.pathStyle && !this.isCname){
		let uriList = uri.split('/');
		if(uriList.length >= 2 && uriList[1]){
			exheaders.Host = uriList[1] + '.' + exheaders.Host;
			let requestUri = uri.replace(uriList[1], '');
			if(requestUri.indexOf('//') === 0){
				requestUri = requestUri.slice(1);
			}
			
			if(signatureContext.signature === 'v4'){
				uri = requestUri;
			}else if(requestUri === '/'){
				uri += '/';
			}
			opt.requestUri = encodeURIWithSafe(requestUri, '/');
		}
	}
	
	opt.method = method;
	opt.uri = encodeURIWithSafe(uri, '/');
	opt.urlPath = urlPath;
	if(xml){
		if(!(xml instanceof streamLib.Readable)){
			let body = Buffer.from(String(xml), 'utf8');
			if(model.data && model.data.md5){
				exheaders['Content-MD5'] = this.bufMD5(body);
			}
			exheaders['Content-Length'] = body.length === 0 ? '0' : String(body.length);
		}
		opt.xml = xml;
		if(this.log.isLevelEnabled('debug')){
			this.log.runLog('debug', methodName, 'request content:' + xml);
		}
	}
	opt.headers = exheaders;
	
	if('srcFile' in opt){
		if (!fs.existsSync(opt.srcFile)) {
			opt.err = 'the file [' + opt.srcFile + '] is not exist!';
			if(this.log.isLevelEnabled('error')){
				this.log.runLog('error', methodName, opt.err);
			}
			return opt;
		}
		
		let fileSize = fs.statSync(opt.srcFile).size;
		if ('Content-Length' in opt.headers || 'PartSize' in opt || 'Offset' in opt) {
			let offset = opt.Offset;
			offset = (offset && offset >= 0 && offset < fileSize) ? offset : 0;
			let partSize;
			if('PartSize' in opt){
				partSize = opt.PartSize;
			}else if('Content-Length' in opt.headers){
				partSize = parseInt(opt.headers['Content-Length']);
			}else{
				partSize = fileSize;
			}
			partSize = (partSize && partSize > 0 && partSize <= fileSize - offset) ? partSize : fileSize - offset;
			opt.PartSize = partSize;
			opt.Offset = offset;
			opt.headers['Content-Length'] = String(opt.PartSize);
		}
	}

	return opt;
};

Utils.prototype.sendRequest = function(funcName, opt, backcall, count){
	if(count === undefined){
		count = 1;
	}
	let that = this;
	let readable = opt.xml instanceof streamLib.Readable;
	that.makeRequest(funcName, opt, function(err, msg){
		if(err && !readable && msg !== 'PREMATURE_END' && msg !== 'SELF_SIGNED_CERT_IN_CHAIN' && msg !== 'DEPTH_ZERO_SELF_SIGNED_CERT' && count <= that.maxRetryCount){
			that.sendRequest(funcName, opt, backcall, count + 1);
			return;
		} 
		if(err === 'redirect' && !readable && msg){
			let uri = urlLib.parse(msg);
			opt.headers.Host = uri.hostname;
			opt.protocol = uri.protocol;
			opt.port = uri.port || ((opt.protocol && opt.protocol.toLowerCase().indexOf('https') === 0) ? 443 : 80);
			that.sendRequest(funcName, opt, backcall);
			return;
		}
		backcall(err, msg);
	});
};

Utils.prototype.doAuth = function(opt, methodName, signatureContext) {
	var interestHeader = ['Content-MD5', 'Content-Type', 'Date'];
	var log = this.log;
	var stringToSign = opt.method + '\n';
	for(let i=0;i<interestHeader.length;i++){
		if(interestHeader[i] in opt.headers){
			stringToSign += opt.headers[interestHeader[i]];
		}
		stringToSign += '\n';
	}
	
	var temp = [];
	for(let key in opt.headers){
		if (key.toLowerCase().indexOf(signatureContext.headerPrefix) === 0){
			temp.push(key.toLowerCase());
		}
	}
	temp = temp.sort();
	for(let i=0;i<temp.length;i++){
		let key = temp[i];
		let val = key.indexOf(signatureContext.headerMetaPrefix) === 0 ? opt.headers[key].trim() : opt.headers[key];
		stringToSign += key + ':' + val + '\n';
	}
	var path = opt.uri;
	if(this.isCname){
		if(path === '/'){
			path += opt.headers.Host + '/';
		}else if(path.indexOf('/') === 0){
			path = '/' + opt.headers.Host + path;
		}
	}
	if(opt.urlPath){
		let _path = opt.urlPath.slice(1);
		let arrPath = _path.split('&').sort();
		let urlPath = '';
		for(let i=0;i<arrPath.length;i++){
			let listvar = arrPath[i].split('=');
			let key = decodeURIComponent(listvar[0]);
			if(allowedResourceParameterNames.indexOf(key.toLowerCase()) >= 0){
				urlPath += urlPath === '' ?  '?' : '&';
				urlPath += key;
				if(listvar.length === 2 && listvar[1]){
					urlPath += '=' + decodeURIComponent(listvar[1]);
				}
			}
		}
		path += urlPath;
	}
	stringToSign += path;
	if(log.isLevelEnabled('debug')){
		log.runLog('debug',methodName, 'stringToSign:' + stringToSign);
	}
	opt.headers.Authorization = signatureContext.authPrefix + ' ' + this.ak + ':' + crypto.createHmac('sha1', this.sk).update(stringToSign).digest('base64');
};

Utils.prototype.v4Auth = function(opt, methodName, signatureContext){
	opt.headers[signatureContext.headerPrefix + 'content-sha256'] = CONTENT_SHA256;
	var header = opt.headers;
	var log = this.log;
	var shortDate = null;
	var longDate = null;
	
	if(signatureContext.headerPrefix + 'date' in header){
		longDate = header[signatureContext.headerPrefix + 'date'];
		shortDate = longDate.slice(0, longDate.indexOf('T'));
	}else{
		let dates = getDates(header.Date);
		shortDate = dates[0];
		longDate = dates[1];
	}
	
	var credential = this.ak + '/' + shortDate + '/' + this.region + '/s3/aws4_request';
	
	var signedAndCanonicalHeaders = getSignedAndCanonicalHeaders(header);
	
	var signedHeaders = signedAndCanonicalHeaders[0];
	var canonicalHeaders = signedAndCanonicalHeaders[1];
	
	var canonicalQueryString = '';
	if(opt.urlPath){
		let path = opt.urlPath.slice(1);
		let arrPath = path.split('&').sort();
		for(let i=0;i<arrPath.length;i++){
			canonicalQueryString += arrPath[i];
			if(arrPath[i].indexOf('=') === -1){
				canonicalQueryString += '=';
			}
			if(i !== arrPath.length -1){
				canonicalQueryString += '&';
			}
		}
	}
	var canonicalRequest = opt.method + '\n';
	canonicalRequest += opt.uri +  '\n';
	canonicalRequest += canonicalQueryString + '\n';
	canonicalRequest +=  canonicalHeaders + '\n';
	canonicalRequest += signedHeaders + '\n';
	canonicalRequest += CONTENT_SHA256;
	
	if(log.isLevelEnabled('debug')){
		log.runLog('debug',methodName, 'canonicalRequest:' + canonicalRequest);
	}
	var signature = getV4Signature(shortDate, longDate, this.sk, this.region, canonicalRequest);
	
	opt.headers.Authorization = 'AWS4-HMAC-SHA256 ' + 'Credential=' + credential + ',' + 'SignedHeaders=' + signedHeaders + ',' + 'Signature=' + signature;
};

Utils.prototype.parseCommonHeaders = function(opt, headers, signatureContext){
	for(let key in commonHeaders){
		opt.InterfaceResult[commonHeaders[key]] = headers[key];
	}
	opt.InterfaceResult.RequestId = headers[signatureContext.headerPrefix + 'request-id'];
	opt.InterfaceResult.Id2 = headers[signatureContext.headerPrefix + 'id-2'];
};

Utils.prototype.contrustCommonMsg = function(opt, obj, headers, methodName, signatureContext){
	opt.InterfaceResult = {};
	var log = this.log;
	this.parseCommonHeaders(opt, headers, signatureContext);
	
	if(log.isLevelEnabled('info')){
		log.runLog('info', methodName, 'request finished with request id:' + opt.InterfaceResult.RequestId);
	}
	for (let key in obj){
		if(obj[key].location !== 'header'){
			continue
		}
		let sentAs = obj[key].sentAs || key;
		
		if(obj[key].withPrefix){
			sentAs = signatureContext.headerPrefix + sentAs;
		}
		
		if(obj[key].type === 'object'){
			opt.InterfaceResult[key] = parseObjectFromHeaders(sentAs, headers);
			continue;
		}
		let val = headers[sentAs];
		if(val === undefined){
			val = headers[sentAs.toLowerCase()];
		}
		if(val !== undefined){
			opt.InterfaceResult[key] = val;
		}
	}
};

Utils.prototype.getRequest = function(methodName, serverback, dstFile, bc, saveAsStream, readable, signatureContext){
	var opt = {};
	var log = this.log;
	var model = signatureContext.signature === 'obs' ? obsModel[methodName + 'Output'] : v2Model[methodName + 'Output'];
	model = model || {};
	var obj = model.parameters || {};
	opt.CommonMsg = {
		Status : serverback.statusCode,
		Code : '',
		Message : '',
		HostId : '',
		RequestId : '',
		InterfaceResult : null
	};
	var headers = serverback.headers;
	if(log.isLevelEnabled('info')){
		log.runLog('info', methodName, 'get response start, statusCode:' + serverback.statusCode);
	}
	if(log.isLevelEnabled('debug')){
		log.runLog('debug', methodName, 'response msg :' + 'statusCode:' + serverback.statusCode + ', headers:' + headerTostring(headers));
	}
	
	var doLog = function(){
		if(log.isLevelEnabled('debug')){
			let logMsg = 'Status:' + opt.CommonMsg.Status + ', Code:' + opt.CommonMsg.Code + ', Message:' + opt.CommonMsg.Message;
			log.runLog('debug', methodName, 'exec interface ' + methodName + ' finish, ' + logMsg);
		}
		bc(null,opt);
	};
	var that = this;
	if(serverback.statusCode >= 300 && serverback.statusCode < 400 && serverback.statusCode !== 304 && !readable){
		let location = headers.location || headers.Location;
		if(location){
			if(log.isLevelEnabled('warn')){
				let err = 'http code is 3xx, need to redirect to ' + location;
				log.runLog('warn', methodName, err);
			}
			return bc('redirect', location);
		}
		let err = 'get redirect code 3xx, but no location in headers';
		if(log.isLevelEnabled('error')){
			log.runLog('error', methodName, err);
		}
		return bc(err, null);
	} 
	
	if(serverback.statusCode < 300){
		if(dstFile){
			let fileDir = pathLib.dirname(dstFile);
			if(!mkdirsSync(fileDir)){
				return bc('failed to create file:' + dstFile, null);
			}
			let stream = fs.createWriteStream(dstFile);
			stream.on('close', function(){
				if(opt.InterfaceResult && opt.InterfaceResult.ContentLength !== undefined && fs.existsSync(dstFile)){
					let fstat = fs.statSync(dstFile);
					if(fstat.size !== parseInt(opt.InterfaceResult.ContentLength)){
						return bc('premature end of Content-Length delimiter message body (expected:' + opt.InterfaceResult.ContentLength + '; received:' + fstat.size + ')', 'PREMATURE_END');
					}
				}
				doLog();
			}).on('error', function(err){
				if(log.isLevelEnabled('error')){
					log.runLog('error', methodName, 'get response stream error [' + headerTostring(err) + ']');
				}
				bc(err, null);
			});
			
			serverback.on('error', function(err){
				stream.end();
				if(log.isLevelEnabled('error')){
					log.runLog('error', methodName, 'get response stream error [' + headerTostring(err) + ']');
				}
				bc(err, null);
			}).on('end', function(){
				stream.end();
				that.contrustCommonMsg(opt, obj, headers, methodName, signatureContext);
				if(log.isLevelEnabled('debug')){
					log.runLog('debug', methodName, 'exec interface ' + methodName + ' finish, Status:' + opt['CommonMsg']['Status'] + ', Code: ,Message: ');
				}
			}).pipe(stream);
			return;
		}
		if(('data' in model) && saveAsStream){
			that.contrustCommonMsg(opt, obj, headers, methodName, signatureContext);
			if(log.isLevelEnabled('debug')){
				let respMsg = 'Status: ' + opt.CommonMsg.Status + ', headers: ' +  headerTostring(headers);
				log.runLog('debug', methodName, respMsg);
			}
			
			for (let key in obj){
				if(obj[key].location === 'body'){
					let _serverback = Object.create(serverback);
					if(opt.InterfaceResult && opt.InterfaceResult.ContentLength !== undefined){
						let contentLength = parseInt(opt.InterfaceResult.ContentLength);
						_serverback.$readedCount = 0;
						_serverback.$expectedCount = contentLength;
						_serverback.on('end', function(){
							let expectedCount = serverback.$expectedCount;
							let readedCount = serverback.$readedCount;
							delete serverback.$readedCount;
							delete serverback.$expectedCount;
							if(expectedCount !== readedCount){
								throw new Error('premature end of Content-Length delimiter message body (expected:' + expectedCount + '; received:' + readedCount + ')');
							}
						});
					}
					_serverback._read = function(size){
						_serverback.$readedCount += size;
						return serverback._read(size);
					};
					opt.InterfaceResult[key] = _serverback;
					break;
				}
			}
			return doLog();
		}
		let body = [];
		serverback.on('data', function(data) {
			body.push(data);
		}).on('error', function(err){
			if(log.isLevelEnabled('error')){
				log.runLog('error', methodName, 'get response stream error [' + headerTostring(err) + ']');
			}
			bc(err, null);
		}).on('end', function() {
			that.contrustCommonMsg(opt, obj, headers, methodName, signatureContext);
			body = Buffer.concat(body);
			
			if(log.isLevelEnabled('debug')){
				let respMsg = 'Status: ' + opt.CommonMsg.Status + ', headers: ' +  headerTostring(headers);
				if(body){
					respMsg += 'body length: ' + body.length;
					log.runLog('debug', methodName, 'response body length:' + body.length);
				}
				log.runLog('debug', methodName, respMsg);
			}
			
			if(body && ('data' in model)){
				if(model.data.type === 'xml'){
					makeObjFromXml(body, function(err,result){
						if(err){
							if(log.isLevelEnabled('error')){
								log.runLog('error', methodName, 'change xml to json err [' + headerTostring(err) + ']' );
							}
							return bc(err, null);
						}
						let tempResult = result;
						if(model.data.xmlRoot && (model.data.xmlRoot in tempResult)){
							tempResult = result[model.data.xmlRoot];
						}
						if(isObject(tempResult)){
							for (let key in obj){
								if(obj[key].location === 'xml'){
									opt.InterfaceResult[key] = that.jsonToObject(obj, tempResult, key)[key];
								}
							}
						}
					});
				}else if(model.data.type === 'body'){
					for (let key in obj){
						if(obj[key].location === 'body'){
							opt.InterfaceResult[key] = body;
							break;
						}
					}
				}
			}
			doLog();
		});
		return;
	}
	
	opt.CommonMsg.RequestId = headers[signatureContext.headerPrefix + 'request-id'];
	if(log.isLevelEnabled('error')){
		log.runLog('error', methodName, 'request error with http status code:' + serverback.statusCode);
	}
	
	if(log.isLevelEnabled('info')){
		log.runLog('info', methodName, 'request finished with request id:' + opt.CommonMsg.RequestId);
	}
	let body = [];
	serverback.on('data', function(data) {
		body.push(data);
	}).on('error', function(err){
		if(log.isLevelEnabled('error')){
			log.runLog('error', methodName, 'get response stream error [' + headerTostring(err) + ']');
		}
		bc(err, null);
	}).on('end', function() {
		body = Buffer.concat(body);
		if(log.isLevelEnabled('debug')){
			let respMsg = 'Status: ' + opt.CommonMsg.Status + ', headers: ' +  headerTostring(headers);
			if(body !== ''){
				respMsg += 'body: ' + body;
				log.runLog('debug', methodName, 'response body :' + body);
			}
			log.runLog('debug', methodName, respMsg);
		}
		
		if(!body){
			return doLog();
		}
		
		makeObjFromXml(body, function(err, re){
			if(err){
				if(log.isLevelEnabled('error')){
					log.runLog('error', methodName, 'change xml to json err [' + headerTostring(err) + ']' );
				}
				bc(err,null);
				return;
			}
			if(re && 'Error' in re){
				let errMsg = re.Error;
				opt.CommonMsg.Code = errMsg.Code;
				opt.CommonMsg.Message = errMsg.Message;
				opt.CommonMsg.HostId = errMsg.HostId;
				if(errMsg.RequestId){
					opt.CommonMsg.RequestId = errMsg.RequestId;
				}
				if(log.isLevelEnabled('error')){
					log.runLog('error', methodName, 'request error with error code:' + opt.CommonMsg.Code + ', error message:' + opt.CommonMsg.Message + ', request id:' + opt.CommonMsg.RequestId);
				}
				
			}
			doLog();
		});
		return;
	});
};

Utils.prototype.makeRequest = function(methodName, opt, bc){
	var log = this.log;
	var body = opt.xml;
	var readable = body instanceof streamLib.Readable;
	var signatureContext = opt.signatureContext || this.signatureContext;
	var nowDate = new Date();
	opt.headers.Date = nowDate.toUTCString();
	
	delete opt.headers.Authorization;//retry bug fix
	
	var ex = opt.headers;
	var path = (opt.requestUri ? opt.requestUri : opt.uri) + opt.urlPath;
	var method = opt.method;
	
	if(this.ak && this.sk && methodName !== negotiateMethod){
		if(this.securityToken){
			opt.headers[signatureContext.headerPrefix + 'security-token'] = this.securityToken;
		}
	    if(signatureContext.signature === 'v4'){
	    	this.v4Auth(opt, methodName, signatureContext); 
	    }else{
	    	this.doAuth(opt, methodName, signatureContext);
	    }
	}

	ex['User-Agent'] = 'obs-sdk-js/' + this.obsSdkVersion;
	
	if(log.isLevelEnabled('info')){
		log.runLog('info', methodName, 'prepare request parameters ok, then Send request to service start');
	}
	
	if(log.isLevelEnabled('debug')){
		let header_msg = {};
		for (let key in ex){
			header_msg[key] = ex[key];
		}
		header_msg.Authorization = '****';
		
		let msg = 'method:' + method + ', path:' + path + 'headers:' + headerTostring(header_msg);
		if (body && !readable) {
			msg += 'body:' + body;
		}
		log.runLog('debug', methodName, 'request msg:' + msg);
	}
	
	var reopt = {
		method : method,
		host : ex.Host,
		port : opt.port || this.port,
		path : path,
		ca : !this.sslVerify || !fs.existsSync(String(this.sslVerify)) ? null : fs.readFileSync(String(this.sslVerify)),
		checkServerIdentity: function (host, cert) {
		    return undefined;//do not verify hostname
		},
		rejectUnauthorized : Boolean(this.sslVerify),
		headers : ex
	};
	
	var start = nowDate.getTime();
	
	var _isSecure = opt.protocol ? opt.protocol.toLowerCase().indexOf('https') === 0 : this.isSecure;
	
	reopt.agent = _isSecure ? this.httpsAgent : this.httpAgent;
	
	var _http = _isSecure ? httpsLib : httpLib;
	
	var req = _http.request(reopt);
	req.setNoDelay(true);
	req.setTimeout(this.timeout * 1000);
	
	var that = this;
	
	req.on('response', 	function(serverback) {
		if(log.isLevelEnabled('info')){
			log.runLog('info', methodName, 'http cost ' +  (new Date().getTime() - start) + ' ms');
		}
		that.getRequest(methodName, serverback, opt.dstFile, bc, opt.SaveAsStream, readable, signatureContext);
	}).on('error', function(err){
		if(log.isLevelEnabled('error')){
			log.runLog('error', methodName, 'Send request to service error [' + headerTostring(err) + ']');
		}
		if(log.isLevelEnabled('info')){
			log.runLog('info', methodName, 'http cost ' +  (new Date().getTime() - start) + ' ms');
		}
		bc(err, null);
	});
	
	if(method in ['GET', 'HEAD', 'OPTIONS']){
		return req.end();
	}
	
	if(body){
		if(!readable){
			return req.end(String(body));
		}
		body.on('error',function(err){
			req.abort();
			if(log.isLevelEnabled('error')){
				log.runLog('error', methodName, 'read file to send error [' + headerTostring(err) + ']');
			}
			bc(err, null);
		}).on('end', function(){
			req.end();
		});
		if('ContentLength' in opt){
			let contentLength = parseInt(opt.ContentLength);
			let writeCount = 0;
			
			let doWrite = function(req, data){
				let buf = data;
				if(contentLength - writeCount > buf.length){
					buf = Buffer.from(buf, 0, contentLength - writeCount)
				}
				let flag = req.write(buf, function(err){
					if(err){
	    				req.abort();
	    				if(log.isLevelEnabled('error')){
	    					log.runLog('error', methodName, 'read stream to send error [' + err + ']');
	    				}
	    				return bc(err, null);
	    			}
					writeCount += buf.length;
				});
				if(!flag){
					body.pause();
					req.once('drain', function(){
						body.resume();
					});
				}
			};
			
			body.on('data', function(data){
				if(writeCount >= contentLength){
					req.end();
					if(body.destroy){
						body.destroy();
					}
					return;
				}
				doWrite(req, data);
			});
		}else{
			body.pipe(req);
		}
		return;
	}
	
	if(!('srcFile' in opt)){
		return req.end();
	}
	
	let stream = null;
	let offset = opt.Offset >= 0 ? opt.Offset : 0;
	if('PartSize' in opt){
		stream = fs.createReadStream(opt.srcFile, {start:offset, end:offset+parseInt(opt.PartSize)-1});
	}
	if('ContentLength' in opt){
		stream = fs.createReadStream(opt.srcFile, {start:offset, end:offset+parseInt(opt.ContentLength)-1});
	}
	
	if(!stream){
		stream = fs.createReadStream(opt.srcFile);
	}
	
	stream.on('error', function(err){
		req.abort();
		if(log.isLevelEnabled('error')){
			log.runLog('error', methodName, 'read file to send error [' + headerTostring(err) + ']');
		}
		bc(err, null);
	}).on('end', function(){
		req.end();
	}).pipe(req);
	
};

Utils.prototype.bufMD5 = function(buf) {
	return crypto.createHash('md5').update(buf).digest('base64');
};

Utils.prototype.fileMD5 = function (filePath, bc){
	var stream = fs.createReadStream(filePath);
	var sha = crypto.createHash('md5');
	stream.on('error',function(err){
		if(err){				
			bc(err,null);
		}
	}).on('data', function(data){
		sha.update(data);
	}).on('end', function(){
		bc(null, sha.digest('base64'));
	});
};


Utils.prototype.createSignedUrlSync = function(param){
	return this.signatureContext.signature === 'v4' ? this.createV4SignedUrlSync(param) : this.createV2SignedUrlSync(param);
};

Utils.prototype.createV2SignedUrlSync = function(param){
	param = param || {};
	
	var method = param.Method ? String(param.Method) : 'GET';
	var bucketName = param.Bucket ? String(param.Bucket) : null;
	var objectKey = param.Key ? String(param.Key) : null;
	var specialParam = param.SpecialParam ? String(param.SpecialParam) : null;
	
	if(this.signatureContext.signature === 'obs' && specialParam === 'storagePolicy'){
		specialParam = 'storageClass';
	}else if(this.signatureContext.signature === 'v2' && specialParam === 'storageClass'){
		specialParam = 'storagePolicy';
	}
	
	var expires = param.Expires ? parseInt(param.Expires) : 300;
	var headers = {};
	if(param.Headers && (param.Headers instanceof Object) && !(param.Headers instanceof Array)){
		for(let key in param.Headers){
			headers[key] = param.Headers[key];
		}
	}
	
	var queryParams = {};
	if(param.QueryParams && (param.QueryParams instanceof Object) && !(param.QueryParams instanceof Array)){
		for(let key in param.QueryParams){
			queryParams[key] = param.QueryParams[key];
		}
	}
	
	if(this.securityToken && !queryParams[this.signatureContext.headerPrefix + 'security-token']){
		queryParams[this.signatureContext.headerPrefix + 'security-token'] = this.securityToken;
	}
			
	var result = '';
	var resource = '';
	var host = this.server;
	if(this.isCname){
		resource += '/' + host + '/';
	}else if(bucketName){
		resource += '/' + bucketName;
		if(this.pathStyle){
			result += '/' + bucketName;
		}else{
			host = bucketName + '.' + host;
			resource += '/';
		}
	}
	
	headers.Host = host;
	
	if(objectKey){
		objectKey = encodeURIWithSafe(objectKey, '/');
		result += '/' + objectKey;
		if(resource.lastIndexOf('/') !== resource.length - 1){
			resource += '/';
		}
		resource += objectKey;
	}
	
	if(resource === ''){
		resource = '/';
	}
	
	result += '?';
	
	if(specialParam){
		queryParams[specialParam] = '';
	}
	
	if(this.signatureContext.signature === 'v2'){
		queryParams.AWSAccessKeyId = this.ak;
	}else{
		queryParams.AccessKeyId = this.ak;
	}
	
	if(expires < 0){
		expires = 300;
	}
	expires = parseInt(new Date().getTime() / 1000) + expires;
	
	queryParams.Expires = String(expires);
	
	var interestHeaders = {};
	for(let name in headers){
		let key = String(name).toLowerCase();
		if(key === 'content-type' || key === 'content-md5' || key.length > this.signatureContext.headerPrefix.length && key.slice(0,this.signatureContext.headerPrefix.length) === this.signatureContext.headerPrefix){
			interestHeaders[key] = headers[name];
		}
	}
	
	var queryParamsKeys = [];
	for(let key in queryParams){
		queryParamsKeys.push(key);
	}
	queryParamsKeys.sort();
	var index = 0;
	var flag = false;
	var _resource = [];
	for(let i=0;i<queryParamsKeys.length;i++){
		let key = queryParamsKeys[i];
		let val = queryParams[key];
		key = encodeURIWithSafe(key, '/');
		val = encodeURIWithSafe(val, '/');
		result += key;
		if(val){
			result += '=' + val;
		}
		if(allowedResourceParameterNames.indexOf(key.toLowerCase())>=0 || key.toLowerCase().indexOf(this.signatureContext.headerPrefix) === 0){
			flag = true;
			let _val = val ? key + '=' + decodeURIComponent(val) : key;
			_resource.push(_val);
		}
		result += '&';
		index++;
	}
	_resource = _resource.join('&');
	if(flag){
		_resource = '?' + _resource;
	}
	resource += _resource;
	var stringToSign = [method];
	stringToSign.push('\n');
	
	if('content-md5' in interestHeaders){
		stringToSign.push(interestHeaders['content-md5']);
	}
	stringToSign.push('\n');
	
	if('content-type' in interestHeaders){
		stringToSign.push(interestHeaders['content-type']);
	}
	stringToSign.push('\n');
	
	stringToSign.push(String(expires));
	stringToSign.push('\n');
	
	var temp = [];
	var i = 0;
	for(let key in interestHeaders){
		if (key.length > this.signatureContext.headerPrefix.length && key.slice(0, this.signatureContext.headerPrefix.length) === this.signatureContext.headerPrefix){
			temp[i++] = key;
		}
	}
	temp = temp.sort();
	for(let j=0;j<temp.length;j++){
		stringToSign.push(temp[j]);
		stringToSign.push(':');
		stringToSign.push(interestHeaders[temp[j]]);
		stringToSign.push('\n');
	}
	
	stringToSign.push(resource);
	var hmac = crypto.createHmac('sha1', this.sk);
	hmac.update(stringToSign.join(''));
	
	result += 'Signature=' + encodeURIWithSafe(hmac.digest('base64'), '/');
	
	return {
		ActualSignedRequestHeaders : headers,
		SignedUrl : (this.isSecure ? 'https' : 'http') + '://' + host + ':' + this.port + result
	};
};

Utils.prototype.createV4SignedUrlSync = function(param){
	param = param || {};
	
	var method = param.Method ? String(param.Method) : 'GET';
	var bucketName = param.Bucket ? String(param.Bucket) : null;
	var objectKey = param.Key ? String(param.Key) : null;
	var specialParam = param.SpecialParam ? String(param.SpecialParam) : null;
	
	if(specialParam === 'storageClass'){
		specialParam = 'storagePolicy';
	}
	
	var expires = param.Expires ? parseInt(param.Expires) : 300;
	var headers = {};
	if(param.Headers && (param.Headers instanceof Object) && !(param.Headers instanceof Array)){
		for(let key in param.Headers){
			headers[key] = param.Headers[key];
		}
	}
	
	var queryParams = {};
	if(param.QueryParams && (param.QueryParams instanceof Object) && !(param.QueryParams instanceof Array)){
		for(let key in param.QueryParams){
			queryParams[key] = param.QueryParams[key];
		}
	}
	
	if(this.securityToken && !queryParams[this.signatureContext.headerPrefix + 'security-token']){
		queryParams[this.signatureContext.headerPrefix + 'security-token'] = this.securityToken;
	}
			
	var result = '';
	var resource = '';
	var host = this.server;
	if(bucketName){
		if(this.pathStyle){
			result += '/' + bucketName;
			resource += '/' + bucketName;
		}else{
			host = bucketName + '.' + host;
		}
	}
	
	if(objectKey){
		objectKey = encodeURIWithSafe(objectKey, '/');
		result += '/' + objectKey;
		resource += '/' + objectKey;
	}
	
	if(resource === ''){
		resource = '/';
	}
	
	result += '?';
	
	if(specialParam){
		queryParams[specialParam] = '';
	}
	
	if(expires < 0){
		expires = 300;
	}

	var utcDateStr = headers.date || headers.Date || new Date().toUTCString();
	
	var dates = getDates(utcDateStr);
	var shortDate = dates[0];
	var longDate = dates[1];
	
	headers.Host = host + ((this.port === 80 || this.port === 443) ? '' : ':' + this.port);
	
	
	queryParams['X-Amz-Algorithm'] = 'AWS4-HMAC-SHA256';
	queryParams['X-Amz-Credential'] = this.ak + '/' + shortDate + '/' + this.region + '/s3/aws4_request';
	queryParams['X-Amz-Date'] = longDate;
	queryParams['X-Amz-Expires'] = String(expires);
	
    var signedAndCanonicalHeaders = getSignedAndCanonicalHeaders(headers);
	
	queryParams['X-Amz-SignedHeaders'] = signedAndCanonicalHeaders[0];
	
	var _queryParams = {};
	var queryParamsKeys = [];
	for(let key in queryParams){
		let val = queryParams[key];
		key = encodeURIWithSafe(key, '/');
		val = encodeURIWithSafe(val);
		_queryParams[key] = val;
		queryParamsKeys.push(key);
		result += key;
		if(val){
			result += '=' + val;
		}
		result += '&';
	}
	
	var canonicalQueryString = '';
	
	queryParamsKeys.sort();
	
	for(let i=0;i<queryParamsKeys.length;){
		canonicalQueryString += queryParamsKeys[i] + '=' + _queryParams[queryParamsKeys[i]];
		if(++i !== queryParamsKeys.length){
			canonicalQueryString += '&';
		}
	}
	
	var canonicalRequest = method + '\n';
	canonicalRequest += resource +  '\n';
	canonicalRequest += canonicalQueryString + '\n';
	canonicalRequest += signedAndCanonicalHeaders[1] + '\n';
	canonicalRequest += signedAndCanonicalHeaders[0] + '\n';
	canonicalRequest += 'UNSIGNED-PAYLOAD';
	
	var signature = getV4Signature(shortDate, longDate, this.sk, this.region, canonicalRequest);
	
	result += 'X-Amz-Signature=' + encodeURIWithSafe(signature);
	
	return {
		ActualSignedRequestHeaders : headers,
		SignedUrl : (this.isSecure ? 'https' : 'http') + '://' + host + ':' + this.port + result
	};
			
};


Utils.prototype.createPostSignatureSync = function(param){
	
	if(this.signatureContext.signature === 'v4'){
		return this.createV4PostSignatureSync(param);
	}
	
	param = param || {};
	var bucketName = param.Bucket ? String(param.Bucket) : null;
	var objectKey = param.Key ? String(param.Key) : null;
	var expires = param.Expires ? parseInt(param.Expires) : 300;
	var formParams = {};
	
	if(param.FormParams && (param.FormParams instanceof Object) && !(param.FormParams instanceof Array)){
		for(let key in param.FormParams){
			formParams[key] = param.FormParams[key];
		}
	}
	
	if(this.securityToken && !formParams[this.signatureContext.headerPrefix + 'security-token']){
		formParams[this.signatureContext.headerPrefix + 'security-token'] = this.securityToken;
	}
	
	var expireDate = new Date();
	expireDate.setTime(parseInt(new Date().getTime()) + expires * 1000);
	expireDate = getExpireDate(expireDate.toUTCString());
	
	if(bucketName){
		formParams.bucket = bucketName;
	}
	
	if(objectKey){
		formParams.key = objectKey;
	}
	
	var policy = [];
	policy.push('{"expiration":"');
	policy.push(expireDate);
	policy.push('", "conditions":[');
	
	var matchAnyBucket = true;
	var matchAnyKey = true;
	
	var conditionAllowKeys = ['acl', 'bucket', 'key', 'success_action_redirect', 'redirect', 'success_action_status'];
	
	for(let key in formParams){
		if(!key){
			continue;
		}
		let val = formParams[key];
		key = String(key).toLowerCase();
		
		if(key === 'bucket'){
			matchAnyBucket = false;
		}else if(key === 'key'){
			matchAnyKey = false;
		}
		if(allowedResponseHttpHeaderMetadataNames.indexOf(key) < 0 && conditionAllowKeys.indexOf(key) < 0 && key.indexOf(this.signatureContext.headerPrefix) !== 0){
			continue;
		}
		
		policy.push('{"');
		policy.push(key);
		policy.push('":"');
		policy.push(val !== null ? String(val) : '');
		policy.push('"},');
	}
	
	
	if(matchAnyBucket){
		policy.push('["starts-with", "$bucket", ""],');
	}
	
	if(matchAnyKey){
		policy.push('["starts-with", "$key", ""],');
	}
	
	policy.push(']}');
	
	var originPolicy = policy.join('');
	
	policy = Buffer.from(originPolicy,'utf8').toString('base64');
	
	var signature = crypto.createHmac('sha1', this.sk).update(policy).digest('base64');
	
	return {
		OriginPolicy : originPolicy,
		Policy : policy,
		Signature : signature,
		Token : this.ak + ':' + signature + ':' + policy
	};
};


Utils.prototype.createV4PostSignatureSync = function(param){
	param = param || {};
	
	var bucketName = param.Bucket ? String(param.Bucket) : null;
	var objectKey = param.Key ? String(param.Key) : null;
	var expires = param.Expires ? parseInt(param.Expires) : 300;
	var formParams = {};
	
	if(param.FormParams && (param.FormParams instanceof Object) && !(param.FormParams instanceof Array)){
		for(let key in param.FormParams){
			formParams[key] = param.FormParams[key];
		}
	}
	
	if(this.securityToken && !formParams[this.signatureContext.headerPrefix + 'security-token']){
		formParams[this.signatureContext.headerPrefix + 'security-token'] = this.securityToken;
	}
	
	var utcDateStr = new Date().toUTCString();
	var dates = getDates(utcDateStr);
	var shortDate = dates[0];
	var longDate = dates[1];
	
	var credential = this.ak + '/' + shortDate + '/' + this.region + '/s3/aws4_request';
	
	var expireDate = new Date();
	expireDate.setTime(parseInt(new Date().getTime()) + expires * 1000);
	
	expireDate = getExpireDate(expireDate.toUTCString());
	
	formParams['X-Amz-Algorithm'] = 'AWS4-HMAC-SHA256';
	formParams['X-Amz-Date'] = longDate;
	formParams['X-Amz-Credential'] = credential;
	
	if(bucketName){
		formParams.bucket = bucketName;
	}
	
	if(objectKey){
		formParams.key = objectKey;
	}
	
	var policy = [];
	policy.push('{"expiration":"');
	policy.push(expireDate);
	policy.push('", "conditions":[');
	
	var matchAnyBucket = true;
	var matchAnyKey = true;
	
	var conditionAllowKeys = ['acl', 'bucket', 'key', 'success_action_redirect', 'redirect', 'success_action_status'];
	
	for(let key in formParams){
		if(!key){
			continue;
		}
		let val = formParams[key];
		key = String(key).toLowerCase();
		
		if(key === 'bucket'){
			matchAnyBucket = false;
		}else if(key === 'key'){
			matchAnyKey = false;
		}
		
		if(allowedResponseHttpHeaderMetadataNames.indexOf(key) < 0 && conditionAllowKeys.indexOf(key) < 0 && key.indexOf(this.signatureContext.headerPrefix) !== 0){
			continue;
		}
		
		policy.push('{"');
		policy.push(key);
		policy.push('":"');
		policy.push(val !== null ? String(val) : '');
		policy.push('"},');
	}
	
	if(matchAnyBucket){
		policy.push('["starts-with", "$bucket", ""],');
	}
	
	if(matchAnyKey){
		policy.push('["starts-with", "$key", ""],');
	}
	
	policy.push(']}');
	
	var originPolicy = policy.join('');
	
	policy = Buffer.from(originPolicy,'utf8').toString('base64');
	
	var signature = createV4Signature(shortDate, this.sk, this.region, policy);
	
	return {
		OriginPolicy : originPolicy,
		Policy : policy,
		Algorithm : formParams['X-Amz-Algorithm'],
		Credential : formParams['X-Amz-Credential'],
		Date : formParams['X-Amz-Date'],
		Signature : signature
	};
};

module.exports = Utils;

