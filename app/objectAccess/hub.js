/**
 * @version 1.0.0
 * @date 2017-04-20
 * @desc 物接入 require---》jquery.js、mqttws31.js
 * @author wj
 * @type {{hostname: string, port: number, clientId: string, timeout: number, keepAlive: number, cleanSession: boolean, ssl: boolean, userName: string, password: string, topic: string, callback: string}}
 */
var default_options = {
    hostname: 'wj_endpoint01.mqtt.iot.gz.baidubce.com',
    port: 8884,
    clientId: 'DeviceId-22dx960d07',
    timeout: 3,
    keepAlive: 60,
    cleanSession: true,
    ssl: true,
    userName: 'wj_endpoint01/wj_thing01',
    password: 'Ffbhk/uuvg2a72n8NJtl5MKsmhOs37i0J5aZfpgcZeQ=',
    topic: 'wj_topic/demo',
    callback: ""
};
/**
 * 构造函数
 * @constructor
 */
function Hub(options){
    _this = this;
    this.options = $.extend(true, default_options, options);
    this.init();
}
/**
 * 初始化MQTT client
 * @returns {Hub}
 */
Hub.prototype.clientFunc = function () {
    var _options = this.options;
    this._mqtt.client = new Paho.MQTT.Client(_options.hostname, _options.port, _options.clientId);
    return this;
};
/**
 * 链接服务器
 * @returns {Hub}
 */
Hub.prototype.connectFunc = function () {
    var _options = this.options,
        options = {
            invocationContext: {
                host : _options.hostname,
                port: _options.port,
                path: this._mqtt.client.path,
                clientId: _options.clientId
            },
            keepAliveInterval: _options.keepAlive,
            cleanSession: _options.cleanSession,
            useSSL: _options.ssl,
            userName: _options.userName,
            password: _options.password,
            onSuccess: this.onSuccessFunc,
            onFailure: function(){
                console.log(12112);
            }
        };
    this._mqtt.client.connect(options);
    this._mqtt.client.onConnectionLost = this.onConnectionLostFunc;
    //注册连接断开处理事件
    this._mqtt.client.onMessageArrived = this.onMessageArrivedFunc;
    return this;
};
/**
 * 连接服务器并注册连接成功处理事件
 * @returns {Hub|*}
 */
Hub.prototype.onSuccessFunc = function () {
    var _options = _this.options;
    console.log("onConnected");
    _this._mqtt.client.subscribe(_options.topic);
    //订阅主题
    //发送消息
    _this._mqtt.message = new Paho.MQTT.Message("");
    _this._mqtt.message.destinationName = _options.topic;
    return _this;
};
/**
 * 断开连接
 * @param responseObject
 * @returns {Hub}
 */
Hub.prototype.onConnectionLostFunc = function (responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
        console.log("连接已断开");
    }
    _this.send.error = responseObject;
    return _this;
};
/**
 * 收到消息
 * @param message
 * @returns {Hub}
 */
Hub.prototype.onMessageArrivedFunc = function (message) {
    console.log("收到消息："+ message.payloadString);
    _this.send.success = message.payloadString;
    var callback = _this.options.callback;
    callback && typeof callback === 'function' && callback(message.payloadString);
    return _this;
};
/**
 * 启动服务
 */
Hub.prototype.init = function () {
    this._mqtt = {};
    this.send = {};
    this.clientFunc();
    this.connectFunc();
};