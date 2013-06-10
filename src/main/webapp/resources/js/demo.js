Backbone.View.prototype.close = function(){
	$(this.el).empty();
	this.unbind();
}

var clearResultRows = function(){
	swapToSearchPage();
	
	if(typeof imageResultsView != 'undefined'){
		console.log('Clearing out imageResultsView');
		imageResultsView.unbind();
	//	imageResultsView.remove();
	}
	if(typeof videoResultsView != 'undefined'){
		console.log('Clearing out videoResultsView');
		videoResultsView.unbind();
	//	videoResultsView.remove();
	}
	if(typeof docsResultsView != 'undefined'){
		console.log('Clearing out docsResultsView');
		docsResultsView.unbind();
	//	docsResultsView.remove();
	}
	if(typeof textResultsView != 'undefined'){
		console.log('Clearing out textResultsView');
		textResultsView.unbind();
	//	textResultsView.remove();
	}
	if(typeof dataResultsView != 'undefined'){
		console.log('Clearing out dataResultsView');
		dataResultsView.unbind();
	//	dataResultsView.remove();
	}
	if(typeof searchHeaderView != 'undefined'){
		console.log('Clearing out searchHeaderView');
		searchHeaderView.unbind();
	}
	$('#results-docs').empty();
	$('#results-videos').empty();
	$('#results-images').empty();
	$('#results-text').empty();
	$('#results-data').empty();
	$('#search-header').empty();
	$(document).scrollTop(0);
	
}

var checkContainsObject = function(array,object){
	for(var i = 0 ; i < array.length ; i++){
		if(array[i].value == object){
			return true;
		}
	}
	return false;
}
var addFilter = function(filter){
	for (var i = 0 ; i < filters.length ; i++){
		if(filters[i].value == filter.value){
			//it is already in list
			return;
		}
	}
	filters.push(filter);
}

var swapToHomePage = function(){
	AssetRouter.navigate("", {trigger: false});
	
	//switch wrapper class
	$('#wrapper').removeClass('results-page').removeClass('detail-page').addClass('home-page');
	console.log('homeexists:'+$('#home-page').length == 0);
	
	if (($('#home-page').length > 0) && (typeof homeView == 'undefined')){
		homeView = new HomeView();
	}
	if($('#filters-box').is(':visible')){
		$('#filters-box').hide();
	}
	if($('#results-box').is(':visible')){
		$('#results-box').hide();
	}
	if($('.applied-filters-section').is(':visible')){
		$('.applied-filters-section').hide();
	}
	if($('#collections-box').is(':visible')){
		$('#collections-box').hide();
	}
	if($('#asset-page').is(':visible')){
		$('#asset-page').hide();
	}
	if($('#home-page').is(':hidden')){
		$('#home-page').show();
	}
	
}
var swapToSearchPage = function(){
	
	AssetRouter.navigate("search", {trigger: false});
	
	if($('#filters-box').is(':hidden')){
		$('#filters-box').show();
	}
	if($('#results-box').is(':hidden')){
		$('#results-box').show();
	}
	if($('.applied-filters-section').is(':hidden')){
		$('.applied-filters-section').show();
	}
	if($('#collections-box').is(':hidden')){
		$('#collections-box').show();
	}
	if($('#asset-page').is(':visible')){
		$('#asset-page').hide();
	}
	if($('#home-page').is(':visible')){
		$('#home-page').hide();
	}
	
	$('#collections-box').appendTo($('#main-row'));
	
	$('#wrapper').removeClass('home-page').removeClass('detail-page').addClass('results-page');
}

var Asset = Backbone.Model.extend({urlRoot : '/chaski/asset'});

var swapToAssetPage = function(objectId) {
	
	//AssetRouter.navigate("asset/"+objectId, {trigger: true});
	
	$('#filters-box').hide()
	$('#results-box').hide();
	if($('.applied-filters-section').is(':visible')){
		$('.applied-filters-section').hide();
	}
	$('#collections-box').hide();
	
		
	if($('#home-page').is(':visible')){
		$('#home-page').hide();
	}
	$('#asset-page').show();
	
	
	
	$('#wrapper').removeClass('home-page').removeClass('results-page').addClass('detail-page');
		
}
var checkResultSet = function(resultSet, objectId){
	for(var i = 0 ; i < resultSet.length ; i++){
		console.log(resultSet[i].title);
		if(resultSet[i].objectId == objectId){
			console.log('Displaying object ' + resultSet[i].objectId)
			assetDetailView = new AssetDetailView(resultSet[i]);
			break;
		}
	}	
}

var getResultObject = function(objectId,type){
	var resultObject;
	if(type == 'image'){
		var imageResultSet = results.get(1).get('image').entry;
		resultObject = getResult(imageResultSet,objectId);
		if(typeof resultObject != 'undefined'){
			return resultObject;
		}
	}
	if(type == 'video'){
	
		var videoResultSet = results.get(1).get('video').entry;
		
		resultObject = getResult(videoResultSet,objectId);
		if(typeof resultObject != 'undefined'){
			return resultObject;
		}
	}
	if(type == 'text'){
	
		var textResultSet = results.get(1).get('text').entry;
		resultObject = getResult(textResultSet,objectId);	
		if(typeof resultObject != 'undefined'){
			return resultObject;
		}
	}
}


var getResult = function(resultSet, objectId){
	for(var i = 0 ; i < resultSet.length ; i++){
		console.log(resultSet[i].title);
		if(resultSet[i].objectId == objectId){
			console.log('Displaying object ' + resultSet[i].objectId)
			return resultSet[i];
		}
	}	
}

runSearch = function(page){
	searchParams.reset();
	var assetType = $('.search-type').find(":selected")[0].value;
	
	console.log('Selected asset type ' + assetType);
	if(!filterSearch){
		setAssetType(assetType);
	}
	if(assetType == 'all'){
		setPages(1,5);
	}else{
		if (typeof page != 'undefined'){
			setPages(page,20);
		}else{
			setPages(1,20);
		}
	}
	if($('#sort-list').length != 0){
		var sort = $('#sort-list').find(":selected")[0].value;
		setSortParam(sort);
	}
	if(filterSearch){
		setFilterParam();
	}
	
	results = new ResultsCollection();
	
	results.fetch({success: function(){
		console.log('Got results: '+results.length);
		clearResultRows();
		
		var result = results.get(1);

		var filterRegion = new Region('#filters-box');
		
		var filterView = new FilterView({model: results.get(1)});
		filterRegion.show(filterView);
		/*if(typeof filterView != 'undefined'){
			console.log('Destroying the filterview');
			filterView.close();
		}
		filterView = new FilterView({model: results.get(1)});
		*/
		searchHeaderView = new SearchHeaderView({model: results.get(1)});
		
		
		if(assetType == 'all'){
			imageResultsView = new ImageResultsView({model: results.get(1)});
			videoResultsView = new VideoResultsView({model: results.get(1)});
			textResultsView  = new TextResultsView({model: results.get(1)}); 
			//docsResultsView  = new DocsResultsView({model: results.get(1)});
//					textResultsView  = new TextResultsView({model: results.get(1)}); 
			//dataResultsView  = new DataResultsView({model: results.get(1)}); 
		}else if(assetType == 'image'){
			imageResultsView = new ImageResultsView({model: results.get(1)});
		}else if(assetType == 'video'){
			videoResultsView = new VideoResultsView({model: results.get(1)});
		}else if(assetType == 'text'){
			textResultsView  = new TextResultsView({model: results.get(1)}); 
		}
		
	}});
}
var assetDetailView;
var imageResultsView;
var videoResultsView;
var docsResultsView;
var textResultsView; 
var dataResultsView; 
var searchHeaderView;
var homeView;
var filterView;
var collectionsView;
var Result = Backbone.Model.extend({
    id: '',  
    title: '',
    totalResults: '0'
});

