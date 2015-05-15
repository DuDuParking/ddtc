/**
 * Created with JetBrains WebStorm.
 * User: kk
 * Date: 15-1-9
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
function ui_myorder(){
    var ui = {
        isInit: false
        ,context:null
        ,dom:{
            row:'.template [name=row]'
            ,list:'[name=list]'
            ,scrollpanel:'[name=scrollpanel]'
            ,test:'.test'
            ,btclearlogin:'[name=btclearlogin]'
        }
        ,iscroll:null
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

            this.m_getorder(function(data){
                me.c_fill(data);
            });

            //this.dom.test.html(JSON.stringify(myajax.userinfo()));
        }
        ,c_fill:function(data){
            var me = this;
            this.dom.list.empty();
            for(var i=0;i<data.length;i++){
                var d = data[i];
                var row = this.c_getrow(d);

                this.dom.list.append(row);
            }

            setTimeout(function(){
                me.iscroll && me.iscroll.refresh();
            })

        }
        ,c_getrow:function(data){
            var me = this;
            var row = this.dom.row.clone();
            row.find('[name=title]').html(data.parkname);
            row.find('[name=time]').html(data.startTime);
            row.find('[name=address]').html(data.address);
            row.find('[name=cost]').html(data.cost);
            
            row.find('[name=btdetail]').aclick(function(){
                me.c_paydetail(data.oid);
            });
            
            return row;
        }
        ,c_paydetail:function(oid){
            var me = this;
            if(me.iscroll){
                me.iscroll.destroy();
                me.iscroll = null;
            }
            sysmanager.loadpage('views/', 'myorderdetail', null, '订单明细',function(v){
                v.obj.initoid(oid);
                v.obj.onclose = function(){
                    me.iscroll = new iScroll(me.context[0], {desktopCompatibility:true});
                    me.c_init();
                }
            });
        }
        ,c_cleatlogin:function(){
            myajax.clearInfo();
        }
        ,r_init:function(){
            var me = this;
            this.iscroll = new iScroll(this.context[0], {desktopCompatibility:true});
            this.dom.btclearlogin.aclick(function(){
                me.c_cleatlogin();
            });
        }
        ,m_getorder:function(fn){
            window.myajax.userget('index','getOrder',{last:0}, function(result){
                fn && fn(result.data);
            }, null, false);
        }
        ,close:function(){

        }
    };
    return  ui;
}
