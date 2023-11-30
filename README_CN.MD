Version 3.23.11
新特性：
1. 新增设置对象标签、获取对象标签和删除对象标签三个接口；
2. uploadFile方法支持指定Expires参数设置上传对象过期时间；

资料&demo：无

-----------------------------------------------------------------------------------

Version 3.23.9
新特性：
1. 支持下载对象和断点续传上传下载进度回调；
2. 支持特殊字符对象；
3. 支持分页列举桶；

资料&demo：无

修复问题：

1. 修复OBS协议GetBucketMetadata请求者付费参数不生效问题；
2. 补充图片处理持久化头域；

-----------------------------------------------------------------------------------

Version 3.21.6

新特性：无

资料&demo：无

修复问题：

1. 【功能】解决部分场景下使用断点续传下载接口可能导致数据一致性问题；
2. 【功能】修改断点续传下载和上传的智能分段逻辑；
3. 【功能】解决断点续传下载Ssec加密对象失败的问题；

----
Version 3.1.4

新特性：
1. 支持初始化ObsClient时指定max_connections参数设置最大HTTP连接数；
2. 支持初始化ObsClient时指定http_agent参数和https_agent参数定制HTTP代理对象；
3. 支持初始化ObsClient时指定user_agent参数；
4. 所有接口支持返回OBS服务内部错误码Indicator；
5. 日志新增socket连接建立耗时打印；
6. 新增ObsClient.setObjectMetadata接口，用于修改对象元数据；
7. ObsClient.putObject/ObsClient.uploadPart/ObsClient.appendObject新增ProgressCallback参数，用于获取上传进度；


资料&demo：无

修复问题：

1. 【功能】对必选字段增加非空字符串/非null/非undefined的校验；
2. 【功能】解决请求发生3xx异常时，无法正常获取OBS服务端返回异常信息的问题；
3. 【功能】修复ObsClient.putObject/ObsClient.appendObject/ObsClient.InitiateMultipartUpload设置StorageClass参数报错的问题；


-----------------------------------------------------------------------------------

Version 3.1.3

新特性：
1. 日志模块支持与已有的配置集成；

资料&demo：无

修复问题：
1. 修复ObsClient.listObjects/ObsClient.listVersions/ObsClient.getObject/ObsClient.getObjectMetadata/ObsClient.copyObject/ObsClient.listParts/ObsClient.copyPart接口响应中返回的LastModified字段不是UTC标准格式的问题；
2. 修复ObsClient.close方法在长连接模式下无法正常断开链接的问题；

-----------------------------------------------------------------------------------

Version 3.1.2

新特性：
1. 升级log4js依赖到最新版本；
2. 桶事件通知接口（ObsClient.setBucketNotification/ObsClient.getBucketNotification）新增对函数工作流服务配置和查询的支持；

资料&demo：
1. 开发指南事件通知章节，新增对函数工作流服务配置的介绍；
2. 接口参考设置/获取桶的时间通知配置章节，新增函数工作流服务配置的参数描述；

修复问题：
1. 修复创建桶接口（ObsClient.createBucket）由于协议协商导致报错信息不准确的问题；