/*
	Set the asset type, if there are any assetTypes already set 
	they should be removed
*/
setAssetType = function(assetType){
	console.log('Setting asset type');
	
	var removeArray = new Array();
	
	searchParams.forEach(function(model){
		if(model.get('name') == 'assetType'){
			removeArray.push(model);
			console.log('removing asset type'+model.get('value'));
		}
	});
	searchParams.remove(removeArray);
	searchParams.add(new SearchParam({ name: 'assetType',value: assetType}));
}

setPages = function(startIndex,itemsPerPage){
	var removeArray = new Array();
	
	searchParams.forEach(function(model){
		if(model.get('name') == 'startIndex' || model.get('name') == 'itemsPerPage'){
			removeArray.push(model);
			console.log('removing asset type'+model.get('value'));
		}
	});
	searchParams.remove(removeArray);
	searchParams.add(new SearchParam({ name: 'startIndex',value: startIndex}));
	searchParams.add(new SearchParam({ name: 'itemsPerPage',value: itemsPerPage}));

}

setSortParam = function(sort){
	console.log('Setting sort');
	
	var removeArray = new Array();
	
	searchParams.forEach(function(model){
		if(model.get('name') == 'sort'){
			removeArray.push(model);
			console.log('removing sort'+model.get('value'));
		}
	});
	searchParams.remove(removeArray);
	searchParams.add(new SearchParam({ name: 'sort',value: sort}));
}
setFilterParam = function(sort){
	console.log('Setting filters');
	
	var removeArray = new Array();
	
	searchParams.forEach(function(model){
		if(model.get('name') == 'format'
			|| model.get('name') == 'created'){
			removeArray.push(model);
			console.log('removing filter'+model.get('value'));
		}
	});
	searchParams.remove(removeArray);
	for(var i = 0 ; i < filters.length ; i++){
		searchParams.add(new SearchParam({ name: filters[i].name.toString().toLowerCase(),value: filters[i].value}));
	}
	
}


var ResultsCollection = Backbone.Collection.extend({
  model: Result,
  urlRoot: '/chaski/searchjson',

  url: function() {
    // send the url along with the serialized query params
	var sendUrl = this.urlRoot + "?query="+$("#q").val();
	searchParams.forEach(function(model){
        console.log('name:'+model.get('name'));
		console.log('value:'+model.get('value'));
		sendUrl += '&' + model.get('name') + '=' + model.get('value');
    });
	console.log('Getting uri :' + sendUrl);
    return sendUrl;
  }
});
var SearchParam = Backbone.Model.extend({
    name: '',  
    value: ''
});

var SearchParamCollection = Backbone.Collection.extend({
  model: SearchParam,
});

var searchParams = new SearchParamCollection();


var results = new ResultsCollection();



var SearchHeaderView = Backbone.View.extend({
      el: '#search-header',
      
	  sort: '',
	  
	  template: _.template('<div class="search-header">'
								+'<h1>Search results for \'<%= title %>\' (<%= resultCount %> results)</h1>'
								+'<div class="row">'
									+'<div class="large-8 columns">'
										+'<div class="dym-container">'
											+'<p>Did you mean:</p>'
											+'<ul class="dym-list">'
											+'<% _.each(suggestions, function(res) { %>'
												+'<a href="#"><li><%= res %></li></a>'
											+'<% }); %>'
											+'</ul>'
										+'</div>'
									+'</div>'
									+'<div class="large-4 columns">'
										+'<div class="sort-container">'
											+'<p>Sort by:</p>'
											+'<select class="sort-list" value="<%= sort %>" id="sort-list">'
												+'<option value="">Best match</option>'
												+'<option value="title|asc">Alphabetically</option>'
												+'<option value="created|desc">Creation date (new to old)</option>'
												+'<option value="created|asc">Creation date (old to new)</option>'
												//+'<option value="small-to-large">Object size (small to large)</option>'
												//+'<option value="large-to-small">Object size (large to small)</option>'
											+'</select>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</div>'),
	events : {
        "click .dym-list" : "search",
		'change': 'setSort',
    },
	
      // It's the first function called when this view it's instantiated.
      initialize: function(){
        this.render();
		this.afterRender();
      },
	afterRender: function() {
		$('#sort-list').val(this.sort)
	},
      // $el - it's a cached jQuery object (el), in which you can use jQuery functions 
      //       to push content. Like the Hello World in this case.
    render: function(){
	    var resultDetailsObj = {
            title: $("#q").val(),
			resultCount: this.model.get('totalResults'),
			suggestions: this.model.get('suggestions'),
			sort: this.model.get('sort'),
        }
		this.sort = this.model.get('sort');
        this.$el.html(this.template(resultDetailsObj));

    },
	search: function(ev){
		console.log('ev'+ev.target.textContent);
		
		$("#q").val(ev.target.textContent);
		filterSearch = false;
		runSearch();
	},
	setSort: function(ev) {
		console.log('ev'+ev.target.value);
		if(ev.target.value == 'small-to-large' || ev.target.value == 'large-to-small'){
			alert("Size sort not currently implemented");
		}else if (ev.target.value == 'best-match'){
			//this is default so just remove anything in there
			setSortParam('');
		}else{
			setSortParam(ev.target.value);
		}
		runSearch();
	},
});


