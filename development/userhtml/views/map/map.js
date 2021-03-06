/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_map(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            list:'.innerlist>ul'
            ,row:'.template [name=row]'
            ,nonerow:'.template [name=nonerow]'
            ,tujianrow:'.template [name=tujianrow]'
            ,listcontaion:'.list'

            ,bttitle:'[name=title]'

            ,daohangmenu:'[name=daohangmenu]'
            ,daohang_gaode:'[name=daohang_gaode]'
            ,daohang_my:'[name=daohang_my]'
            ,btclosemenu:'[name=btclosemenu]'
            ,mk1:'.template [name=mk1]'
            ,infopanel1:{
                panel:'[name=infopanel]'
                ,btback:'[name=infopanel] [name=btback]'
                ,btdaohang:'[name=infopanel] [name=btdaohang]'
                ,btpay:'[name=infopanel] [name=btpay]'
                ,title:'[name=infopanel] [name=title]'
                ,address:'[name=infopanel] [name=address]'
                ,note:'[name=infopanel] [name=note]'
                ,noteline:'[name=infopanel] [name=noteline]'
                ,rules:'[name=infopanel] [name=rules]'
                ,numberstatus:'[name=infopanel] [name=numberstatus]'
                ,numbermax:'[name=infopanel] [name=numbermax]'
                ,carid:'[name=infopanel] [name=carid]'
                ,btmodifycarid:'[name=infopanel] [name=btmodifycarid]'
            }
            ,infopanel:{
                panel:'[name=infopanel]'
                ,btback:'[name=infopanel] [name=btback]'
                ,btdaohang:'[name=infopanel] [name=btdaohang]'
                ,btpay:'[name=infopanel] [name=btpay]'
                ,title:'[name=infopanel] [name=title]'
                ,address:'[name=infopanel] [name=address]'
                ,note:'[name=infopanel] [name=note]'
                ,noteline:'[name=infopanel] [name=noteline]'
                ,rules:'[name=infopanel] [name=rules]'
                ,numberstatus:'[name=infopanel] [name=numberstatus]'
                ,numbermax:'[name=infopanel] [name=numbermax]'
                ,carid:'[name=infopanel] [name=carid]'
                ,btmodifycarid:'[name=infopanel] [name=btmodifycarid]'
                ,innerlist:'[name=infopanel] .innerpanellist>ul'
                ,dqpanel:'[name=infopanel] [name=dqpanel]'
                ,payinfo:'[name=infopanel] [name=payinfo] span'

            }
        }
        ,iscroll:null
        ,mapObj:null
        ,datas:null
        ,nowdata:null               //当前选择的停车场
        ,dqselectdata:null          //当前选择的抵用券信息
        ,nowoid:null
        ,init:function(context){
            if (!this.isInit){
                this.isInit = true;
                this.context = context;
                utils.jqmapping(this.dom, context);
                this.r_init();
            }
            this.c_init();
        }
        ,c_init:function(){
            var me = this;

            me.c_searchPosition(function(placedata){
                sysmanager.loadMapscript.load(function(){
                    me.c_initMap(function(center){
                        me.m_getdata(center,function(datas,area){
                            me.c_addpoint(me.mapObj,datas);
                            me.c_fill(datas,area);
                        });
                    }, placedata);
                });
            });
        }
        ,c_init_search:function(placedata){
            var me = this;
            sysmanager.loadMapscript.load(function(){
                me.c_initMap(function(center){
                    me.m_getdata(center,function(datas,area){
                        me.c_addpoint(me.mapObj,datas);
                        me.c_fill(datas,area);
                    });
                }, placedata);
            });
        }
        ,c_searchPosition:function(fn){     //搜索地图

            var model = utils.tools.getUrlParam('m');
            if('mapsearch' == model){
                sysmanager.loadpage('views/', 'searchmap', $('#pop_pagecontaion'),'搜索地图', function(view){
                    view.obj.onclose = function(placedata){
                        fn && fn(placedata);
                    }
                });
            }else{
                fn && fn(null);
            }
        }
        ,c_initMap:function(fn, placedata){//fn 加载后的回调， placedata 预定义的地图搜索位置

              var mapObj = this.mapObj = window.mapobj = new AMap.Map("map_html_mapid",{
              view: new AMap.View2D({
                //创建地图二维视口
              //center:position,//创建中心点坐标
              zoom:16, //设置地图缩放级别
              rotation:0 //设置地图旋转角度
             }),
             lang:"zh_cn"//设置地图语言类型，默认：中文简体
            });//创建地图实例

                var homecontrol = new AMap.myHomeControl({
                    offset:new AMap.Pixel(10,100)
                });
            var maptool = null;

                mapObj.plugin(["AMap.ToolBar","AMap.Scale","AMap.myHomeControl"],function(){

                     //加载工具条
                    maptool = window.maptool = new AMap.ToolBar({
                       direction:false,//隐藏方向导航
                       ruler:false,//隐藏视野级别控制尺
                       autoPosition:false//自动定位
//                       ,locationMarker1:new AMap.Marker({
//                           map:mapObj
//                           ,content:"<div style='width: 50px;height: 50px;border-radius: 25px;background-color: rgba(0,0,0,.2)'><div style='position: absolute;left: 50%;top:50%;width: 6px;height: 6px;border-radius: 3px;margin-left: -3px;margin-top: -3px;background-color:red'></div></div>"
                            ,offset:new AMap.Pixel(10,80)
//                       })
                     });
                     mapObj.addControl(maptool);
                     //加载比例尺
                     var scale = new AMap.Scale();
                     mapObj.addControl(scale);
                       //加载回原点
                     mapObj.addControl(homecontrol);
               });
            //window.mapobj1 = mapObj;
            if(mapObj.loaded){
                onmapload(mapobj);
            }else{
                AMap.event.addListener(mapObj,'complete',function(){
                        onmapload(mapobj);
                });
            }


            function onmapload(mapobj){
                var center = mapobj.getCenter();
                console.log(center);                /**
                 * B: 39.9092295056561lat: 39.90923lng: 116.397428r: 116.39742799999999
                 */
                if(placedata){
                    mapObj.setCenter(placedata);
                    setTimeout(function(){
                        homecontrol.setPosition(placedata,mapObj, true);
                        fn && fn(placedata);
                    });
                }else{
                    /**
                    AMap.event.addListener(maptool,'location',function callback(e){
                        var locposition = e.lnglat;
                        homecontrol.setPosition(locposition, mapObj, true);
                        fn && fn(locposition);
                    });
                    maptool.doLocation();
                     */

                    /***/
                    var callbacking = false;
                    mapObj.plugin('AMap.Geolocation', function () {
                        var geolocation = new AMap.Geolocation({
                            enableHighAccuracy: true,//是否使用高精度定位，默认:true
                            timeout: 5000,          //超过10秒后停止定位，默认：无穷大
                            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                            showButton: false,        //显示定位按钮，默认：true
                            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                            showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                            showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                            zoomToAccuracy:false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                        });
                        mapObj.addControl(geolocation);
                        AMap.event.addListener(geolocation, 'complete', function(arg){
                            //console.log('定位成功', arg);
                            homecontrol.setPosition(arg.position,mapObj, true);
                            if(!callbacking){
                                fn && fn(arg.position);
                            }else{
                                callbacking = true;
                            }
                        });//返回定位信息
                        AMap.event.addListener(geolocation, 'error', function(){
                            //返回定位出错信息
                            alert('当前环境不支持获取定位,请在设置中允许使用[位置定位服务]');
                        });
                        geolocation.getCurrentPosition();

                    });

                }
                mapObj.gotoHome = function(){
                    this.panTo(homecontrol.position);
                }
            }

        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.dom.list[0], {desktopCompatibility:true});
            this.infoiscroll = new iScroll(this.dom.infopanel.innerlist[0], {desktopCompatibility:true});

            this.dom.infopanel.btback.aclick(function(){
                me.c_back();
            });
            this.dom.infopanel.btdaohang.aclick(function(){
                if(sysmanager.isapp){
//                    me.c_daohang();
                    me.c_daohang_my();
                }else{
                    me.c_daohang_my();
                }
                //点击导航按钮：D4
                var uid = myajax.uid();if(uid && uid > 41){window.TongjiObj.D('D4');}
            });
            this.dom.daohang_gaode.aclick(function(){
                me.c_daohang_gaode($(this));
            });
            this.dom.btclosemenu.aclick(function(){
               me.dom.daohangmenu.hide();
            });
            this.dom.daohang_my.aclick(function(){
                me.c_daohang_my();
            });
            //this.dom.bttitle.aclick(function(){alert('title');});
            this.dom.infopanel.btpay.aclick(function(){
               me.c_startPay();
                //确认预付按钮点击：D5
                var uid = myajax.uid();if(uid && uid > 41){window.TongjiObj.D('D5');}
            });

            this.dom.infopanel.btmodifycarid.click(function(){
                me.c_modifycarid();
                //修改车牌号的情况：D3
                var uid = myajax.uid();if(uid && uid > 41){window.TongjiObj.D('D3');}
            });
            this.dom.infopanel.btback.aclick(function(){
                me.dom.infopanel.panel.hide();
            });

            this.dom.infopanel.dqpanel.find('>a').click(function(){
                if(me.couponlist){
                    me.dom.infopanel.dqpanel.toggleClass('mui-active');
                    setTimeout(function(){
                       me.infoiscroll.refresh();
                        me.infoiscroll.scrollToElement(me.dom.infopanel.dqpanel[0]);
                    });
                }
            });

        }
        ,c_modifycarid:function(fn){
            var me = this;
            sysmanager.loadpage('views/', 'userinfo', null, '个人信息',function(v){

                v.obj.onclose = function(info){
                    var defaultcarid = null;
                    for(var i=0;i<info.carids.length;i++){
                        var d = info.carids[i];
                        if('1' == d.status+''){
                            defaultcarid = d.carid;
                            break;
                        }
                    }
                    me.dom.infopanel.carid.html(defaultcarid || '没有设置车牌');

                    for(var i=0;i<me.datas.length;i++){
                       me.datas[i].carid = defaultcarid;
                    }

                    fn && fn(defaultcarid);
                }
                v.obj.c_showquit(true);
            });
        }
        ,c_startPay:function(){
            var me = this;

            if(!this.nowdata.carid){
                this.c_modifycarid(function(carid){
                    if(carid){
                        if(sysmanager.isapp){
                            innerpay_app();
                        }else{
                            innerpay();
                        }
                    }
                });
            }else{
                if(sysmanager.isapp){

                    innerpay_app();
                }else{
                    innerpay();
                }

            }
            var uid = myajax.uid();if(uid && uid > 41){window.TongjiObj.D('D1');}
            function innerpay(){
                me.m_startPay(me.nowdata.pid,(me.dqselectdata?me.dqselectdata.id:0), function(data){
                    me.nowoid = data.oid;
                    //alert(data.oid);
                    //return [alert('跳过支付直接成功![测试s]'), me.c_startPayok()];
                    console.log(data);
                    WeixinJSBridge.invoke('getBrandWCPayRequest', data.paydata,function(res){
                        //WeixinJSBridge.log(res.err_msg);
                        //alert(res.err_code+'\n'+res.err_desc+'\n'+res.err_msg);
                         if('get_brand_wcpay_request:ok' == res.err_msg){
                             me.c_startPayok();

                         }else{
//                             alert(res.err_msg);
                             me.c_startPayfalid();
                         }
                     });
                });
            }
            function innerpay_app(){
                me.m_startPay_app(me.nowdata.pid,(me.dqselectdata?me.dqselectdata.id:0), function(data){
                    me.nowoid = data.oid;
                    //alert(data.oid);
                    //return [alert('跳过支付直接成功![测试s]'), me.c_startPayok()];

                    console.log(data);
                    /**
                     * oid:
                     * paydata:* Object
                     *  appid:
                     *  noncestr:
                     *  partnerid:
                     *  prepayid:
                     *  timestamp:
                     *  Object
                     */
                    var paydata = data.paydata;


                    //绑定窗口事件（只一次）
                    window.removeEventListener("message", me.innerpay_app_onmessage);
                    window.addEventListener("message", me.innerpay_app_onmessage, false );
                    //发送支付信息给父窗口
                    me.innerpay_app_postmessage(JSON.stringify(paydata));
                });
            }
            //发送信息到父窗口


        }
        ,innerpay_app_postmessage:function(data){   //发送支付信息
            window.parent.postMessage(data,'*');
        }
        ,innerpay_app_onmessage:function(event){         //接受支付信息返回
            var me = ui;
            var success = JSON.parse(event.data);

            if(0 == success.code){
                  me.c_startPayok();
              }else{
                  sysmanager.alert({'-1':'支付失败','-2':'支付参数错误'}[success.code+'']);
                  me.c_startPayfalid();
              }
        }
        ,c_startPayok:function(){           //预付款成功
            var me = this;
//            sysmanager.loadpage('views/', 'orderpay', null, '当前停车订单',function(view){
//                view.obj.c_initinfo(me.nowdata, me.nowoid);
//                view.obj.onclose = function(){
//
//                }
//            });
            this.dom.infopanel.panel.hide();
            sysmanager.loadpage('views/', 'myorderdetail', null, '订单结算',function(v){
//            sysmanager.loadpage('views/', 'myorderdetail', $('#jiesuan_pagecontaion'), null,function(v){
                //v.obj.initoid(me.oid);
                v.obj.initWait(5000);
                v.obj.onclose = function(){};
            });
            //支付成功：D6
            var uid = myajax.uid();if(uid && uid > 41){window.TongjiObj.A('D6');}
        }
        ,c_startPayfalid:function(){        //预付款失败
            //alert('预付款失败');
            //this.c_startPayok();
        }
        ,c_fill:function(datas,area){
            var me = this;
            this.datas = datas;
            this.dom.list.empty();
            if(datas){
                for(var i=0;i<datas.length;i++){
                    var row = this.c_getrow(datas[i]);
                    this.dom.list.append(row);
                }
            }
            if(!datas || datas.length == 0){
                var row = this.c_getnonerow(area);
                this.dom.list.append(row);
            }
            setTimeout(function(){
                me.iscroll.refresh();
            });
        }
        ,c_addpoint:function(map,datas){
            for(var i=0;i<datas.length;i++){
                var data = datas[i];
                var maker = this.c_getpoint(map,data, i);

            }
        }
        ,c_getpoint:function(map,data, index){
            var me = this;
            var content = this.dom.mk1.html();
            content = content.replace('{0}', '¥'+data.prepay).replace('{1}',data.parkstate);
            var marker = new AMap.Marker({                 
              map:map,                 
              position:data.point,
              icon:"http://webapi.amap.com/images/0.png",
             content:content,
             offset:new AMap.Pixel(-10,-35)               
           });
            data.marker = marker;
            AMap.event.addListener(marker,'touchstart',function callback(e){
                me.c_activeRow(index);
            });
        }
