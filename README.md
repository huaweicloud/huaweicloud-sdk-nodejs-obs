
Version 3.1.2

新特性：
1. 升级log4js依赖到最新版本；
2. 桶事件通知接口（ObsClient.setBucketNotification/ObsClient.getBucketNotification）新增对函数工作流服务配置和查询的支持；

资料&demo：
1. 开发指南事件通知章节，新增对函数工作流服务配置的介绍；
2. 接口参考设置/获取桶的时间通知配置章节，新增函数工作流服务配置的参数描述；

修复问题：
1. 修复创建桶接口（ObsClient.createBucket）由于协议协商导致报错信息不准确的问题；
