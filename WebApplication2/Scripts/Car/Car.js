$(function () {
    var datagrid; //定义全局变量datagrid
    var editRow = undefined; //定义全局变量：当前编辑的行
    datagrid = $("#tt").datagrid({
        url: '/Car/getCar', //请求的数据源
        iconCls: 'icon-search', //图标
        pagination: true, //显示分页
        pageSize: 15, //页大小
        pageList: [15, 30, 45, 60], //页大小下拉选项此项各value是pageSize的倍数
        fit: true, //datagrid自适应宽度
        fitColumn: false, //列自适应宽度
        striped: true, //行背景交换
        nowap: true, //列内容多时自动折至第二行
        border: false,
        idField: 'model_uid', //主键
        columns: [[//c.UserName, c.UserPass, c.Email, c.RegTime
            { field: 'ck', checkbox: true, align: 'left', width: 50 },
            { field: 'model_uid', title: 'model_uid', width: 80, editor: 'text' },
            { field: 'model_code', title: 'model_code', width: 120, editor: 'text' },
             { field: 'model_name', title: 'model_name', width: 120, editor: 'text' },
              { field: 'max_kgs', title: 'max_kgs', width: 50, editor: 'text' },
            { field: 'max_cbm', title: 'max_cbm', width: 50, editor: 'text' },
            { field: 'remark', title: 'remark', width: 120, editor: 'text' },
            { field: 'is_inactive', title: 'is_inactive', width: 50, editor: 'text' },
            { field: 'voided', title: 'voided', width: 50, editor: 'text' },
            { field: 'rec_crt_user', title: 'rec_crt_user', width: 50, editor: 'text' },
            { field: 'rec_upd_user', title: 'rec_upd_user', width: 50, editor: 'text' },
            { field: 'model_code', title: 'model_code', width: 120, editor: 'text' },
            //{
            //    field: 'rec_crt_date', title: 'rec_crt_date', width: 80, align: 'right',
            //    formatter: function (value, row, index) {
            //        return (eval(value.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"))).pattern("yyyy-M-d");
            //    }
            //},
            { field: 'rec_crt_date', title: 'rec_crt_date', width: 120, editor: 'datetimebox' },
            { field: 'rec_upd_date', title: 'rec_upd_date', width: 120, editor: 'datetimebox' },
            //{
            //    field: 'rec_upd_date', title: 'rec_upd_date', width: 80, align: 'right',
            //    formatter: function (value, row, index) {
            //        return (eval(value.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"))).pattern("yyyy-M-d");
            //    }
            //},
            { field: 'rpt_seq', title: 'rpt_seq', width: 50, editor: 'text' },
            {
                field: 'type', title: 'type', width: 80, editor:
                  {
                      type: 'combobox',
                      options: {
                          required: true,
                          editable: false,
                          data:
                              [
                                  { 'id': '1', 'text': 'type1' },
                                  { 'id': '2', 'text': 'type2' },
                                  { 'id': '3', 'text': 'type3' },
                                  { 'id': '4', 'text': 'type4' }
                              ],
                          panelHeight: '100',
                          valueField: 'id',
                          textField: 'text'
                      }
                  }
            },
            { field: 'cntr_weight', title: 'cntr_weight', width: 50, editor: 'text' },
            { field: 'size_type', title: 'size_type', width: 50, editor: 'text' }
        ]],
        queryParams: { action: 'query' }, //查询参数
        toolbar: [{
            text: '添加', iconCls: 'icon-add', handler: function () {//添加列表的操作按钮添加，修改，删除等
                //添加时先判断是否有开启编辑的行，如果有则把开户编辑的那行结束编辑
                if (editRow != undefined) {
                    datagrid.datagrid("endEdit", editRow);
                }
                //添加时如果没有正在编辑的行，则在datagrid的第一行插入一行
                if (editRow == undefined) {
                    datagrid.datagrid("insertRow", {
                        index: 0, // index start with 0
                        row: {
                        }
                    });
                    //将新插入的那一行开户编辑状态
                    datagrid.datagrid("beginEdit", 0);
                    //给当前编辑的行赋值
                    editRow = 0;
                }
            }
        }, '-',
         {
             text: '删除', iconCls: 'icon-remove', handler: function () {
                 //删除时先获取选择行
                 var rows = datagrid.datagrid("getSelections");
                 //选择要删除的行
                 if (rows.length > 0) {
                     $.messager.confirm("提示", "你确定要删除吗?", function (r) {
                         if (r) {
                             var ids = [];
                             for (var i = 0; i < rows.length; i++) {
                                 ids.push(rows[i].ID);
                             }
                             //将选择到的行存入数组并用,分隔转换成字符串，
                             //本例只是前台操作没有与数据库进行交互所以此处只是弹出要传入后台的id
                             alert(ids.join(','));
                         }
                     });
                 }
                 else {
                     $.messager.alert("提示", "请选择要删除的行", "error");
                 }
             }
         }, '-',
         {
             text: '修改', iconCls: 'icon-edit', handler: function () {
                 //修改时要获取选择到的行
                 var rows = datagrid.datagrid("getSelections");
                 //如果只选择了一行则可以进行修改，否则不操作
                 if (rows.length == 1) {
                     //修改之前先关闭已经开启的编辑行，当调用endEdit该方法时会触发onAfterEdit事件
                     if (editRow != undefined) {
                         datagrid.datagrid("endEdit", editRow);
                     }
                     //当无编辑行时
                     if (editRow == undefined) {
                         //获取到当前选择行的下标
                         var index = datagrid.datagrid("getRowIndex", rows[0]);
                         //开启编辑
                         datagrid.datagrid("beginEdit", index);
                         //把当前开启编辑的行赋值给全局变量editRow
                         editRow = index;
                         //当开启了当前选择行的编辑状态之后，
                         //应该取消当前列表的所有选择行，要不然双击之后无法再选择其他行进行编辑
                         datagrid.datagrid("unselectAll");
                     }
                 }
             }
         }, '-',
         {
             text: '保存', iconCls: 'icon-save', handler: function () {
                 //保存时结束当前编辑的行，自动触发onAfterEdit事件如果要与后台交互可将数据通过Ajax提交后台
                 var rows = $('#tt').datagrid('getRows');
                 var entities;
                 // 循环 datagrid 中现有的数据，并且逐行复制给Entities ，并且转换成json格式
                 // 在后台反序列话成对象的对象集合。
                 for(i = 0;i < rows.length;i++)
                 {
                     entities = entities  + JSON.stringify(rows[i]);  
                 }

                 $.ajax({
                     url: '/Car/SaveCar',
                     type: 'post',
                     async: true,
                     dataType: 'json',
                     data: {'entities': entities},
                     success: function (data) {
                     if(data.message=='操作成功！'){
                         alert(data.message);
                     }else{
                         alert(data.message);
                         return;
                     }
                     datagrid.datagrid("endEdit", editRow);
                     $('#tt').datagrid('reload');
                 }
             });
             }
         }, '-',
         {
             text: '取消编辑', iconCls: 'icon-redo', handler: function () {
                 //取消当前编辑行把当前编辑行罢undefined回滚改变的数据,取消选择的行
                 editRow = undefined;
                 datagrid.datagrid("rejectChanges");
                 datagrid.datagrid("unselectAll");
             }
         }, '-'],
        onAfterEdit: function (rowIndex, rowData, changes) {
            //endEdit该方法触发此事件
            console.info(rowData);
            
            editRow = undefined;
        },
        onDblClickRow: function (rowIndex, rowData) {
            //双击开启编辑行
            if (editRow != rowIndex) {
                if (endEditing()) {
                    $('#tt').datagrid('selectRow', rowIndex)
                        .datagrid('beginEdit', rowIndex);
                    editRow = rowIndex;
                } else {
                    $('#tt').datagrid('selectRow', editRow);
                }
            }
        }
    });
    function endEditing() {
        if (editRow == undefined) { return true }
        if ($('#tt').datagrid('validateRow', editRow)) {
            var id = $('#tt').datagrid('getEditor', { index: editRow, field: 'model_uid' });
            var model_uid = $(ed.target).combobox('getText');
            $('#tt').datagrid('getRows')[editRow]['model_uid'] = model_uid;
            $('#tt').datagrid('endEdit', editRow);
            editRow = undefined;
            return true;
        } else {
            return false;
        }
    }

    $('#limitTxt').textbox('textbox').attr('maxLength', 15);


    chk7_click();

});

var app = angular.module('myApp', []);
app.controller('personCtrl', function ($scope) {
    $scope.myVar = true;
    $scope.toggle = function () {
        $scope.myVar = !$scope.myVar;
    }
});


function chk7_click() {
    alert($('#chk7').prop("checked"));
    //if ($('#chk7').prop("checked") == "checked") {
    //    $("checkbox[name=team3]").attr('chkecked', true);
    //    $("checkbox[name=team3]").attr('disable', true);
    //}
    //else {
    //    $("checkbox[name=team3]").attr('chkecked', false);
    //    $("checkbox[name=team3]").attr('disable', false);
    //}
}