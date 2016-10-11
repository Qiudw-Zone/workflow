/*遮罩
name：
date:2015-4-23
*/
(function(factory) {
	if (typeof define === "function" && define.amd) {
		define(function() {
			return factory();
		});
	} else {

		window.Page = factory();
	}
}(function() {
	/**
	 * [page 分页插件]
	 * @param  {[type]} list    [要分页的数组]
	 * @param  {[type]} itemNum [每页显示的项目数]
	 * @param  {[type]} pageNum [每次显示的页码数]
	 */
	var Page = function(options) {
		var opt={
				list:[],
				itemNum:3,
				pageNum:3,
				nowPage:1,
				offset:1
		}
		
		for (var i in opt) {
			if(options.hasOwnProperty(i)){
					opt[i]=arguments[0][i];
			}
		};
		

		this.nowPage =opt.nowPage; 		//当前页
		this.itemNum = opt.itemNum; 	//每页展示项目数
		this.list = opt.list,
		this.totalCount = Math.ceil(opt.list.length / this.itemNum);//总页数				
		this.offset =opt.offset; 		//上下页偏移量
		this.pageNum = opt.pageNum; 	//每次显示的页码数
		
	}

	// 获取页码列表
	Page.prototype.getPages= function() {
		
		var pageList=[];
		if(this.nowPage<1){
			this.nowPage=1;
		}
		var pageLength;
		if(this.nowPage>=(this.totalCount-this.offset+1)){

			this.nowPage=this.totalCount-this.offset+1;
			if(this.nowPage%this.pageNum != 0){
				pageLength =this.offset; 
			}else{
				pageLength=this.pageNum;
			}
		}else{
			pageLength=this.pageNum;
		}
		
		for (var i = 0; i < pageLength; i++) {
				var page = (Math.ceil(this.nowPage/this.pageNum)-1)*this.pageNum+1 + i;
				pageList.push(page);
		};
		
		
		return pageList;
	}
	// 获取当页list列表
	Page.prototype.getList=function(){
		var start=(this.nowPage-1)*this.itemNum;
		var end=this.nowPage*this.itemNum;		
		var nowPageList=this.list.slice(start,end);
		return nowPageList;
		
	}
	// 上一页码列表
	Page.prototype.prev = function() {
		this.nowPage=this.nowPage-this.offset;
		return this.getPages();
	}

	// 下一页码列表
	Page.prototype.next = function() {
		
		this.nowPage=this.nowPage+this.offset;
		return this.getPages();
	}

	return Page;
}));