var ImageResultsView = Backbone.View.extend({
      el: '#results-images',
	  
	  template: _.template('<hr>'
							+'<div class="results-header">'
								+'<h2 class="results-title">Images (<%= typeTotalResults %>)</h2>'
								+'<% if (!filtered) {%>'
									+'<a href="#" class="results-see-all">See All</a>'
								+'<% } %>'
							+'</div>'
							+'<ul>'
								+'<% _.each(array, function(res) { %>'
									+'<a href="#search" class="objectId" id="<%= res.objectId %>">'
									
										+'<li>'
											+'<img src=\"/thumbnails/<%= res.objectId %>_chaskiMedium.png\"  onError="this.onError=null;this.src=\'/chaski/resources/img/default.png\';" />'
										+'</li>'
									
									+'</a>'
								+'<% }); %>'
							+'</ul>'
								+'<div class="row quickview-container" id="image-quick">'
									
								+'</div>'
							+'<% if (filtered) {%>'
								+'<div class="large-12 columns collections-pagination-row">'
									+'<div class="collections-pagination-container">'
										+'<div class="">'
											+'<ul>'
												+'<% if (typeof firstPage != "undefined") {%>'
													+'<li><a href="#<%= firstPage %>" class="pagination-link">First</a></li>'
												+'<% } %>'
												+'<% if (typeof prevPage != "undefined") {%>'
													+'<li><a href="#<%= prevPage %>" class="pagination-link">Previous</a></li>'
												+'<% } %>'
												+'<% if (typeof nextPage != "undefined") {%>'
													+'<li><a href="#<%= nextPage %>" class="pagination-link">Next</a></li>'
												+'<% } %>'
												+'<% if (typeof lastPage != "undefined") {%>'
													+'<li><a href="#<%= lastPage %>" class="pagination-link">Last</a></li>'
												+'<% } %>'
											+'</ul>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'<% } %>'	),
	

	events : {
        "click .results-see-all" : "search",
		"click .objectId" : "quickview",
		//"click .assetPage" : "loadObject",
		"click .pagination-link" : "changePage",
    },
    search : function(ev){
		$('.search-type').val('image')
		
		runSearch();
	},
	
	changePage: function(ev){
		if(typeof ev.target.hash != 'undefined'){
			runSearch(ev.target.hash.substring(1));
		}
		
	},
	quickview : function(ev){
		console.log("Going to quickview");
		
		console.log("Get object "+ev.currentTarget.id);
		var resultObject = getResultObject(ev.currentTarget.id,'image');
		
		//remove the existing object
		//$('#image-quick').unbind();
		//$('#image-quick').remove();
		
		if(typeof quickViewImageView == 'undefined' || quickViewImageView == null ){
			quickViewImageView = new QuickViewImageView(resultObject);
		}else{
			quickViewImageView.reRender(resultObject);
		}
		
		var foundIt = false;
		var offset = 0;
		for(var i = 0 ; i < ev.currentTarget.parentElement.children.length ; i++){
			console.log((i+1+offset) % 5);
			//make it ignore itself from the equation
			if(ev.currentTarget.parentElement.children[i].id == $('#image-quick').attr('id')){
				offset = -1;
				continue;
			}
			
			if(!foundIt && ev.currentTarget.parentElement.children[i] == ev.currentTarget){
				foundIt = true;
			}
			if(foundIt && (((i+1+offset) % 5 == 0) || i + offset == ev.currentTarget.parentElement.children.length-1)){
				var imageEl = $('#image-quick');
				$('#image-quick').show();
				$('#image-quick').insertAfter(ev.currentTarget.parentElement.children[i]);
				break;
			}
		}
		
		
	},
	loadObject : function(ev) {
		console.log("Fired load object: ");
		swapToAssetPage(ev.currentTarget.hash.substring(2));
	},
		
      // It's the first function called when this view it's instantiated.
      initialize: function(docResults){
	    this.render();
      },
      // $el - it's a cached jQuery object (el), in which you can use jQuery functions 
      //       to push content. Like the Hello World in this case.
    render: function(){
	    var array = this.model.get('image').entry;
		console.log('Rendering images:'+array.length);
        
	    var resultDetailsObj = {
            array: this.model.get('image').entry,
			filtered: $('.search-type').find(":selected")[0].value != 'all',
			firstPage: this.model.get('firstPage'),
			prevPage: this.model.get('prevPage'),
			nextPage: this.model.get('nextPage'),
			lastPage: this.model.get('lastPage'),
			typeTotalResults: this.model.get('image').totalResults,
        };
		
        this.$el.html(this.template(resultDetailsObj));
		//clean out the quick view so it gets recreated
		if(typeof quickViewImageView != 'undefined'){
			quickViewImageView.unbind();
			quickViewImageView.remove();
			quickViewImageView = undefined;
		}
		$('#image-quick').hide();
		
    },
});
var quickViewImageView;
QuickViewImageView = Backbone.View.extend({
    el: '#image-quick',
	  
	template: _.template('<div class="large-5 columns quickview-image">'
										+'<a href="#asset/<% if (typeof objectId != "undefined") { %><%= objectId %><% } %>" class="assetPage"><img src=\"/thumbnails/<%= objectId %>_chaskiMedium.png\" alt="<% if (typeof title != "undefined") { %><%= title %><% } %>" title="<% if (typeof title != "undefined") { %><%= title %><% } %>" onError="this.onError=null;this.src=\'/chaski/resources/img/default.png\';" /></a>'
									+'</div>'
									+'<div class="large-7 columns quickview-information">'
										+'<h2><% if (typeof title != "undefined") { %><%= title %><% } %></h2>'
										+'<img src="img/close-icon.png" alt="" title="Close" class="quickView-close-button" />'
										+'<table class="quickview-metadata">'
											+'<tr>'
												+'<td>ObjectId</td>'
												+'<td><% if (typeof objectId != "undefined") { %><%= objectId %><% } %></td>'
											+'</tr>'
											+'<tr>'
												+'<td>Date</td>'
												+'<td><% if (typeof created != "undefined") { %><%= created %><% } %></td>'
											+'</tr>'
										+'</table>'
										+'<div class="quickview-buttons">'
											+'<a href="#asset/<% if (typeof objectId != "undefined") { %><%= objectId %><% } %>" class="assetPage"><span class="detail-button">View Full Details</span></a>'
											+'<a href="#search" class="add-to-coll" id="<% if (typeof objectId != "undefined") { %><%= objectId %><% } %>"><span class="add-button">Add to Collection</span></a>'
										+'</div>'
									+'</div>'),
	
	events : {
        "click .quickView-close-button" : "hide",
		"click .add-to-coll" : "addToCollection",
    },
	hide : function(){
		$(this.el).hide();
	},
      // It's the first function called when this view it's instantiated.
    initialize: function(){
		this.render();
    },
      // $el - it's a cached jQuery object (el), in which you can use jQuery functions 
      //       to push content. Like the Hello World in this case.
    render: function(){
	    console.log('Heres quickview');
        var resultDetailsObj;
		if(typeof this.model == 'undefined'){
			resultDetailsObj = {
				title : this.options.title,
				created : this.options.created,
				objectId : this.options.objectId,
				summary : this.options.summary,
				category : this.options.category,
			};
		}else{
			resultDetailsObj = {
				title : this.model.title,
				created : this.model.created,
				objectId : this.model.objectId,
				summary : this.model.summary,
				category : this.model.category,
			};
		}
		
		
        this.$el.html(this.template(resultDetailsObj));

    },
	reRender: function(resultObject){
		console.log(resultObject);
		this.model = resultObject;
		$(this.el).empty();
		this.render(resultObject);
	},
	
	addToCollection: function(ev){
		console.log(ev.currentTarget.id);
		var collName = $('#coll-list').find(":selected").val();
		if(collName == 'untitled'){
			alert('Invalid collection');
			return;
		}
		var login = $.cookie('weave');
		if(typeof login == 'undefined'){
			alert('You mustbe logged in to create collections');
		}
		jQuery.ajax({
			url: '/chaski/collections/'+login+'/'+collName+'/'+ev.currentTarget.id,
			type: 'PUT',
			
			success: function( data, textStatus, jqXHR ) {
				collectionsView.updateList();
			}
		});
	},
});



