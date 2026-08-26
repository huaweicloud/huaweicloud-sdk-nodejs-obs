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

'use strict';

const fs = require('fs');
const path = require('path');

function mkdirsSync(dirname){
	if(fs.existsSync(dirname)){
		return true;
	}else{
		if(mkdirsSync(path.dirname(dirname))){
			fs.mkdirSync(dirname);
			return true;
		}
	}
}

function createSampleFileSync(sampleFilePath){
	if(!fs.existsSync(sampleFilePath)){
		mkdirsSync(path.dirname(sampleFilePath));
		const fd = fs.openSync(sampleFilePath, 'w');
		if(fd){
			fs.writeSync(fd, String(Math.random()) + '\n');
			fs.writeSync(fd, String(Math.random()) + '\n');
			fs.writeSync(fd, String(Math.random()) + '\n');
			fs.writeSync(fd, String(Math.random()) + '\n');
			fs.closeSync(fd);
		}
	}
	return sampleFilePath;
}

function createLargeSampleFileSync(sampleFilePath){
	if(!fs.existsSync(sampleFilePath)){
		mkdirsSync(path.dirname(sampleFilePath));
		const fd = fs.openSync(sampleFilePath, 'w');
		if(fd){
			for(let i=0;i < 1000000;i++){
				fs.writeSync(fd, String(Math.random()) + '\n');
				fs.writeSync(fd, String(Math.random()) + '\n');
				fs.writeSync(fd, String(Math.random()) + '\n');
				fs.writeSync(fd, String(Math.random()) + '\n');
			}
			fs.closeSync(fd);
		}
	}
	return sampleFilePath;
}

module.exports = {
	mkdirsSync,
	createSampleFileSync,
	createLargeSampleFileSync
};
