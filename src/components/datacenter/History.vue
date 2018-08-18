<template>
	<div class="history">
		<li>{{message}}</li>
		<li>{{execTime}}</li>
		<li>{{endTime}}</li>
		<a>更多历史结果</a>
	</div>
</template>
<script>
export default {
	name: 'History',
	mounted: function() {
		
		this.getResult();

	},
	props:{
		multipleSelection:{
			type:Array,
			required:true,
		}
	},
	data() {
		return {
			message: "该记录暂无结果",
			execTime: "",
			endTime: "",
		}
	},
	methods: {
		getResult() {
			
			if (this.multipleSelection.length === 0) {
				console.log("没有选中记录");
			}
			else{
				this.$ajax({
					method: 'post',
					url: 'http://localhost:9090/AutoTest/sysInfo/querySysResult',
					dataType: "json",
					data: {
						sysId: this.multipleSelection[0].no,
					}
				})
				.then((response) => {
					if (response.data !== "") {
						this.message = response.data.result;
						this.execTime = response.data.execTime;
						this.endTime = response.data.endTime;
					}
					else {
						this.message = "该记录暂无结果";
						this.execTime = "";
						this.endTime = "";
					}
					// console.log(response.data);
				})
				.catch(function(error) {
					//this.loading=false;
					console.log(error);
				});
			}
			
		}
	}
}

</script>
<style>


</style>
