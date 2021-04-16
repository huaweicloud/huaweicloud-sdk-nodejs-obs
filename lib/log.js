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



const fs = require('fs');
const path = require('path');
const log4js = require('log4js');

function checkAndCreateDir(dir,path){
	if(!fs.existsSync(dir)){
		let rout = path.dirname(dir);
		if(!fs.existsSync(rout)){
			checkAndCreateDir(rout);
		}
		fs.mkdirSync(dir);
	}
}

function LogUtil(){
	this.loggerInf = null;
	this.loggerRun = null;
	this.consoleLog = null;
}

LogUtil.prototype.initLog = function(filename, maxLogSize, backups, level, logToConsole, name, logger){
	if(logger){
		this.loggerInf = logger;
		return;
	}
	
	if(!filename){
		return;
	}
	
	let dir = path.dirname(filename);
	checkAndCreateDir(dir, path);
	let ext = path.extname(filename);
	let file = path.basename(filename, ext);
	if(!ext){
		ext = '.log';
	}
	
	level = level === undefined ? 'info' : String(level);
	maxLogSize = maxLogSize === undefined ? 102400 : parseInt(maxLogSize, 10);
	backups = backups === undefined ? 10 : parseInt(backups, 10);
	
	let fileInterface = path.join(dir, file + ext);
	let layoutFormat = '%d{yyyy/MM/dd hh:mm:ss SSS}|%c|%-5p|%m';
	let cateInterface = 'sdk-file';
	let cateConsole = 'sdk-console';
	if(name){
		cateInterface += ':' + String(name);
		cateConsole += ':' + String(name);
	}
	
	let appenders = {};
	appenders[cateConsole] = {
        type:'console',
    };
	appenders[cateInterface] = {
        type: 'file',
        filename: fileInterface,
        maxLogSize:maxLogSize,
        backups:backups,
        layout: {
            type: 'pattern',
            pattern : layoutFormat,
        }
    };
	
	let categories = {
		default: { appenders: [cateConsole], level: 'off' }
	};
	categories[cateInterface] =  { appenders: [cateInterface], level:level.toLowerCase()};
	categories[cateConsole] =  { appenders: [cateConsole], level:level.toLowerCase()};
	
	log4js.configure({
		categories: categories,
	    appenders: appenders,
	    replaceConsole: true
	});
	
	this.loggerInf = log4js.getLogger(cateInterface);
	if(logToConsole){
		this.consoleLog = log4js.getLogger(cateConsole);
	}
};

LogUtil.prototype._doLog = function(level, form){
	if(level.toLowerCase() === 'debug'){
		if(this.loggerInf){
			this.loggerInf.debug(form);
		}
		if(this.consoleLog){
			this.consoleLog.debug(form);
		}
	}else if(level.toLowerCase() === 'info'){
		if(this.loggerInf){
			this.loggerInf.info(form);
		}
		if(this.consoleLog){
			this.consoleLog.info(form);
		}
	}else if(level.toLowerCase() === 'warn'){
		if(this.loggerInf){
			this.loggerInf.warn(form);
		}
		if(this.consoleLog){
			this.consoleLog.warn(form);
		}
	}else if(level.toLowerCase() === 'error'){
		if(this.loggerInf){
			this.loggerInf.error(form);
		}
		if(this.consoleLog){
			this.consoleLog.error(form);
		}
	}
};

LogUtil.prototype.isLevelEnabled = function(level){
	return (this.loggerInf && this.loggerInf.isLevelEnabled(level)) || (this.consoleLog && this.consoleLog.isLevelEnabled(level));
};

LogUtil.prototype.runLog = function(level, methodName, msg){
	if(!this.loggerInf && !this.consoleLog){
		return;
	}
	let form = methodName + '|' + msg;
	this._doLog(level, form);
};


module.exports = LogUtil;
