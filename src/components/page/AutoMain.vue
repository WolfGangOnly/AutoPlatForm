<template>
	<div class="AutoMain" id="main">
		<div class="mainheader" id="mainheader">
			<el-row type="flex" class="row-header" id="row-header" justify="space-between">
				<el-col :span="12">
					<div class="grid-content">
						<el-button-group>
							<el-dropdown trigger="click" style="float: left;" @command="handleCommand">
								<el-button type="info" icon="el-icon-plus" plain style="border-left-color: #D3D4D6">
									<span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon--right"></i></span>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="DetailInfo">单步骤</el-dropdown-item>
									<el-dropdown-item command="DetailInfoLink">多步骤</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<el-button type="info" icon="el-icon-caret-right" plain>批量执行</el-button>
							<el-button type="info" icon="el-icon-delete" plain>批量删除</el-button>
						</el-button-group>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content">
						<el-button-group style="float: right;margin-right:10px;">
							<el-button type="info" icon="el-icon-search" plain @click=""></el-button>
							
							<el-button type="info" icon="el-icon-refresh" @click="getSysInfo()" plain></el-button>
						</el-button-group>
						
						
					</div>
					
						
					
				</el-col>
			</el-row>
			<div class="systable" id="systable" style="width: 100%;">
				<el-table v-loading="loading" ref="multipleTable" :data="tableData" tooltip-effect="dark" height="100%" style="width: 100%;" @selection-change="handleSelectionChange" :default-sort="{prop: 'as_no', order: 'ascending'}" @row-click="clickDataRow">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column label="编号" width="50" prop="as_no" fixed="left">
						<template slot-scope="scope">{{ scope.row.as_no }}</template>
					</el-table-column>
					<el-table-column prop="as_name" label="名称" width="228" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="as_link" label="关联" width="55">
					</el-table-column>
					<el-table-column prop="as_author" label="负责人" width="125">
					</el-table-column>
					<el-table-column prop="as_createdate" label="创建日期" sortable>
					</el-table-column>
					<el-table-column prop="as_modifydate" label="更新日期" sortable>
					</el-table-column>
					<el-table-column prop="handle" label="操作" width="120" fixed="right">
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
			</div>
			<!-- <div style="margin-top: 20px">
				<el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
				<el-button @click="toggleSelection()">取消选择</el-button>
			</div> -->
		</div>
		<div class="mainfooter" id="mainfooter">
			<el-row type="flex" class="row-header" justify="space-between">
				<el-col :span="12">
					<div class="grid-content">
						<el-button-group>
							<el-button type="info" @click="saveSysDetailInfoChild()" plain :disabled="save"><i class="iconfont icon-save el-icon--left"></i>{{saveName}}</el-button>
							<el-button type="info" ref="modifyBtn" icon="el-icon-edit" @click="modifyData(false)" plain :disabled="modify">编辑</el-button>
							<el-button type="info" icon="el-icon-close" @click="modifyData(true)" plain :disabled="close">取消</el-button>
						</el-button-group>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content">
						<el-button-group style="float: right;margin-right:10px;">
							<el-button type="info" icon="el-icon-time" plain @click="changePage('History')" ref="history"></el-button>
							<el-button type="info" ref="messageBtn" icon="el-icon-document" plain @click="changePage('Message')"></el-button>
							<el-button type="info" icon="el-icon-refresh" plain @click="changePage('DetailInfo')"></el-button>
						</el-button-group>
					</div>
				</el-col>
			</el-row>
			<!-- 详细信息页 -->
			<div :is="currentView" ref="currentView" v-bind:multipleSelection="multipleSelection" v-on:childByValue="childByValue" v-loading="loadingDetail">
			</div>
		</div>
	</div>
