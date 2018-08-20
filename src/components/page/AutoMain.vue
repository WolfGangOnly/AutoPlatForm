<template>
	<div class="AutoMain" id="main">
		<div class="mainheader" id="mainheader">
			<el-row type="flex" class="row-header" justify="space-between">
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<el-button-group style="float: left;margin-left:16px;">
							<el-dropdown trigger="click" style="float: left;" @command="handleCommand">
								<el-button type="info" icon="el-icon-plus" plain style="border-left-color: #D3D4D6">
									<span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon--right"></i></span>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="DetailInfo">单步骤</el-dropdown-item>
									<el-dropdown-item command="History">多步骤</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<el-button type="info" icon="el-icon-caret-right" plain>批量执行</el-button>
							<el-button type="info" icon="el-icon-delete" plain>批量删除</el-button>
						</el-button-group>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
							<!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
								<el-option label="餐厅名" value="1"></el-option>
								<el-option label="订单号" value="2"></el-option>
								<el-option label="用户电话" value="3"></el-option>
							</el-select> -->
							<el-button slot="append" icon="el-icon-search"></el-button>
						</el-input>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<el-button type="info" icon="el-icon-refresh" @click="getSysInfo()" style="float: right;margin-right:16px;margin-top: 9px;" plain></el-button>
					</div>
				</el-col>
			</el-row>
			<el-table v-loading="loading" ref="multipleTable" :data="tableData" tooltip-effect="dark" max-height="358" style="width: 100%" @selection-change="handleSelectionChange" :default-sort="{prop: 'as_no', order: 'ascending'}" @row-click="clickDataRow">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column label="编号" width="150" prop="as_no" fixed="left">
					<template slot-scope="scope">{{ scope.row.as_no }}</template>
				</el-table-column>
				<el-table-column prop="as_name" label="名称" width="300" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="as_link" label="关联" width="150">
				</el-table-column>
				<el-table-column prop="as_author" label="负责人" width="150">
				</el-table-column>
				<el-table-column prop="as_createdate" label="创建日期" sortable>
				</el-table-column>
				<el-table-column prop="as_modifydate" label="更新日期" sortable>
				</el-table-column>
				<el-table-column prop="handle" label="操作" width="150" fixed="right">
					<template slot-scope="scope">
						<el-row>
							<el-button type="primary" size="mini" icon="el-icon-caret-right" circle @click="runSys(scope.row)"></el-button>
							<el-popover placement="top" width="160" :ref="`popover-${scope.$index}`">
								<p>Hi，我要被删除咯？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
									<el-button type="primary" size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose(),deleteRow(scope.$index, tableData)">确定</el-button>
								</div>
								<el-button type="danger" slot="reference" size="mini" icon="el-icon-delete" circle></el-button>
							</el-popover>
						</el-row>
					</template>
				</el-table-column>
			</el-table>
			<!-- <div style="margin-top: 20px">
				<el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
				<el-button @click="toggleSelection()">取消选择</el-button>
			</div> -->
		</div>
		<div class="mainfooter" id="mainfooter">
			<el-row type="flex" class="row-footer" justify="space-between">
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<el-button-group style="float: left;margin-left:16px;">
							<el-button type="info" icon="el-icon-edit" plain>编辑</el-button>
							<el-button type="info" @click="saveSysDetailInfoChild()" plain><i class="iconfont icon-save el-icon--left"></i>保存</el-button>
							<el-button type="info" icon="el-icon-close" plain>取消</el-button>
						</el-button-group>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple">
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<el-button-group style="float: right;margin-right:16px;">
							<el-button type="info" icon="el-icon-time" plain @click="changePage('History')" ref="history"></el-button>
							<el-button type="info" icon="el-icon-document" plain  @click="changePage('Message')"></el-button>
							<el-button type="info" icon="el-icon-refresh" plain @click="changePage('DetailInfo')"></el-button>
						</el-button-group>
					</div>
				</el-col>
			</el-row>
			<!-- 详细信息页 -->
			<div :is="currentView" ref="currentView" class="detail" v-bind:multipleSelection="multipleSelection" v-on:childByValue="childByValue"  v-loading="loadingDetail">
			</div>
		</div>
	</div>
