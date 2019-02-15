<template>
    <d2-container class="page">
        <template slot="header">
            <el-button type="primary" size="small" round plain @click="scanning()">扫描订单</el-button>
            <el-button type="primary" size="small" round plain @click="orderTable()">刷新</el-button>
        </template>
        <el-table :data="data" border style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" min-width="200">
            </el-table-column>
            <el-table-column prop="actualAmt" label="实付金额" min-width="120">
            </el-table-column>
            <el-table-column prop="orderStatus" label="订单状态" min-width="120" :formatter="orderStatusChange">
            </el-table-column>
            <el-table-column prop="linkphone" label="用户手机号" min-width="120">
            </el-table-column>
            <el-table-column prop="payFlag" :formatter="payFlagChange" label="支付状态" min-width="120">
            </el-table-column>
            <el-table-column prop="payTime" label="支付时间" :formatter="dateFormat" min-width="170">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="printOrder(scope.row)" type="text" size="medium">打印</el-button>
                    <el-button type="text" @click="orderDetails(scope.row)" size="medium">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <template slot="footer">
            <el-pagination @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page.sync="pageNumber" 
            :page-size="pageSize" 
            :page-sizes="[5,10, 30, 50, 100]" 
            layout="sizes, prev, pager, next" 
            :total="total"
            >
            </el-pagination>
        </template>
        <el-dialog title="订单扫描" :visible.sync="dialogFormVisible" @closed="sizeFormDefault">
            <el-form ref="form" :model="sizeForm" label-width="80px">
                <el-form-item label="订单编号:">
                    <el-input v-model="sizeForm.orderNo" ref="scanInput" @input="sizeForm.orderNo.length == 22 ? scanInputFun() : '' "></el-input>
                </el-form-item>
                <el-form-item label="订单状态:">
                    <el-input v-model="sizeForm.orderStatus" class="noborder"></el-input>
                </el-form-item>
                <el-form-item label="支付时间:">
                    <el-input v-model="sizeForm.payTime" class="noborder" readonly></el-input>
                </el-form-item>
                <el-form-item label="支付状态:">
                    <el-input v-model="sizeForm.payFlag" class="noborder" readonly></el-input>
                </el-form-item>
                <el-form-item label="商品列表:"></el-form-item>
                <el-card class="box-card" v-show="dialogFormVisible3">
                    <div v-for="(item,index) in sizeForm.goods" :key="index" class="text item clear">
                        <p>
                            <span class="goodsname">{{item.goodsName }}</span>
                            <span class="goodsprice">{{item.salesPrice }}</span>
                            <span class="count">{{'x' + item.count }}</span>
                        </p>
                    </div>
                </el-card>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateOrderStatus" v-show="dialogFormVisible3">发货</el-button>
            </div>
        </el-dialog>
        <el-dialog title="订单详情" :visible.sync="dialogFormVisible2" @closed="sizeFormDefault">
            <el-form ref="form" :model="sizeForm2" label-width="80px">
                <el-form-item label="订单状态:">
                    <el-input v-model="sizeForm2.orderStatus" class="noborder"></el-input>
                </el-form-item>
                <el-form-item label="支付时间:">
                    <el-input v-model="sizeForm2.payTime" class="noborder" readonly></el-input>
                </el-form-item>
                <el-form-item label="支付状态:">
                    <el-input v-model="sizeForm2.payFlag" class="noborder" readonly></el-input>
                </el-form-item>
                <el-form-item label="商品列表:">
                </el-form-item>
                <el-card class="box-card">
                    <div v-for="(item,index) in sizeForm2.goods" :key="index" class="text item clear">
                        <p>
                            <span class="goodsname">{{item.goodsName }}</span>
                            <span class="goodsprice">{{item.salesPrice }}</span>
                            <span class="count">{{'x' + item.count }}</span>
                        </p>
                    </div>
                </el-card>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="打印详情" :visible.sync="dialogFormVisible4">
            <el-form ref="form" :model="sizeForm3" label-width="80px">
                <el-form-item label="订单编号:">
                    <el-input v-model="sizeForm3.orderNo" class="noborder"></el-input>
                </el-form-item>
                <el-form-item label="打印时间:">
                    <el-input v-model="sizeForm3.thisTime" class="noborder" readonly></el-input>
                </el-form-item>
                <el-table :data="sizeForm3.goods" style="width: 100%;margin:20px 0; border-bottom:1px dashed #606266;border-top:1px dashed #606266;">
                    <el-table-column prop="goodsName" label="品名">
                    </el-table-column>
                    <el-table-column prop="salesPrice" label="单价">
                    </el-table-column>
                    <el-table-column prop="count" label="数量">
                    </el-table-column>
                    <el-table-column prop="actualAmt" label="金额">
                    </el-table-column>
                </el-table>
                <el-form-item label="总计金额:">
                    <el-input v-model="sizeForm3.orderAmt" class="noborder" readonly></el-input>
                </el-form-item>
                <el-form-item label="折扣金额:">
                    <el-input v-model="sizeForm3.discountAmpunt" class="noborder" readonly></el-input>
                </el-form-item>
                <el-form-item label="应付总额:">
                    <el-input v-model="sizeForm3.actualAmt" class="noborder" readonly></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible4 = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible4 = false">打 印</el-button>
            </div>
        </el-dialog>
    </d2-container>