var VideoResultsView = Backbone.View.extend({
      // el - stands for element. Every view has a element associate in with HTML 
      //      content will be rendered.
    el: '#results-videos',
	   
    template: _.template('<hr>'
							+'<div class="results-header">'
								+'<h2 class="results-title">Videos (<%= typeTotalResults %>)</h2>'
								+'<% if (!filtered) {%>'
									+'<a href="#" class="results-see-all">See All</a>'
								+'<% } %>'
							+'</div>'
							+'<ul>'
								+'<% _.each(array, function(res) { %>'
									+'<a href="#/<%= res.objectId %>" class="objectId">'
										+'<% if (_.last(array) == res) {%>'
											+'<li class="last-asset">'
												+'<img src=\"/thumbnails/<%= res.objectId %>_chaskiMedium.png\"  onError="this.onError=null;this.src=\'/chaski/resources/img/default.png\';"/>'
											+'</li>'
										+'<% } else { %>'
											+'<li>'
												+'<img src=\"/thumbnails/<%= res.objectId %>_chaskiMedium.png\"  onError="this.onError=null;this.src=\'/chaski/resources/img/default.png\';"/>'
											+'</li>'
										+'<% } %>'	
									+'</a>'
								+'<% }); %>'
							+'</ul>'
							+'<div class="row quickview-container" id="video-quick">'
								
							+'</div>'
							+'<% if (filtered) {%>'
								+'<div class="large-12 columns collections-pagination-row">'
									+'<div class="collections-pagination-container">'
										+'<div class="">'
											+'<ul>'
												+'<% if (typeof firstPage != "undefined") {%>'
													+'<li><a href="#<%= firstPage %>" class="pagination-link">First</a></li>'
												+'<% } %>'
												+'<% if (typeof prevPage != "undefined") {%>'
													+'<li><a href="#<%= prevPage %>" class="pagination-link">Previous</a></li>'
												+'<% } %>'
												+'<% if (typeof nextPage != "undefined") {%>'
													+'<li><a href="#<%= nextPage %>" class="pagination-link">Next</a></li>'
												+'<% } %>'
												+'<% if (typeof lastPage != "undefined") {%>'
													+'<li><a href="#<%= lastPage %>" class="pagination-link">Last</a></li>'
												+'<% } %>'
											+'</ul>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'<% } %>'	),

							
	events : {
        "click .results-see-all" : "search",
		"click .objectId" : "quickview",
		"click .assetPage" : "loadObject",
		"click .pagination-link" : "changePage",
    },
    search : function(ev){
		$('.search-type').val('video')
		
		runSearch();
	},	  
	
	changePage: function(ev){
		if(typeof ev.target.hash != 'undefined'){
			runSearch(ev.target.hash.substring(1));
		}
		
	},
	
	loadObject : function(ev) {
		console.log("Fired load object: ");
		swapToAssetPage(ev.currentTarget.hash.substring(2));
	},
	  
	quickview : function(ev){
		console.log("Going to quickview");
		
		console.log(ev.currentTarget.parentElement.children.length);
		
		console.log("Get object "+ev.currentTarget.hash.substring(2));
		var resultObject = getResultObject(ev.currentTarget.hash.substring(2),'video');
		
		if(typeof quickViewVideoView == 'undefined' || quickViewVideoView == null ){
			quickViewImageView = new QuickViewVideoView(resultObject);
		}else{
			quickViewVideoView.reRender(resultObject);
		}
		
		var foundIt = false;
		var offset = 0;
		for(var i = 0 ; i < ev.currentTarget.parentElement.children.length ; i++){
			console.log((i+1+offset) % 5);
			//make it ignore itself from the equation
			if(ev.currentTarget.parentElement.children[i].id == $('#video-quick').attr('id')){
				offset = -1;
				continue;
			}
			
			if(!foundIt && ev.currentTarget.parentElement.children[i] == ev.currentTarget){
				foundIt = true;
			}
			if(foundIt && (((i+1+offset) % 5 == 0) || i + offset == ev.currentTarget.parentElement.children.length-1)){
				
				var videoEl = $('#video-quick');
				$('#video-quick').show();
				$('#video-quick').insertAfter(ev.currentTarget.parentElement.children[i]);
				break;
			}
		}
		
		
	},
      // It's the first function called when this view it's instantiated.
      initialize: function(docResults){
	    this.render();
      },
      // $el - it's a cached jQuery object (el), in which you can use jQuery functions 
      //       to push content. Like the Hello World in this case.
    render: function(){
	    var array = this.model.get('video').entry;
		console.log('Rendering videos:'+array.length);
        
	    var resultDetailsObj = {
            array: this.model.get('video').entry,
			filtered: $('.search-type').find(":selected")[0].value != 'all',
			firstPage: this.model.get('firstPage'),
			prevPage: this.model.get('prevPage'),
			nextPage: this.model.get('nextPage'),
			lastPage: this.model.get('lastPage'),
			typeTotalResults: this.model.get('video').totalResults,
        };
        this.$el.html(this.template(resultDetailsObj));
		//clean out the quick view so it gets recreated
		if(typeof quickViewVideoView != 'undefined'){
			quickViewVideoView.unbind();
			quickViewVideoView.remove();
			quickViewVideoView = undefined;
		}
		$('#video-quick').hide();
    }
});
var quickViewVideoView;
QuickViewVideoView = Backbone.View.extend({
    el: '#video-quick',
	  
	template: _.template('<div class="large-5 columns quickview-image">'
										+'<a href="#/<% if (typeof objectId != "undefined") { %><%= objectId %><% } %>" class="assetPage"><img src=\"/thumbnails/<%= objectId %>_chaskiMedium.png\" alt="<% if (typeof title != "undefined") { %><%= title %><% } %>" title="<% if (typeof title != "undefined") { %><%= title %><% } %>"  onError="this.onError=null;this.src=\'/chaski/resources/img/default.png\';"/></a>'
									+'</div>'
									+'<div class="large-7 columns quickview-information">'
										+'<h2><% if (typeof title != "undefined") { %><%= title %><% } %></h2>'
										+'<img src="img/close-icon.png" alt="" title="Close" class="quickView-close-button" />'
										+'<table class="quickview-metadata">'
											+'<tr>'
												+'<td>ObjectId</td>'
												+'<td><% if (typeof objectId != "undefined") { %><%= objectId %><% } %></td>'
											+'</tr>'
											+'<tr>'
												+'<td>Date</td>'
												+'<td><% if (typeof created != "undefined") { %><%= created %><% } %></td>'
											+'</tr>'
										+'</table>'
										+'<div class="quickview-buttons">'
											+'<a href="#/<% if (typeof objectId != "undefined") { %><%= objectId %><% } %>" class="assetPage"><span class="detail-button">View Full Details</span></a>'
											+'<a href="#<% if (typeof objectId != "undefined") { %><%= objectId %><% } %>" class="add-to-coll"><span class="add-button">Add to Collection</span></a>'
										+'</div>'
									+'</div>'),
	
	events : {
        "click .quickView-close-button" : "hide",
		"click .add-to-coll" : "addToCollection",
    },
	hide : function(){
		$(this.el).hide();
	},
      // It's the first function called when this view it's instantiated.
    initialize: function(){
		this.render();
    },
      // $el - it's a cached jQuery object (el), in which you can use jQuery functions 
      //       to push content. Like the Hello World in this case.
    render: function(){
	    console.log('Heres quickview');
        var resultDetailsObj;
		if(typeof this.model == 'undefined'){
			resultDetailsObj = {
				title : this.options.title,
				created : this.options.created,
				objectId : this.options.objectId,
				summary : this.options.summary,
				category : this.options.category,
			};
		}else{
			resultDetailsObj = {
				title : this.model.title,
				created : this.model.created,
				objectId : this.model.objectId,
				summary : this.model.summary,
				category : this.model.category,
			};
		}
		
		
        this.$el.html(this.template(resultDetailsObj));

    },
	reRender: function(resultObject){
		console.log(resultObject);
		this.model = resultObject;
		$(this.el).empty();
		this.render(resultObject);
	},
		
	addToCollection: function(ev){
		console.log(ev.currentTarget.hash.substring(1));
		var login = $.cookie('weave');
		var collName = $('#coll-list').find(":selected").val();
		if(collName == 'untitled'){
			alert('Invalid collection');
			return;
		}
		jQuery.ajax({
			url: '/chaski/collections/'+login+'/'+collName+'/'+ev.currentTarget.hash.substring(1),
			type: 'PUT',
			
			success: function( data, textStatus, jqXHR ) {
				collectionsView.updateList();
			}
		});
	},
});