</template>
<script>
import DetailInfo from '@/components/datacenter/DetailInfo'
import History from '@/components/datacenter/History'
import Message from '@/components/datacenter/Message'
export default {
	name: 'AutoMain',
	components: {
		DetailInfo,
		History,
		Message,
	},
	created: function() {


	},
	mounted: function() {
		var orderHeight = document.documentElement.clientHeight;
		document.getElementById("main").style.height = orderHeight + 'px';
		document.getElementById("mainheader").style.height = orderHeight * (7 / 16) + 'px';
		document.getElementById("mainfooter").style.height = orderHeight * (9 / 16) + 'px';

		// this.getSysConfigInfo();
		this.getSysInfo();


	},

	// data() {
	data() {
		return {
			//组件
			DetailInfo: 'DetailInfo',
			History: 'History',
			currentView: 'DetailInfo',

			input5: '',
			select: '',

			tableData:[],
			// tableData: [{
			// 	as_no: 1,
			// 	as_name: '个人本币活期开户',
			// 	as_trancode: '46420',
			// 	as_author: 'shen',
			// 	as_createdate: 456456456465456456465,
			// 	as_modifydate: 456465454654564545646,
			// }],
			multipleSelection: [],
			loading: false,
			loadingDetail:false,
		}
	},
	methods: {
	
		
		//下拉框指令
		handleCommand(command) {
			if (this.$refs.currentView.$el.scrollTop !== 0) {
				this.$refs.currentView.$el.scrollTop=0;
			}
			
			this.loadingDetail = true; 
     		setTimeout(() => { 
     			this.loadingDetail = false; 
     			if (this.currentView === command) {

     				this.$refs.currentView.clearSysInfo();
     			} 
     			this.currentView = command;
     			
     		}, 500); 
			// this.changeLoadingStatus("loadingDetail");
        	
      	},
	
		//单步骤数据push
		childByValue: function(childValue) {
			// childValue就是子组件传过来的值
			// var date = new Date();
   //  		var seperator1 = "-";
   //  		var seperator2 = ":";
   //  		var month = date.getMonth() + 1;
   //  		var strDate = date.getDate();
   //  		if (month >= 1 && month <= 9) {
   //      		month = "0" + month;
   //  		}
   //  		if (strDate >= 0 && strDate <= 9) {
   //      		strDate = "0" + strDate;
   //  		}
   //  		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
   //          + " " + date.getHours() + seperator2 + date.getMinutes()
   //          + seperator2 + date.getSeconds();
			// let num = this.tableData.length + 1;
			// let tableDataTemp = {
			// 	as_no: num,
			// 	as_name: childValue.as_name,
			// 	as_link: '否',
			// 	as_author: childValue.as_author,
			// 	as_createdate: currentdate,
			// 	as_modifydate: currentdate,
			// }
			// this.tableData.push(tableDataTemp)
			
		},

		//批量执行
		runBatchSys() {
			//获取已选中的信息

		},
		//单个执行，传递执行信息，交给后台处理
		runSys(info) {
			//中转bus传值，其它组件可使用变量singlerun
			this.$root.bus.$emit('singlerun', info.as_no);

			
		},
		saveSysDetailInfoChild() {
			this.$refs.currentView.saveSysDetailInfo("ruleform");

		},

		//切换详细信息页到历史结果页
		changePage(pageName) {

			if (pageName === "History") {
				if (this.multipleSelection.length === 0) {

					let buttonSet = this.$refs.history.$el.offsetParent.offsetTop + 50;
					this.$notify.info({
						title: '提示',
						message: 'Hi，选中一条记录才能查看哦！',
						
						// position: 'bottom-right',
						offset: buttonSet,
					});
				} else {

					this.currentView = pageName;
				}

			} else {
				if (this.currentView === "DetailInfo") {
					this.$refs.currentView.getSysDetailInfo(this.multipleSelection);
				} 
					this.currentView = pageName;
				

			}

		},

		//获取主要数据
		getSysInfo() {
			this.loading = true;
			this.$refs.multipleTable.clearSelection();
			this.multipleSelection = [];
			this.tableData = null;
			this.$ajax({
					method: 'get',
					url: 'http://localhost:6062/autotest/searchSysInfo',
					dataType: "json",
				})
				.then((response) => {
					let status = response.data.resCode;
					let msg = response.data.resMsg;
					
					if ('success' === status) {
						let jsonData = JSON.parse(response.data.resResult);
						console.log(jsonData);
					    this.tableData = jsonData;

					} else {
						this.$message.error('Hi，获取数据失败啦！');
					}
					
					this.loading = false;

					
				})
				.catch((error) => {
					this.$message.error('Hi，' + error);
					this.loading = false;
				});

		},

		toggleSelection(rows) {
			if (rows) {
				rows.forEach(row => {
					this.$refs.multipleTable.toggleRowSelection(row);
				});
			} else {
				this.$refs.multipleTable.clearSelection();
			}
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		//删除行
		deleteRow(index, rows) {
			this.loading = true;
			this.$ajax({
					method: 'post',
					url: 'http://localhost:6062/autotest/deleteSysInfo',
					dataType: "json",
					data:{
						as_no:rows[index].as_no,
					},
				})
				.then((response) => {
					let status = response.data.resCode;
					let msg = response.data.resMsg;
					
					if ('success' === status) {
						rows.splice(index, 1);
					} else {
						this.$message.error('Hi，删除数据失败啦！');
					}
					
					this.loading = false;

					
				})
				.catch((error) => {
					this.$message.error('Hi，' + error);
					this.loading = false;
				});
		},
		clickDataRow(rows) {
			if (this.multipleSelection.length === 0) {
				this.$refs.multipleTable.toggleRowSelection(rows, true);
			} else {
				this.$refs.multipleTable.clearSelection();
				this.$refs.multipleTable.toggleRowSelection(rows, true);
			}
			//加载一些组件

			if (this.currentView === "DetailInfo") {
				this.$refs.currentView.getSysDetailInfo(this.multipleSelection);
			} else {
				this.currentView = "DetailInfo";

			}


			// this.$ajax({
			// 		method: 'get',
			// 		url: '/AutoMain',
			// 		data: {
			// 			name: 'wise',
			// 			info: 'wrong'
			// 		}
			// 	})
			// 	.then(function(response) {
			// 		console.log(response);
			// 	})
			// 	.catch(function(error) {
			// 		console.log(error);
			// 	});

		},

	}
}

</script>
<!-- Add"scoped" attribute to limit CSS to this component only -->
<style scoped>
.row-baseinfo {
	padding: 5px 0;
	/*background-color: #f9fafc;*/
	min-height: 200px;
	width: 100%;
	margin: auto;
}



.iconfont {
	font-size: 1em;
}








/*.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
	background: #40BBFF;
	border-color: #4079FF;
	color: #fff
}

.el-button--info.is-plain:active {
	background: #40BBFF;
	border-color: #4079FF;
	color: #fff;
	outline: 0;
}*/

.el-button-group {
	margin-top: 9px;
	margin-left: 50px;
	float: left;
}

.el-select {
	width: 130px;
}

.el-input {
	width: 100%;
}

.input-with-select {
	/*background-color: #fff;*/
	margin-top: 9px;
	/*padding: 10px;*/
}

.el-input-group__prepend {
	/*background-color: #fff;*/
	/*margin-top: 9px;*/
	/*padding: 10px;*/
}

.AutoMain {
	height: 100%;
	width: 100%;
}

.el-row {
	margin-bottom: 0px;
	&:last-child {
		margin-bottom: 0;
	}
}

.row-header {
	padding: 0px 0;
	background-color: #f9fafc;
	min-height: 13.4%;
}

.row-footer {
	padding: 0px 0;
	background-color: #f9fafc;
	min-height: 11%;
}

.row-titleinfo {
	padding: 10px 0;
	/*background-color: #f9fafc;*/
	min-height: 100px;
	width: 99%;
	margin: auto;
}

.el-col {
	border-radius: 4px;
}

.bg-purple-dark {
	background: #ECF5FF;
}

.grid-content {
	border-radius: 4px;
	min-height: 100%;
}

.mainheader {
	float: left;
	width: 100%;
	/*background-color: #B7B7B7;*/
	overflow: auto;
	/*border-bottom: solid 1px #e6e6e6;*/
}

.mainfooter {
	float: left;
	width: 100%;
	/*background-color: #B7B7B7;*/
	overflow: auto;
}

.detail {
	width: 100%;
	height: 89%;
	float: left;
	/*background-color: #B7B7B7;*/
	overflow: auto;
}

</style>