</template>

<script>
import {
  IndexTable,
  orderDetails,
  orderCheck,
  updateOrderStatus
} from "../../api/sys.indexTable";
import cookies from "../../libs/util.cookies";

export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
        dialogFormVisible4: false,
      pageNumber: 1,
      pageSize: 10,
      total: 1,
      data: [],
      sizeForm: {
        orderNo: "",
        orderStatus: "",
        actualAmt: "",
        payTime: "",
        payFlag: "",
        goods: ""
      },
      sizeForm2: {
        orderNo: "",
        orderStatus: "",
        actualAmt: "",
        payTime: "",
        payFlag: "",
        goods: ""
      },
      sizeForm3: {
        orderNo: "",
        thisTime: "",
        actualAmt: "",
        discountAmpunt: "",
        orderAmt: "",
        goods: ""
      },
      options: {}
    };
  },
  methods: {
    //表格
    orderTable() {
      IndexTable({
        entryStoreId: 1,
        entryStoreId: cookies.get('entryStoreId')||"",
        linkphone: "",
        orderStatus: "",
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
        .then(async res => {
            if(res.code == "success"){
                this.data = res.data;
                this.total = res.total || 1;
            }else{
                this.$router.replace('/login');
            }
          
        })
        .catch(err => {
            this.$router.replace('/login');
            console.log("err: ", err);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.orderTable();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.orderTable();
    },
    //扫描
    scanning() {
      this.dialogFormVisible = true;
      this.$nextTick(function() {
        this.$refs.scanInput.focus();
      });
    },
    //扫描框改变值
    scanInputFun() {
    //   if (this.sizeForm.orderNo.length !== 22) {
    //     return false;
    //   }
      orderCheck({
        orderNo: this.sizeForm.orderNo
      })
        .then(async res => {
            console.log(res)
          if (res.code == "success") {
            this.orderDetails2(this.sizeForm.orderNo);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          console.log("err: ", err);
        });
    },
    //打印
    printOrder(row) {
        this.dialogFormVisible4 = true;
        orderDetails({
            orderNo: row.orderNo
        })
        .then(async res => {
          const data = res.data;
          this.sizeForm3 = {
            orderNo: row.orderNo,
            thisTime: this.dateFormat("", "", new Date().getTime()),
            orderAmt: this.nullChange(data.orderAmt),
            discountAmpunt: this.nullChange(data.orderAmt-data.actualAmt),
            actualAmt: this.nullChange(data.actualAmt),
            goods: data.goods,
          };
        })
        .catch(err => {
          console.log("err: ", err);
        });
    },
    //订单已完成
    updateOrderStatus() {
      updateOrderStatus({
        orderNo: this.sizeForm.orderNo
      })
        .then(async res => {
          if (res.code == "success") {
            this.dialogFormVisible = false;
            this.orderTable();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          console.log("err: ", err);
        });
    },
    //订单扫描查询详情
    orderDetails2(orderno) {
        this.dialogFormVisible3 = true;
        orderDetails({
            orderNo: orderno
        })
        .then(async res => {
        let data = res.data;
        this.sizeForm = {
            orderNo: orderno,
            orderStatus: this.orderStatusChange("", "", data.orderStatus),
            actualAmt: data.actualAmt,
            payTime: this.dateFormat("", "", data.payTime),
            payFlag: this.payFlagChange("", "", data.payFlag),
            goods: data.goods
        };
        })
        .catch(err => {
        console.log("err: ", err);
        });
    },
    //订单详情
    orderDetails(row) {
      this.dialogFormVisible2 = true;
      orderDetails({
        orderNo: row.orderNo
      })
        .then(async res => {
          let data = res.data;
          this.sizeForm2 = {
            orderNo: data.orderNo,
            orderStatus: this.orderStatusChange("", "", data.orderStatus),
            actualAmt: data.actualAmt,
            payTime: this.dateFormat("", "", data.payTime),
            payFlag: this.payFlagChange("", "", data.payFlag),
            goods: data.goods
          };
        })
        .catch(err => {
          console.log("err: ", err);
        });
    },
    orderStatusChange(row, col, value, index) {
      if (!value) return "";
      switch (value) {
        case 10110002:
          value = "待确认";
          break;
        case 10110005:
          value = "待支付";
          break;
        case 10110010:
          value = "待发货";
          break;
        case 10110015:
          value = "待收货";
          break;
        case 10110040:
          value = "已完成";
          break;
        case 10110055:
          value = "售后中";
          break;
        case 10110060:
          value = "已退货";
          break;
      }
      return value;
    },
    payFlagChange(row, col, value, index) {
      if (!value) return "";
      switch (value) {
        case "0":
          value = "未支付";
          break;
        case "1":
          value = "已支付";
          break;
        case "2":
          value = "支付失败";
          break;
      }
      return value;
    },
    dateFormat(row, col,timestamp,index) {
        if(timestamp == null || timestamp == ""){
            return ''  
        }else{
            let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() ;
            let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours()  + ':';
            let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes()  + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()  ;
            return Y+M+D+' '+h+m+s  
        }
    },
    sizeFormDefault() {
      const obj = {
        orderNo: "",
        orderStatus: "",
        actualAmt: "",
        payTime: "",
        payFlag: "",
        goods: ""
      };
      this.sizeForm = obj;
      this.sizeForm2 = obj;
      this.dialogFormVisible3 = false;
    },
    nullChange(val){
        if(val == null || val == undefined || isNaN(val)){
            return 0
        } else{
            return val;
        }
    }
  },
  created() {
      setTimeout(()=>{
        this.orderTable();
      },100)
  }
};
</script>

<style lang="scss">

.el-form-item{
    margin: 0px;
}
.el-input__inner {
  height: 30px;
  line-height: 30px;
}
.noborder {
  .el-input__inner {
    border: none;
  }
}
.box-card {
  .text {
    font-size: 14px;
  }
  .item {
    border-bottom: 1px solid #eee;
    padding: 15px 0px;
    span {
      float: left;
      width: 13%;
    }
    .goodsname {
      width: 74%;
    }
    p {
      margin: 0;
    }
  }
    .item:last-child{
        border-bottom: 0;
    }
  .right {
    float: right;
  }
}
.el-dialog__body {
  max-height: 550px;
  padding: 10px;
  overflow: auto;
}
.clear::after {
  content: "";
  height: 0;
  overflow: hidden;
  clear: both;
  display: block;
}
</style>