var TextResultsView = Backbone.View.extend({
    // el - stands for element. Every view has a element associate in with HTML 
    //      content will be rendered.
    el: '#results-text',
	
	template: _.template('<hr>'
						+'<div class="results-header">'
							+'<h2 class="results-title">Text (<%= typeTotalResults %>)</h2>'
								+'<% if (!filtered) {%>'
									+'<a href="#" class="results-see-all">See All</a>'
								+'<% } %>'
						+'</div>'
						+'<ul>'
							+'<% _.each(array, function(res) { %>'
								+'<li>'
									+'<% if(res.title) { %>'
										+'<a href="#asset/<%= res.objectId %>" class="text-title"><%= res.title %></a>'
									+'<% } else { %>'
										+'<a href="#asset/<%= res.objectId %>" class="text-title"><%= res.objectId %></a>'
									+'<% } %>'
									//this should be source but not in data yet
									+'<p class="text-source"><%= res.created %></p>'
									+'<p class="text-summary"><%= res.summary %></p>'
								+'</li>'
							+'<% }); %>'
						+'</ul>'
						+'<% if (filtered) {%>'
							+'<div class="large-12 columns collections-pagination-row">'
								+'<div class="collections-pagination-container">'
									+'<div class="">'
										+'<ul>'
											+'<% if (typeof firstPage != "undefined") {%>'
												+'<li><a href="#<%= firstPage %>" class="pagination-link">First</a></li>'
											+'<% } %>'
											+'<% if (typeof prevPage != "undefined") {%>'
												+'<li><a href="#<%= prevPage %>" class="pagination-link">Previous</a></li>'
											+'<% } %>'
											+'<% if (typeof nextPage != "undefined") {%>'
												+'<li><a href="#<%= nextPage %>" class="pagination-link">Next</a></li>'
											+'<% } %>'
											+'<% if (typeof lastPage != "undefined") {%>'
												+'<li><a href="#<%= lastPage %>" class="pagination-link">Last</a></li>'
											+'<% } %>'
										+'</ul>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'<% } %>'	),

	
	events : {
        "click .results-see-all" : "search",
		"click .text-title" : "loadObject",
		"click .pagination-link" : "changePage",
    },
	search : function(ev){
		$('.search-type').val('text')
		
		runSearch();
	},
	
	changePage: function(ev){
		if(typeof ev.target.hash != 'undefined'){
			runSearch(ev.target.hash.substring(1));
		}
		
	},
	
	loadObject : function(ev) {
		console.log("Fired load object: ");
		//it comes thru as #/{objectId}
		//swapToAssetPage(ev.currentTarget.hash.substring(2));
	},
	
    // It's the first function called when this view it's instantiated.
    initialize: function(docResults){
	    this.render();
    },
	render: function(){
	    var array = this.model.get('text').entry;
		console.log('Rendering text:'+array.length);
      
	    var resultDetailsObj = {
			array: this.model.get('text').entry,
			filtered: $('.search-type').find(":selected")[0].value != 'all',
			firstPage: this.model.get('firstPage'),
			prevPage: this.model.get('prevPage'),
			nextPage: this.model.get('nextPage'),
			lastPage: this.model.get('lastPage'),
			typeTotalResults: this.model.get('text').totalResults,
		};
		this.$el.html(this.template(resultDetailsObj));

	}
});


SearchButton =  Backbone.View.extend({
		el: '#search-form',
		//template: _.template("<input type=\"button\" value=\"\" id=\"input2\" class=\"search-submit\">"),
		
		template: _.template('<form action="#">'
								+'<input type="search" id="q" name="q" placeholder="What do you want to find?" class="search-field" />'								
								+'<select name="assettype" class="search-type">'
									+'<option value="all">All Types</option>'
									+'<option value="image">Image</option>'
									+'<option value="video">Video</option>'
									+'<option value="text">Text</option>'
								+'</select>'
								+'<input type="submit" value="" id="input2" class="search-submit" />'
							+'</form>'),
		
		events : {
            "click #input2" : "search",
			'change': 'setType',
        },
        //tagName : "div", // defines the html tag that will wrap your template
		initialize: function(){
	        this.render();
        },
        render: function(){
	        this.$el.html(this.template());

        },
		search : function(ev){
			//prevent the form being submitted
			if (ev.preventDefault) { 
				ev.preventDefault(); 
			} else { 
				ev.returnValue = false; 
			} 
            console.log("Clicked search button");
			//clearOut
			//clear filters
			filters = new Array();
			new AppliedFilterView();
			var filterBoxes = $('.filter-checkbox');
			for(var i = 0 ; i < filterBoxes.length ; i++){	
				filterBoxes[i].checked = false;
			}
			filterSearch = false;
			runSearch();
			
        },
		setType : function(ev){
			//prevent the form being submitted
			if (ev.preventDefault) { 
				ev.preventDefault(); 
			} else { 
				ev.returnValue = false; 
			}
			//need to find which option is selected
			var assetType = $('.search-type').find(":selected")[0].value;
			
			console.log('Selected asset type ' + assetType);
			setAssetType(assetType);
			//clearOut
			//searchParams.add(new SearchParam({ name: 'assetType',value: 'docs'}));
			
        },
		
});
var filterSearch = false;
var filters = new Array();
var FilterView = Backbone.View.extend({
    //el: '#filters-box',
      
	template: _.template('<h2>Filter by...</h2>'
							+'<div class="filters-container">'
								+'<% _.each(facets, function(facet) { %>'
									+'<h3><%= facet.type %></h3>'
										+'<ul class="filter">'
											+'<% _.each(facet.results, function(result) { %>'
												+'<li><label><input type="checkbox" class="filter-checkbox" name="<%= facet.type %>" value="<%= result.value%>" <% if (checkContainsObject(filters,result.value)){ %>checked="" <% } %>/> <%= result.label %> (<%= result.count %>)</label></li>'
											+'<% }); %>'
										+'</ul>'
								+'<% }); %>'	
								+'<a href="#search" class="filter-button">Filter</a>'
							+'</div>'
						),
						
	events : {
        "click .filter-button" : "filterSearch",
		"change input" : "filter",
    },
	
    // It's the first function called when this view it's instantiated.
    initialize: function(){
       this.render();
	},
	// $el - it's a cached jQuery object (el), in which you can use jQuery functions 
    //       to push content. Like the Hello World in this case.
    render: function(){
		//var facets = this.model.get('images').facets;
		var facets = this.model.get('facets');
	    var resultDetailsObj = {
            facets: facets,
        }
        //this.$el.html(this.template(resultDetailsObj));
		
		var dfd = $.Deferred();
        this.$el.html(this.template(resultDetailsObj));
        dfd.resolve();
        return dfd;
    },
	
	filter : function(ev){
		console.log(ev);
		if(ev.target.checked){
			//add to filters
			var f = new Array();
			f.name = ev.target.name;
			f.value = ev.target.value;
			addFilter(f);
		}else {
			//remove from filters
			for (var i = 0 ; i < filters.length ; i++){
			    if(filters[i].value == ev.target.value){
					filters.splice(i,1);
				}
			}
		}
		new AppliedFilterView();
		console.log(filters);
	},
	filterSearch: function(ev){
		filterSearch = true;
		runSearch(false);
	},
});

var AppliedFilterView = Backbone.View.extend({
    el: '#applied-filters',
    
	template: _.template('<h4>Applied Filters:</h4>'
							+'<ul>'
								+'<% _.each(filters, function(filter) { %>'
									+'<li><%= filter.value %> <a href="#<%= filter.value %>" title="Click to remove filter" ><img src="img/remove-filter.png"/></a></li>'
								+'<% }); %>'
								
							+'</ul>'
						),					
	events : {
        "click a" : "removeFilter",
    },
	
    // It's the first function called when this view it's instantiated.
    initialize: function(){
       this.render();
	},
	// $el - it's a cached jQuery object (el), in which you can use jQuery functions 
    //       to push content. Like the Hello World in this case.
    render: function(){
	    var resultDetailsObj = {

        }
        this.$el.html(this.template(resultDetailsObj));

    },
	removeFilter: function(ev){
		console.log(ev);
		var filter = ev.currentTarget.hash.substring(1);
		//remove from filters
		for (var i = 0 ; i < filters.length ; i++){
			if(filters[i].value == filter){
				filters.splice(i,1);
			}
		}
		new AppliedFilterView();
		
		var filterBoxes = $('.filter-checkbox');
		for(var i = 0 ; i < filterBoxes.length ; i++){
			if(filterBoxes[i].value == filter){
				filterBoxes[i].checked = false;
			}
		}
		console.log(filters);
	}
	
});