//        ,c_showinfo:function(data){
//            this.nowdata = data;
//            this.dom.listcontaion.addClass('next');
//            //fill
//            this.dom.infopanel.btpay.html('确认,预付{0}元'.replace('{0}',data.prepay));
//            this.dom.infopanel.title.html(data.name);
//            this.dom.infopanel.address.html(data.address);
//            this.dom.infopanel.rules.html(data.rules);
//
//            this.dom.infopanel.numbermax.html(data.spacesum>0?(data.spacesum+'个'):'未知');
//            this.dom.infopanel.numberstatus.html(window.cfg.parkstatestring[data.parkstate]);
//
//            this.dom.infopanel.carid.html(data.carid || '没有设置车牌');
//
//            if(data.note){
//                this.dom.infopanel.note.html(data.note);
//                this.dom.infopanel.noteline.show();
//            }else{
//                this.dom.infopanel.noteline.hide();
//            }
//        }
        ,c_back:function(){
            this.dom.listcontaion.removeClass('next');
        }
        ,c_daohang:function(){
            var me = this;
            this.dom.daohangmenu.show();

        }
        ,c_daohang_gaode:function(alink){
            var me = this;

            var iosinfo = {
                root:'iosamap://navi?'
                ,ioskey: {
                    sourceApplication: 'dudutingche'            //应用名称
                    , backScheme: ''                              //第三方调回使用的 scheme
                    , poiname: ''                             //poi 名称
                    , poiid: ''                             //sourceApplication的poi id
                    , lat: this.nowdata.point.lat                           //经度
                    , lon: this.nowdata.point.lng                             //纬度
                    , dev: 1                             //是否偏移(0:lat 和 lon 是已经加密后的,不需要国测加密; 1:需要国测加密
                    , style: 2                       //导航方式：(=0：速度最快，=1：费用最少，=2：距离最短，=3：不走高速，=4：躲避拥堵，=5：不走高速且避免收费，=6：不走高速且躲避拥堵，=7：躲避收费和拥堵，=8：不走高速躲避收费和拥堵)
                }
            };

            var androidinfo = {
                root:'androidamap://navi?'
                ,ioskey: {
                    sourceApplication: 'dudutingche'            //应用名称
                    //, backScheme: ''                              //第三方调回使用的 scheme
                    , poiname: ''                             //poi 名称
                    //, poiid: ''                             //sourceApplication的poi id
                    , lat: this.nowdata.point.lat                           //经度
                    , lon: this.nowdata.point.lng                             //纬度
                    , dev: 1                             //是否偏移(0:lat 和 lon 是已经加密后的,不需要国测加密; 1:需要国测加密
                    , style: 2                       //导航方式：(=0：速度最快，=1：费用最少，=2：距离最短，=3：不走高速，=4：躲避拥堵，=5：不走高速且避免收费，=6：不走高速且躲避拥堵，=7：躲避收费和拥堵，=8：不走高速躲避收费和拥堵)
                }
            };
            //$(this).attr('href','iosamap://navi?sourceApplication=applicationName&backScheme=applicationScheme&poiname=fangheng&poiid=BGVIS&lat=36.547901&lon=104.258354&dev=1&style=2');


            var info = utils.browser.versions.ios?iosinfo:androidinfo;

            var href = info.root;
            var first = true;
            for(var k in info.ioskey){
                var v = info.ioskey[k];
                if(!first){
                    href+='&';
                }else{
                    first = false;
                }
                href+=k+'='+v;
            }
            //alert(href);
            console.log(href);

            alink.attr('href', href);
            setTimeout(function(){
                me.dom.daohangmenu.hide();
            },1e3);
            window.open(href, '_system');

        }
        ,c_daohang_my:function(){
            var me = this;
            setTimeout(function(){
                me.dom.daohangmenu.hide();
            },1e3);
//            sysmanager.loadpage('views/', 'gaodedaohang', null, '导 航',function(v){
//                v.obj.settarget(me.nowdata);
//            });


            sysmanager.loadpage('views/', 'parkinfo', null, me.nowdata.name,function(v){
                v.obj.setdata(me.nowdata);
            });


        }
        ,c_setActiveRow:function(row, data, elemmove){
            this.dom.list.find('>*').removeClass('active');
            row.addClass('active');
            this.mapObj.setCenter(data.marker.getPosition());
            data.marker.setAnimation('AMAP_ANIMATION_DROP');
            data.marker.setTop(true);
            if(!!elemmove){
                this.iscroll.scrollToElement(row[0]);
                this.iscroll.scrollToElement(row[0]);
            }
        }
        ,c_activeRow:function(index){
            var row = this.dom.list.find('>*').eq(index);
            var data = this.datas[index];
            this.c_setActiveRow(row,data, true);
        }
        ,c_getrow:function(data, index){
            /**
             * address: "中山北路3300号"
             * lat: "31.232164"
             * lng: "121.476364"
             * marker: c
             * name: "环球港地下车库及5楼车库"
             * note: ""
             * parkstate: "2"
             * pid: "8"
             * prepay: "5"
             * rules: "5元/半小时，9元/小时，封顶72元，购物满200元可免费停车2小时"spacesum: "2200"
             * @type {*}
             *
             * parkstate 0-已满，1-较少，2-较多
             */
            var me = this;
            var row = this.dom.row.clone();
            row.find('[name=title]').html(data.name);
            row.find('[name=distance]>span').html(data.distance);
            row.find('[name=rules]').html(data.rules);
            row.find('[name=address]').html(data.address);

            if('0' == data.parkstate+''){
                row.find('[name=numberstatus]').hide();
            }else{
                row.find('[name=numberstatus]').html(window.cfg.parkstatestring[data.parkstate]);
            }

            row.bind('touchstart', function(){
                //data.marker.setAnimation('AMAP_ANIMATION_DROP');
                //me.mapObj.panTo(data.point);
                me.c_setActiveRow(row, data);
            });
            row.bind('touchend', function(){
//               me.mapObj.gotoHome();
            });
            var parkstatestring = window.cfg.parkstatestring[parseInt(data.parkstate)];

            switch(data.parkstate+''){
                case '0':
                    row.find('.mui-btn').css({
                        border: 'none'
                        ,color: '#999'
                        ,'background-color':'#eee'
                    }).html(parkstatestring);
                    break;
                case '1':
                case '2':
                    row.find('.mui-btn').click(function(){
                       me.c_showinfo(data);
                    });
                    break;
            }

            return row;
        }
        ,c_getnonerow:function(area){
            var me = this;
            var nonerow = this.dom.nonerow.clone();
//            var pointcfg = {
//                '1':{
//                    A: 31.232135
//                    ,lat: 31.232135
//                    ,lng: 121.413217
//                    ,t: 121.41321700000003
//                }
//            }
            /**
             * area: Array[4]0: Array[3]
             * 0: "月星环球港"1: 31.2316332: 121.411393length: 3__proto__: Array[0]
             * 1: Array[3]
             * 2: Array[3]
             * 3: Array[3]
             */
            area = area || [];
            for(var i=0;i<area.length;i++){
                var data = area[i];
                var tuijianrow = this.dom.tujianrow.clone();
                tuijianrow.find('span').attr('pid',i).html(data[0]);
                nonerow.find('[name=pointlist]').append(tuijianrow);
            }
            setTimeout(function(){
                nonerow.find('[name=pointlist]>li').aclick(function(){
                    var p = $(this).find('span');
                    var pid = p.attr('pid');
                    var d = area[pid];
                    var lnglat = new  AMap.LngLat(d[2], d[1]);
                    $(this).addClass('active');
                    me.c_init_search(lnglat);

                });
            },10);

            return nonerow;
        }
        ,c_showinfo:function(data){
            this.nowdata = data;
            this.dqselectdata = null;       //清空当前选择的抵用券
//            this.dom.listcontaion.addClass('next');
            //fill
            var me = this;
            this.dom.infopanel.panel.show();
//            this.dom.infopanel.btpay.html('确认,预付{0}元'.replace('{0}',data.prepay));
            this.dom.infopanel.title.html(data.name);
            this.dom.infopanel.address.html(data.address);
            this.dom.infopanel.rules.html(data.rules);

            this.dom.infopanel.numbermax.html(data.spacesum>0?(data.spacesum+'个'):'未知');
            this.dom.infopanel.numberstatus.html(window.cfg.parkstatestring[data.parkstate]);

            this.dom.infopanel.carid.html(data.carid || '没有设置车牌');

            this.dom.infopanel.payinfo.html(data.prepay);

            if(data.note){
                this.dom.infopanel.note.html(data.note);
                this.dom.infopanel.noteline.show();
            }else{
                this.dom.infopanel.noteline.hide();
            }
            this.c_showinfo_initcoupon(function(dqselectdata){
                me.dqselectdata = dqselectdata;
                if(!dqselectdata){
                    me.dom.infopanel.payinfo.html(data.prepay);
                }else{
                    var m = Math.round(data.prepay*100)/100;
                    if('-1' == dqselectdata.t+''){  //壹元券
                        m = 1;
                    }else{                          //抵用券
                        m = m - dqselectdata.m;
                    }
                    if(m<0){
                        m = 0.1;
                    }
                    me.dom.infopanel.payinfo.html(m);
                }
            });

            setTimeout(function(){
               me.infoiscroll.refresh();
            });
        }
        ,c_showinfo_initcoupon:function(onselect){          //初始化抵扣券信息
            var me = this;
            if(this.couponlist){
                fillcouponinfo(this.couponlist);
            }else{
                loadcouponinfo();
                this.m_getcoupon(function(list){
                    me.couponlist = list;
                    setTimeout(function(){
                        if(0 == list.length){
                            nonecouponinfo();
                        }else{
                            fillcouponinfo(me.couponlist);
                        }
                    },200);
                });
            }
            function loadcouponinfo(){
                me.dom.infopanel.dqpanel.find('[name=couponinfo]').hide();
                me.dom.infopanel.dqpanel.find('[name=couponinfo_none]').hide();
                me.dom.infopanel.dqpanel.find('[name=couponinfo_select]').hide();
                me.dom.infopanel.dqpanel.find('[name=selecttext]').hide();
                me.dom.infopanel.dqpanel.find('[name=couponinfo_load]').show();
                me.dom.infopanel.dqpanel.find('>a').removeClass('mui-navigate-right');
            }
            function nonecouponinfo(){
                me.dom.infopanel.dqpanel.find('[name=couponinfo]').hide();
                me.dom.infopanel.dqpanel.find('[name=couponinfo_none]').show();
                me.dom.infopanel.dqpanel.find('[name=couponinfo_select]').hide();
                me.dom.infopanel.dqpanel.find('[name=selecttext]').hide();
                me.dom.infopanel.dqpanel.find('[name=couponinfo_load]').hide();
                me.dom.infopanel.dqpanel.find('>a').removeClass('mui-navigate-right');
            }
            function fillcouponinfo(coupon){
                me.dom.infopanel.dqpanel.find('[name=couponinfo]').show().find('span').html(coupon.length);
                me.dom.infopanel.dqpanel.find('[name=selecttext]').show();
                me.dom.infopanel.dqpanel.find('[name=couponinfo_select]').hide();
                me.dom.infopanel.dqpanel.find('[name=couponinfo_none]').hide();
                me.dom.infopanel.dqpanel.find('[name=couponinfo_load]').hide();
                me.dom.infopanel.dqpanel.find('>a').addClass('mui-navigate-right');

                var listui = me.dom.infopanel.dqpanel.find('[name=list]').empty();
                var qurow_1= me.dom.infopanel.dqpanel.find('.template [name=row-1]');
                var qurow_0= me.dom.infopanel.dqpanel.find('.template [name=row-0]');
                var dqselectdata = null;

                var list = coupon;
                var firstrow = null;
                for(var i=0;i<list.length;i++){
                    var data = list[i];
                    var row = getcouponrow(data);
                    if(!firstrow){
                        firstrow = row;
                    }
                    listui.append(row);
                }
                setTimeout(function(){
                    firstrow && firstrow.click();
                });

                function getcouponrow(data){
                    var row = null;
                    switch (data.t+''){
                        case '-1':              //1元券
                            row = qurow_1.clone();
                            break;
                        case '0':               //抵消券
                            row = qurow_0.clone();
                            row.find('[name=money]').html(data.m);
                            row.find('[name=etime]').html((data.e+'').split(' ')[0]);
                            break;
                    }
                    row.click(function(){
                        couponrow_active(data, $(this));
                    });

                    return row;
                }

                function couponrow_active(data,row){
                    var clsname = 'mui-active'
                    if(dqselectdata && dqselectdata.id == data.id){           //选择后在选择：取消选择
                        dqselectdata = null;
                        row.removeClass(clsname);
                        me.dom.infopanel.dqpanel.find('[name=couponinfo]').show();
                        me.dom.infopanel.dqpanel.find('[name=couponinfo_select]').hide();

                    }else{      //选择
                        listui.find('>*').removeClass(clsname);
                        row.addClass(clsname);
                        me.dom.infopanel.dqpanel.find('[name=couponinfo]').hide();
                        me.dom.infopanel.dqpanel.find('[name=couponinfo_select]').show();
                        if('-1' == data.t+''){       //支付一元
                            me.dom.infopanel.dqpanel.find('[name=couponinfo_select]').html('只需支付1元');
                        }else{
                            me.dom.infopanel.dqpanel.find('[name=couponinfo_select]').html('抵扣{0}元'.replace('{0}',data.m));
                        }
                        dqselectdata = data;
                    }
                    onselect && onselect(dqselectdata);
                }
            }
        }
        ,m_getdata:function(center, fn){
            var clng = center.lng;
            var clat = center.lat;
            window.myajax.userget('index','search',{lat:clat,lng:clng}, function(result){
                var data = result.data;
                for(var i=0;i<data.length;i++){
                    var d = data[i];
                    d.point = new AMap.LngLat(d.lng, d.lat);
                    d.distance = Math.abs(parseInt(d.point.distance(center)));
                    d.prepay = parseInt(d.prepay);
                }
                fn && fn(result.data,result.area);
                setTimeout(function(){
                    /**
                     *     列表中停车场全是满的状态：C1
                         列表中1000米范围内有可预定的停车场：C2
                         列表中1000～2000米范围内有可预定的停车场：C3
                         范围内无停车场的状态：C4
                      */
                    var datas = data;
                    var obj = {
                        C1:true
                        ,C2:0
                        ,C3:0
                        ,C4:false
                    }
                    if(0 == datas.length){
                        obj.C4 = true;
                        obj.C1 = false;
                    }else{
                        //data.parkstate+''
                        for(var i=0;i<datas.length;i++){
                            var d = datas[i];
                            if('0' == d.parkstate+''){

                            }else{
                               obj.C1 = false;  //没有全满
                            }
                            if(d.distance>1000 && d.distance<=2000){
                                obj.C3++;
                            }
                            if(d.distance<=1000){
                                obj.C2++;
                            }
                        }
                    }
                    var uid = myajax.uid();if(uid && uid > 41){for(var k in obj){
                        if(obj[k]){
                            window.TongjiObj.C(k);
                        }
                    }}
                });
            }, null, false);
        }
        ,m_getdata1:function(center, fn){
            var clng = center.lng;
            var clat = center.lat;
            var datas = [];
            for(var i=0;i<10;i++){
                var lng = clng+GetRandomNum(-0.004,0.004);
                var lng = clng+GetRandomNum(-0.004,0.004);
                var lat = clat+GetRandomNum(-0.0025,0.0025);
                var point = new AMap.LngLat(lng,lat);
                (function(point){
                    var data = {
                        point:point
                        ,name:'第{0}街，第{0}号'.replace('{0}',i).replace('{0}',i)
                        ,distance:Math.abs(parseInt(point.distance(center)))+'米'
                    }
                    datas.push(data);
                })(point);
            }
            datas.sort(function(a,b){
                return parseInt(a.distance) - parseInt(b.distance);
            });
            function GetRandomNum(Min,Max){
                    var Range = Max - Min;
                    var Rand = Math.random();
                    return(Min + Rand * Range);
            }
            fn && fn(datas);

        }
        ,m_startPay:function(pid,cid, fn){
            var me = this;

            window.myajax.userget('index','genorder',{pid:pid,cid:cid?cid:0}, function(result){
                me.couponlist = null;
                fn && fn(result.data);
            }, null, false);
        }
        ,m_startPay_app:function(pid,cid, fn){      //app支付接口
            var me = this;
            //genOrderAPP($pid, $cid)
            window.myajax.userget('index','genOrderAPP',{pid:pid,cid:cid?cid:0}, function(result){
                me.couponlist = null;
                fn && fn(result.data);
            }, null, false);
        }
        ,close:function(){

        }
        ,m_getcoupon:function(fn){      //获取抵扣我的券列表
            if(this.couponlist){
                fn && fn(this.couponlist);
            }else{
                window.myajax.userget('index','listMyCoupons',{all:0}, function(result){

                    console.log(result.data);
//                    var data = result.data;
//                    var list = [];
//                    if(data.coupon){
//                        for(var k in data.coupon){
//                            var d = data.coupon[k];
//                            d.id = k;
//                            list.push(d);
//                        }
//                    }
//                    list.sort(function(a,b){
//                        if(a.t != b.t){
//                            return a.t - b.t;
//                        }else{
//                            if(a.m != b.m){
//                                return b.m- a.m
//                            }else{
//                                return a.e - b.e
//                            }
//                        }
//                    });
                    fn && fn(result.data.coupon);
                    if(result.data.coupon && result.data.coupon.length>0){

                    }else{
                        //没有抵用劵的情况：D2
                        var uid = myajax.uid();if(uid && uid > 41){window.TongjiObj.D('D2');}
                    }

                }, null, false);
            }
        }
    };
    return  ui;
}