</template>
<script>
import DetailInfo from '@/components/datacenter/DetailInfo'
import History from '@/components/datacenter/History'
import Message from '@/components/datacenter/Message'
import DetailInfoLink from '@/components/datacenter/DetailInfoLink'
export default {
	name: 'AutoMain',
	components: {
		DetailInfo,
		History,
		Message,
		DetailInfoLink,
	},
	created: function() {


	},
	mounted: function() {
		this.findDimensions();
		// let orderHeight = document.documentElement.clientHeight;
		// console.log(document.body.scrollHeight);

		// document.getElementById("row-header").style.height = rowheader;
		// 	document.getElementById("systable").style.height = table;
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
			DetailInfoLink:'DetailInfoLink',
			//按钮状态
			modify: false,
			save: true,
			close: true,

			saveName: '保存',
			input: '',
			select: '',

			tableData: [], //主要数据

			multipleSelection: [], //选中行
			loading: false,
			loadingDetail: false,
		}
	},
	methods: {
		//函数：获取尺寸
		findDimensions() {
			let winWidth = 0;
			let winHeight = 0;

			//获取窗口高度
			if (window.innerHeight) {
				winHeight = window.innerHeight;
			} else if ((document.body) && (document.body.clientHeight)) {
				winHeight = document.body.clientHeight;
			}

			//通过深入Document内部对body进行检测，获取窗口大小
			else if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
				winHeight = document.documentElement.clientHeight;
				winWidth = document.documentElement.clientWidth;
			}
			let mainheader = winHeight * (1 / 2) + 'px';
			let mainfooter = winHeight * (1 / 2) + 'px';
			document.getElementById("main").style.height = winHeight + 'px';
			document.getElementById("mainheader").style.height = mainheader;
			document.getElementById("mainfooter").style.height = mainfooter;
		},
		//下拉框指令
		handleCommand(command) {
			if (this.$refs.currentView.$el.scrollTop !== 0) {
				this.$refs.currentView.$el.scrollTop = 0;
			}

			this.loadingDetail = true;
			setTimeout(() => {
				this.saveName = "创建";
				this.close = false;
				this.save = false;
				this.modify = true;
				this.$refs.modifyBtn.$el.style.display = "none";
				this.currentView = command;
				if (command === "DetailInfo") {
					this.$nextTick(_ => {
						this.$refs.currentView.clearSysInfo();
						this.$refs.currentView.changeModifyStatus(false);
						this.$refs.currentView.loadDataName(this.tableData);
					});
				}
				
				this.loadingDetail = false;
			}, 500);
			// this.changeLoadingStatus("loadingDetail");

		},

		//单步骤数据push
		childByValue: function(childValue) {
			
			if (childValue) {
				this.$refs.messageBtn.$el.style.display = "none";
			} else {
				this.$refs.messageBtn.$el.style.display = "block";
			}
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
		//单个执行，提交执行信息，交给后台处理
		runSys(info) {
			//中转bus传值，其它组件可使用变量singlerun
			// this.$root.bus.$emit('singlerun', info.as_no);
			console.log(info);
			this.$ajax({
					method: 'post',
					url: 'http://localhost:6062/autotest/singleRun',
					dataType: "json",
					data:{
						aj_no:info.as_no,
						aj_link:info.as_link === "否" ? false : true,
					}
				})
				.then((response) => {
					let status = response.data.resCode;
					let msg = response.data.resMsg;
					
					if ("success" === status) {
						this.$message.success('Hi，已加入执行队列！');
					} else {
						this.$message.error('Hi，加入执行队列失败！');
					}
				})
				.catch((error) => {
					this.$message.error('Hi，' + error);
					
				});

		},
		saveSysDetailInfoChild() {
			if (this.$refs.currentView.$el.scrollTop !== 0) {
				this.$refs.currentView.$el.scrollTop = 0;
			}
			if (this.currentView === "DetailInfo" && this.saveName === "创建") {
				this.$refs.currentView.saveSysDetailInfo("ruleform");
				this.$refs.currentView.clearDataName();
			} else if (this.currentView === "DetailInfo" && this.saveName === "保存") {
				this.$refs.currentView.updateSysDetailInfo(this.multipleSelection);
			} else if (this.currentView === "Message" && this.saveName === "保存") {
				this.$refs.currentView.saveData(this.multipleSelection);
			}
		},

		//切换详细信息页到历史结果页
		changePage(pageName) {
			if (this.$refs.currentView.$el.scrollTop !== 0) {
				this.$refs.currentView.$el.scrollTop = 0;
			}
			this.loadingDetail = true;
			// this.loadingDetail = true;
			// setTimeout(() => {
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

				} else if (pageName === "Message") {

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
						this.$nextTick(_ => {

							this.$refs.currentView.getData(this.multipleSelection);

						});
					}

				} else {
					
					this.currentView = pageName;
					this.$nextTick(_ => {
						this.$refs.currentView.getSysDetailInfo(this.multipleSelection);
					});
				}
				this.$nextTick(_ => {
					this.modifyData(true);
				});
			// 	this.loadingDetail = false;
			// }, 500);
		},
		//默认选择第一行
		selectFirstTableRow(val) {
			this.$nextTick(_ => {
				this.$refs.multipleTable.setCurrentRow(val);
				this.$refs.multipleTable.toggleRowSelection(val, true);
				this.$refs.currentView.getSysDetailInfo(this.multipleSelection);
			});
		},
		//获取主要数据
		getSysInfo(val) {

			this.loading = true;
			this.loadingDetail = true;
			// this.$refs.multipleTable.clearSelection();
			// this.multipleSelection = [];
			// this.tableData = null;
			this.modifyData(true);
			this.$ajax({
					method: 'get',
					url: 'http://localhost:6062/autotest/searchSysInfo',
					dataType: "json",
				})
				.then((response) => {
					let status = response.data.resCode;
					let msg = response.data.resMsg;
					setTimeout(() => {
						if ('success' === status) {
							let jsonData = JSON.parse(response.data.resResult);
							this.tableData = jsonData;

							this.selectFirstTableRow(this.tableData[0]);
							if ("save" === val) {
								this.$message({
									message: 'Hi，创建成功！',
									type: 'success'
								});
								this.saveName = "保存";
								this.$refs.modifyBtn.$el.style.display = "block";
							} else if("update" === val) {
								this.$message({
									message: 'Hi，保存成功！',
									type: 'success'
								});
							}
							this.close = true;
							this.save = true;
							this.modify = false;
						} else {
							this.$message.error('Hi，获取数据失败！');
						}


						this.loading = false;
						this.loadingDetail = false;
					}, 200);

				})
				.catch((error) => {
					this.$message.error('Hi，' + error);
					this.loading = false;
					this.loadingDetail = false;
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
					method: 'get',
					url: 'http://localhost:6062/autotest/deleteSysInfo',
					dataType: "json",
					params: {
						as_no: rows[index].as_no,
					},
				})
				.then((response) => {
					let status = response.data.resCode;
					let msg = response.data.resMsg;

					if ('success' === status) {
						rows.splice(index, 1);
						this.selectFirstTableRow(this.tableData[0]);
						this.$message.success('Hi，删除成功！');
					} else {
						this.$message.error('Hi，删除失败！');
					}

					this.loading = false;


				})
				.catch((error) => {
					this.$message.error('Hi，' + error);
					this.loading = false;
				});
		},
		clickDataRow(rows) {
			//this.loadingDetail = true;
			// if (this.modify) {
			// 	this.modifyData(false);
			// }
			if (this.multipleSelection.length === 0) {
				this.$refs.multipleTable.toggleRowSelection(rows, true);
			} else {
				this.$refs.multipleTable.clearSelection();
				this.$refs.multipleTable.toggleRowSelection(rows, true);
			}
			//加载一些组件
			this.changePage("DetailInfo");
			// if (this.currentView === "DetailInfo") {
			// 	if (this.$refs.currentView.$el.scrollTop !== 0) {
			// 		this.$refs.currentView.$el.scrollTop = 0;
			// 	}
				

				

				


			// } else {
			// 	this.currentView = "DetailInfo";

			// }
			
			// setTimeout(() => {
				
			// 		this.$refs.currentView.getSysDetailInfo(this.multipleSelection);
			// 		this.loadingDetail = false;
			// }, 500);
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
		modifyData(val) {
			this.loadingDetail = true;
			setTimeout(() => {
			if (this.currentView === "DetailInfo" && this.saveName === "保存") {
				if (!val) {
					this.close = false;
					this.modify = true;
					this.save = false;
				} else {
					this.close = true;
					this.modify = false;
					this.save = true;
				}
				this.$refs.currentView.changeModifyStatus(val);
			} else if (this.currentView === "DetailInfo" && this.saveName === "创建") {
				if (this.$refs.currentView.$el.scrollTop !== 0) {
					this.$refs.currentView.$el.scrollTop = 0;
				}

				// this.loadingDetail = true;
				this.saveName = "保存";
				this.close = true;
				this.save = true;
				this.modify = false;
				this.$refs.modifyBtn.$el.style.display = "block";
				
					this.$refs.currentView.getSysDetailInfo(this.multipleSelection);
					this.$refs.currentView.clearDataName();
					// this.loadingDetail = false;
				
			} else if (this.currentView === "Message") {
				if (!val) {
					this.close = false;
					this.modify = true;
					this.save = false;
				} else {
					this.close = true;
					this.modify = false;
					this.save = true;
				}
				if (this.saveName === "创建") {
					this.saveName = "保存";
					this.$refs.modifyBtn.$el.style.display = "block";
				}
				this.$refs.currentView.changeModifyStatus(val);
			}
			this.loadingDetail = false;
			}, 380);
		},
	}
}

</script>
<!-- Add"scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../../static/css/automain.css"

</style>
<style type="text/css">
@import "../../../static/css/scollbar.css"

</style>