var AssetDetailView = Backbone.View.extend({
      // el - stands for element. Every view has a element associate in with HTML 
      //      content will be rendered.
      //el: '#asset-page',
	  //el: '#asset-page',
	   
    template: _.template(
			'<section>'
				+'<div class="row detail-body" id="asset-detail">'
					+'<div class="small-12 large-10 columns detail-left">'
						+'<div class="row">'
							+'<div class="small-6 large-6 columns">'
								+'<img src="/thumbnails/<%= model.attributes.objectId %>_chaskiLarge.png" class="large-asset"  onError="this.onError=null;this.src=\'/chaski/resources/img/default.png\';">'
								+'<button type="button" class="add-button" id="<%= model.attributes.objectId %>">Add to Collection</button>'
							+'</div>'
							+'<div class="small-6 large-6 columns">'
								+'<h1><%= model.attributes.title %></h1>'
								+'<table class="responsive detail-metadata">'
									/*+'<tr>'
										+'<td>Dimensions:</td>'
										+'<td>800px x 800px</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Size:</td>'
										+'<td>62.47 KB</td>'
									+'</tr>'*/
									+'<tr>'
										+'<td>Date:</td>'
										+'<td><%= model.attributes.created %></td>'
									+'</tr>'
									+'<tr>'
										+'<td>Summary:</td>'
										+'<td><%= model.attributes.summary %></td>'
									+'</tr>'
									/*+'<tr>'
										+'<td>Content Type:</td>'
										+'<td>Image</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Format:</td>'
										+'<td>PNG</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Contributor Role:</td>'
										+'<td>Author</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Contributor Name:</td>'
										+'<td>Joe Bloggs</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Identifier Type:</td>'
										+'<td>ISBN12</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Identifier Value:</td>'
										+'<td>ISBN12:Test-12</td>'
									+'</tr>'*/
									+'<tr>'
										+'<td>Description:</td>'
										+'<td><%= model.attributes.description %></td>'
									+'</tr>'
									+'<tr>'
										+'<td>Category:</td>'
										+'<td>'
										+'<% _.each(model.attributes.category, function(cat) { %>'
											+'<%= cat %>, '
										+'<% });  %></p>'
										+'</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Subject:</td>'
										+'<td>'
											+'<% _.each(model.attributes.subject, function(sub) { %>'
												+'<%= sub %>, '
											+'<% }); %></p>'	
										+'</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Keyword:</td>'
										+'<td><%= model.attributes.keyword %></td>'
									+'</tr>'
/*									+'<tr>'
										+'<td>Typical Age Range:</td>'
										+'<td>None</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Source:</td>'
										+'<td>Product Store</td>'
									+'</tr>'
									+'<tr>'
										+'<td>Location:</td>'
										+'<td><a href="#">http://productstoretest/emperor_penguin.png</a></td>'
									+'</tr>'*/
								+'</table>'
							+'</div>'
						+'</div>'
						+'<hr>'
						+'<div class="recommendations">'
							+'<h2>Recommendations</h2>'
							+'<ul>'
								+'<li><a href="#"><img src="img/rec-1.png" /></a></li>'
								+'<li><a href="#"><img src="img/rec-2.png" /></a></li>'
								+'<li><a href="#"><img src="img/rec-3.png" /></a></li>'
								+'<li><a href="#"><img src="img/rec-4.png" /></a></li>'
								+'<li><a href="#"><img src="img/rec-5.png" /></a></li>'
								+'<li class="last-recommendation"><a href="#"><img src="img/rec-6.png" /></a></li>'
							+'</ul>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</section>'
	
	
	

//	+'<p><a href="#<% if (typeof attributes.objectId != "undefined") { %><%= attributes.objectId %><% } %>" class="add-to-coll"><span class="add-button">Add to Collection</span></a></p>'
	
	/*
		+"<% if(attributes.realization) {%>"			
		+"<p>Realization Coverage: <%= attributes.realization.id %></p>"		
		+"<p>Realization Embodiment: <%= attributes.realization.embodiment %></p>"		
		+"<p>Realization ID: <%= attributes.realization.id %></p>"		
		+"<p>Realization Publisher: <%= attributes.realization.publisher %></p>"		
		+"<p>Realization of: <%= attributes.realization.realizationOf %></p>"		
		+"<p>Realization Type: <%= attributes.realization.type %></p>"	
		+"<% } %>"
		
		+"<% if(attributes.contributorMembership) {%>"
		+"<p>Contributor membership id: <%= attributes.contributorMembership.id %></p>"	
		+"<p>Contributor membership id: <%= attributes.contributorMembership.member.name %></p>"	
		+"<p>Contributor membership id: <%= attributes.contributorMembership.memberOrganisation %></p>"	
		+"<p>Contributor membership id: <%= attributes.contributorMembership.role %></p>"	
		+"<p>Contributor membership id: <%= attributes.contributorMembership.type %></p>"
		+"<% } %>"
		*/
		
		),
	
	events : {
		"click .add-button" : "addToCollection",
    },
	addToCollection: function(ev){
		console.log(ev.currentTarget.id.substring(1));
		var collName = $('#coll-list').find(":selected").val();
		if(collName == 'untitled'){
			alert('Invalid collection');
			return;
		}
		var login = $.cookie('weave');
		if(typeof login == 'undefined'){
			alert('You must be logged in to create collections');
		}
		jQuery.ajax({
			url: '/chaski/collections/'+login+'/'+collName+'/'+ev.currentTarget.id.substring(1),
			type: 'PUT',
			
			success: function( data, textStatus, jqXHR ) {
				collectionsView.updateList();
			}
		});
	},
	  
      // It's the first function called when this view it's instantiated.
      initialize: function(result){
		this.model = result;
	    this.render();
      },
      // $el - it's a cached jQuery object (el), in which you can use jQuery functions 
      //       to push content. Like the Hello World in this case.
    render: function(){
		/*var result = this.model;
		//this.$el.html(this.template(result));
		$(this.el).html("some html contents");
		$(this.el).hide();
*/		
		var dfd = $.Deferred();
        //this.$el.html('<h1>I am a title!</h1>');
		var result = this.model;
		this.$el.html(this.template(result));
        dfd.resolve();
        return dfd;
		
    },
	 onClose: function(){
		this.model.unbind("click", this.addToCollection);
	},
	 onShow: function(){
		$(this.el).show(500);
	}
});


HomeView = Backbone.View.extend({
      // el - stands for element. Every view has a element associate in with HTML 
      //      content will be rendered.
      el: '#home-page',
	   
    template: _.template(
			'<section class="home-collections">'
				+'<div class="row">'
					+'<div class="large-12 columns">'
						+'<div class="collection-hero">'
							+'<ul>'
								+'<li><img src="img/image-1.png" /></li>'
								+'<li><img src="img/image-2.png" /></li>'
								+'<li><img src="img/image-3.png" /></li>'
								+'<li><img src="img/image-4.png" /></li>'
								+'<li><img src="img/image-5.png" /></li>'
								+'<li><img src="img/image-2.png" /></li>'
								+'<li><img src="img/image-3.png" /></li>'
								+'<li><img src="img/image-4.png" /></li>'
								+'<li><img src="img/image-5.png" /></li>'
								+'<li><img src="img/image-1.png" /></li>'
								+'<li><img src="img/image-3.png" /></li>'
								+'<li><img src="img/image-4.png" /></li>'
								+'<li><img src="img/image-5.png" /></li>'
								+'<li><img src="img/image-1.png" /></li>'
								+'<li><img src="img/image-2.png" /></li>'
								+'<li><img src="img/image-4.png" /></li>'
								+'<li><img src="img/image-5.png" /></li>'
								+'<li><img src="img/test2.png" /></li>'
								+'<li><img src="img/test2.jpg" /></li>'
								+'<li></li>'
							+'</ul>'
							+'<div class="collection-title">'
								+'<p>Penguins of Antarctica</p>'
							+'</div>'
						+'</div>'
						+'<div class="collection-count">'
							+'<p>Last updated <span class="update-date">29 May 2013</span></p>'
							+'<ul>'
								+'<li class="count-icon-image"><span class="collection-image-count">165 Images</span></li>'
								+'<li class="count-icon-video"><span class="collection-video-count">28 Videos</span></li>'
								+'<li class="count-icon-text"><span class="collection-text-count">21 Text</span></li>'
								+'<li class="collection-total-assets">Total Assets: <span class="collection-total-count">216</span></li>'
							+'</ul>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</section>'
			+'<div class="row">'
				+'<div class="large-12 columns collections-pagination-row">'
					+'<div class="collections-pagination-container">'
						+'<div class="large-6 columns collections-total">'
							+'<p>You have 27 collections</p>'
						+'</div>'
						+'<div class="large-6 columns pagination">'
							+'<ul>'
								+'<li class="current-page"><a>1</a></li>'
								+'<li><a href="#">2</a></li>'
								+'<li><a href="#">3</a></li>'
								+'<li><a href="#">4</a></li>'
								+'<li><a href="#">5</a></li>'
								+'<li><a href="#">Next</a></li>'
							+'</ul>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'<div class="row">'
				+'<div class="large-12 columns topics-featured-row">'
					+'<div class="topics-featured-container">'
						+'<div class="large-8 columns">'
							+'<div class="topics">'
								+'<h3>Trending Today</h3>'
								+'<ul>'
									+'<a href="#"><li>dietary supplements <span>(1323 searches)</span></li></a>'
									+'<a href="#"><li>occupational safety <span>(993 searches)</span></li></a>'
									+'<a href="#"><li>botanical societies <span>(901 searches)</span></li></a>'
									+'<a href="#"><li>carnivorous plants <span>(700 searches)</span></li></a>'
									+'<a href="#"><li>philosophers <span>(699 searches)</span></li></a>'
									+'<a href="#"><li>oceanography <span>(523 searches)</span></li></a>'
									+'<a href="#"><li>british walks <span>(491 searches)</span></li></a>'
									+'<a href="#"><li>horse racing trainers <span>(324 searches)</span></li></a>'
									+'<a href="#"><li>rugby union lions tour <span>(223 searches)</span></li></a>'
									+'<a href="#"><li>food and drink <span>(123 searches)</span></li></a>'
								+'</ul>'
							+'</div>'
						+'</div>'
						+'<div class="large-4 columns featured">'
							+'<a href="#"><img src="img/featured-product.gif" alt="#" title="#" /></a>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		),
	
	events : {
    },
	  
      // It's the first function called when this view it's instantiated.
      initialize: function(){
	    this.render();
      },
      // $el - it's a cached jQuery object (el), in which you can use jQuery functions 
      //       to push content. Like the Hello World in this case.
    render: function(){
		this.$el.html(this.template());
        

    }
});


var Collection = Backbone.Model.extend({
	name : '',
	username : ''
});

var CollectionsCollection = Backbone.Collection.extend({
  model: Collection,
  urlRoot: '/chaski/collections',

  url: function() {
    var sendUrl = this.urlRoot;
	
    return sendUrl;
  }
});

var collections = new CollectionsCollection();
var CollectionsView = Backbone.View.extend({
    el: '#collections-box',
      
	template: _.template('<div class="collections">'
							+'<div class="collections-list">'
								+'<h3>Add to this collection...</h3>'
								+'<select class="sort-list" id="coll-list">'
									+'<% if(collections.length > 0) { %>'
										+'<% for(var i = 0 ; i < collections.length ; i++){ %>'
										//+'<% _.each(collections, function(collection) { %>'
													+'<option value="<%= collections[i].name %>"><%= collections[i].name %></option>'
										+'<% } %>'
									+'<% }else{ %>'
										+'<option value="" id="untitled"></option>'
									+'<% } %>'
									+'<option value="untitled" id="untitled">Untitled</option>'
									
								+'</select>'								
							+'</div>'
							+'<div class="current-collection" id="current-collection" >'
							+'<p>Contains <span class="rp-collection-total-count"></span> assets</p>'
							+'</div>'
							
							+'<div class="collection-assets"  id="collection-assets"></div>'
						+'</div>'
						),
						
	events : {
        "change select" : "selectUntitled",
    },
	selectUntitled: function(ev){
		console.log(ev);
		var collName = $('#coll-list').find(":selected").val();
		if (collName=="untitled"){
			console.log('untitled');
			//display an imput box and a button
			new CreateCollectionView();
		}else{
			$('#current-collection').empty();
			var login = $.cookie('weave');
			//show the collection list			
			jQuery.ajax({
				url: '/chaski/collections/'+login+'/'+collName,
				type: 'GET',
				
				success: function( data, textStatus, jqXHR ) {
					console.log( 'Get response:' );
					console.log( data);
					data = eval(data);
					$("#collection-assets").empty();
					var el = '<ul>';
					for(var i = 0 ; i < data.length ; i++){
						el += '<li class="collection-asset">'
								+'<img src="/thumbnails/'+data[i].chaskiURI+'_chaskiSmall.png"  onError="this.onError=null;this.src=\'/chaski/resources/img/default.png\';">'
								+'<ul>'
									//+'<li>62.47 KB</li>'
									+'<li>'+data[i].mimetype+'</li>'
									+'<li>'+data[i].title+'</li>'
								+'</ul>'
							+'</li>';
					}
					el += '</ul>';
					$("#collection-assets").append(el)
					$('.rp-collection-total-count').text(data.length);
					console.log( textStatus );
					console.log( jqXHR );
				},
				error: function(xhr, textStatus, errorThrown){
					console.log('request failed');
				}
			});
		}
	
	},
	updateList : function(){
		var collName = $('#coll-list').find(":selected").val();
		//show the collection list		
		var login = $.cookie('weave');
		jQuery.ajax({
			url: '/chaski/collections/'+login+'/'+collName,
			type: 'GET',
			
			success: function( data, textStatus, jqXHR ) {
				console.log( 'Get response:' );
				console.log( data);
				$("#collection-assets").empty();
				var el = '<ul>';
				for(var i = 0 ; i < data.length ; i++){
					el += '<li class="collection-asset">'
								+'<img src="/thumbnails/'+data[i].chaskiURI+'_chaskiSmall.png"  onError="this.onError=null;this.src=\'/chaski/resources/img/default.png\';">'
								+'<ul>'
									//+'<li>62.47 KB</li>'
									+'<li>'+data[i].mimetype+'</li>'
									+'<li>'+data[i].title+'</li>'
								+'</ul>'
						+'</li>';
				}
				el += '</ul>';
				$("#collection-assets").append(el)
				$('.rp-collection-total-count').text(data.length);
				console.log( textStatus );
				console.log( jqXHR );
			}
		});
	},
	
    // It's the first function called when this view it's instantiated.
    initialize: function(){
		this.render();
	},
	// $el - it's a cached jQuery object (el), in which you can use jQuery functions 
    //       to push content. Like the Hello World in this case.
    render: function(){
		var resultDetailsObj = {
            collections: eval(this.model),
        };
        this.$el.html(this.template(resultDetailsObj));
		
		var collName = $('#coll-list').find(":selected").val();
		//show the collection list		
		var login = $.cookie('weave');		
		jQuery.ajax({
			url: '/chaski/collections/'+login+'/'+collName,
			type: 'GET',
			
			success: function( data, textStatus, jqXHR ) {
				console.log( 'Get response:' );
				console.log( data);
				$("#collection-assets").empty();
				var el = '<ul>';
				for(var i = 0 ; i < data.length ; i++){
					el += '<li class="collection-asset">'
								+'<img src="/thumbnails/'+data[i].chaskiURI+'_chaskiSmall.png"  onError="this.onError=null;this.src=\'/chaski/resources/img/default.png\';">'
								+'<ul>'
									//+'<li>62.47 KB</li>'
									+'<li>'+data[i].mimetype+'</li>'
									+'<li>'+data[i].title+'</li>'
								+'</ul>'
						+'</li>';
				}
				el += '</ul>';
				$("#collection-assets").append(el)
				$('.rp-collection-total-count').text(data.length);
				console.log( textStatus );
				console.log( jqXHR );
			}
		});	
    },
	
});

var CreateCollectionView = Backbone.View.extend({
    el: '#current-collection',
    
	template: _.template('<input type="text" name="collection-name" value="Untitled" id="create-coll-input">'
						+'<a href="#">Create<a>'
						),					
	events : {
        "click a" : "createCollection",
    },
	
	createCollection: function(ev){
		var login = $.cookie('weave');
		if(login == ''){
			alert('You need to be logged in ');
		}
		var collection = new Collection();
		collection.set("name",$('#create-coll-input').val());
		collection.set("username",login);
		collections.create(collection, {
			
			success : function(resp){
				//reload the collections
				jQuery.ajax({
					url: '/chaski/collections/'+login,
					type: 'GET',
					
					success: function( data, textStatus, jqXHR ) {
						collectionsView = new CollectionsView({model: data});
					}
				});
			},
			error : function(err) {
				alert('There was an error creating collection. See console for details');
				console.log(err);
			}
		});
		
		
		
		/*collections.fetch({success: function(){
			collectionsView = new CollectionsView({model: collections});	
		}});*/
	},
	
    // It's the first function called when this view it's instantiated.
    initialize: function(){
       this.render();
	},
	// $el - it's a cached jQuery object (el), in which you can use jQuery functions 
    //       to push content. Like the Hello World in this case.
    render: function(){
		
	    var resultDetailsObj = {

        }
        this.$el.html(this.template(resultDetailsObj));

    },
	
});

var logins = new Array('Chris','Jon','Paul','Dan','Evan','Danielle');
var LoginView = Backbone.View.extend({
    el: '#user-box',
    
	template: _.template('<div class="search-bar-nav">'
						+'<ul>'
							+'<li id="login-box">'
							+'<input type="text" name="login-details" id="username">'
							+'<button type="button" class="login-button" id="login-button">Log In</button>'
							+'</li>'
							+'<li id="logout-box">'
							+'<span id="welcome"></span><br/>'
							+'<button type="button" class="login-button" id="logout-button">Log Out</button>'
							+'</li>'
							+'<li>'
							+'<a href="#/"><img src="img/home-icon.png" title="home" alt="Home icon"></a>'
							+'</li>'
						+'</ul>'
						),					
	events : {
        "click #login-button" : "login",
		"click #logout-button" : "logout",
    },
	login: function(){
		console.log('login');
		var login = $('#username').val();
		var b = false;
		for(var i = 0 ; i < logins.length ; i++){
			if(logins[i].toLowerCase() == login.toLowerCase()){
			login = logins[i];
				b = true;
			}
		}
		if(b){
			$('#login-box').hide();
			$('#logout-box').show();
			$('#welcome').text('Welcome '+login);;
			$.cookie('weave',login);
			jQuery.ajax({
				url: '/chaski/collections/'+login,
				type: 'GET',
				
				success: function( data, textStatus, jqXHR ) {
					collectionsView = new CollectionsView({model: data});			
				}
			});
		}else{
			$('#logout-box').hide();
			$('#login-box').show();
			alert('Invalid username');
		}
		
	},
	logout: function(){
		$.cookie('weave', '');
		$('#logout-box	').hide();
		$('#login-box').show();
	},
	
    // It's the first function called when this view it's instantiated.
    initialize: function(){
       this.render();
	},
	// $el - it's a cached jQuery object (el), in which you can use jQuery functions 
    //       to push content. Like the Hello World in this case.
    render: function(){
		//need to decide what to render
		this.$el.html(this.template(resultDetailsObj));
		var login = $.cookie('weave');
		var b = false;
		for(var i = 0 ; i < logins.length ; i++){
			if(logins[i] == login){
				b = true;
			}
		}
		if(b){
			$('#login-box').hide();
			$('#logout-box').show();
			$('#welcome').text('Welcome '+login);;
			$.cookie('weave',login);
			jQuery.ajax({
				url: '/chaski/collections/'+login,
				type: 'GET',
				
				success: function( data, textStatus, jqXHR ) {
					collectionsView = new CollectionsView({model: data});			
				}
			});
		}else{
			$('#logout-box').hide();
			$('#login-box').show();

		}

	    var resultDetailsObj = {

        }


    },
	
});


AssetRouter = Backbone.Router.extend({
	routes: {
		"": "home",
		"search": "search",
		"asset/:id": "showAsset"
	},
 
	initialize: function(options){
		console.log('init router');
	},
 
	home: function(){	
		console.log('home router');
		swapToHomePage();
	},
	search: function(){	
		console.log('search router');
		swapToSearchPage();
	},
	showAsset: function(id){
		console.log('asset router');
		swapToAssetPage(id);
		var assetRegion = new Region('#asset-page');
		
		var asset = new Asset({id: id});
		asset.fetch({success: function(){
			console.log('Got asset: '+asset);
			var adv = new AssetDetailView({model:asset});
				
			assetRegion.show(adv);						
			$('#collections-box').appendTo($('#asset-detail'));
			$('#collections-box').show();
		}});
		
	}
});
var AssetRouter = new AssetRouter();
Backbone.history.start();

Backbone.View.prototype.close = function(){
	this.remove();
	this.unbind();
	if (this.onClose){
		this.onClose();
	}
}

//first call  	
results.fetch({success: function(){
    console.log('initial fetch');
	var searchButton = new SearchButton();	

	

	
	jQuery.ajax({
		url: '/chaski/collections/chris',
		type: 'GET',
		
		success: function( data, textStatus, jqXHR ) {
			console.log('colls success');
			collectionsView = new CollectionsView({model: data});	
			swapToHomePage();
			new LoginView();			
		}
	});
	
}});

//This controls the views
(function($, _){
	var Region = function(el){
		this.el = el;
		this.$el = $(el);
	};
 
	_.extend(Region.prototype, {
		show: function(view){
			// clean up...
			this.clear();
			this.view = view;
 
			// set up
			var that = this;
			var show_dfd = $.Deferred();
 
			// render and resolve
			$.when(view.render()).then(function(){
				that.$el.html(view.el);
				show_dfd.resolve();
			});
 
			return show_dfd;
		},
 
		clear: function(){
			if(this.view){
				this.view.undelegateEvents();
				this.view.off();
				this.view.close();
				delete this.view;
			}
			this.$el.empty();
		}
	});
 
	window.Region = Region;
})(jQuery, _);




