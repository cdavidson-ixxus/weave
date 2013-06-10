package com.pearson.chaski.ui.controller;

import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

/**
 * @author Chris Davidson
 * Service for handling search requests to Elastic Search and
 * returning responses as JSON.
 *  
 */

@RequestMapping(value = "/searchjson")
@Controller
public class SearchControllerJSON {
	private static final Logger LOG = LoggerFactory
			.getLogger(SearchControllerJSON.class);
	String chaskiSearchURL;
	List<String> facetTypes = new ArrayList<String>();
	{
		//facetTypes.add("keyword.untouched");
		facetTypes.add("format");
		facetTypes.add("created");
		facetTypes.add("publisher");
	}
	
	public static void main(String[] args) throws JSONException {
		
		SearchControllerJSON controller = new SearchControllerJSON();
		controller.setChaskiSearchURL("http://localhost:8081/chaski/search");
		
		Map<String, String[]> params =new HashMap<String, String[]>();
		params.put("query", new String[]{"book"});
		
		JSONObject obj = controller.buildSearchObject(params,"images");
		
		JSONObject result = controller.sendSearch(obj);
		
		LOG.debug(result.toString(2));
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody
	String getResult(final HttpServletRequest request, Model model)
			throws JSONException {
		
		JSONObject obj = doSearch(request.getParameterMap());
		JSONArray array = new JSONArray();

		array.put(obj);

		LOG.debug(array.toString(2));
		
		return array.toString(2);
	}
	String[] systemAssetTypes = new String[]{"image","video","text"};
	
	/**
	 * The parameters coming in will be the following query - The value for a
	 * text search. sort - the field to sort by order - the direction to sort
	 * by, asc or desc. desc by default
	 * 
	 * @param parameterMap
	 * @return
	 * @throws UnsupportedEncodingException
	 * @throws URISyntaxException
	 * @throws JSONException
	 */
	private JSONObject doSearch(final Map<String, String[]> parameterMap)
			throws JSONException {
		//build results objects
		JSONObject result = new JSONObject();

		result.put("id", 1);//this is needed for backbone
		
		
		result.put("start Index", "1");
		result.put("itemsPerPage", "20");
		result.put("publisher", "Pearson PLC");
	
		String[] assetTypes = parameterMap.get("assetType");
		String assetType = null;
		
		if (assetTypes != null && assetTypes.length > 0) {
			//should only be one max, optional
			assetType = assetTypes[0];
		}
		int totalresults = 0 ;
		String searchString = null;
		String sort = null;
		Set<String> suggestions = new HashSet<String>();
		List<JSONObject> facetObjects = new ArrayList<JSONObject>();
		JSONObject searchObject = null;
		if(assetType==null || assetType.equals("all")){
			//do multiple searches for each assetType defined
			for (int i = 0; i < systemAssetTypes.length; i++) {

				JSONObject searchObjectMulti = buildSearchObject(parameterMap,systemAssetTypes[i]);
				sort = ((JSONObject)searchObjectMulti.get("query")).getString("sort");
				
				JSONObject assetResult = sendSearch(searchObjectMulti);
				
				assetResult = decorateResults(assetResult);
				
				result.put(systemAssetTypes[i], assetResult);
				totalresults += assetResult.getInt("totalResults");
				searchString = assetResult.getString("title");
				
				JSONArray jsonArray = assetResult.getJSONArray("suggestions");
				for(int s = 0 ; s < jsonArray.length() ; s++){
					suggestions.add(jsonArray.getJSONObject(s).getString("value"));
				}
				
				JSONArray facetArray = assetResult.getJSONArray("facets");
				for(int f = 0 ; f < facetArray.length() ; f++){
					facetObjects.add(facetArray.getJSONObject(f));
				}
			}
		}else{
			searchObject = buildSearchObject(parameterMap,assetType);
			sort = ((JSONObject)searchObject.get("query")).getString("sort");
			
			JSONObject assetResult = sendSearch(searchObject);
			
			assetResult = decorateResults(assetResult);
			
			result.put(assetType, assetResult);
			totalresults += assetResult.getInt("totalResults");
			searchString = assetResult.getString("title");
			
			JSONArray jsonArray = assetResult.getJSONArray("suggestions");
			for(int s = 0 ; s < jsonArray.length() ; s++){
				suggestions.add(jsonArray.getJSONObject(s).getString("value"));
			}
			JSONArray facetArray = assetResult.getJSONArray("facets");
			for(int f = 0 ; f < facetArray.length() ; f++){
				facetObjects.add(facetArray.getJSONObject(f));
			}
		}
		
		JSONArray suggestionsArray = new JSONArray(suggestions);
		result.put("suggestions", suggestionsArray);
		
		addFacets(facetObjects,result);
		
		result.put("title", searchString);
		result.put("totalResults", totalresults);
		result.put("sort", sort);
		
		if(searchObject!=null){
			//this only needs to be done on an unfiltered search
			int pageNumber = Integer.parseInt(searchObject.getJSONObject("query").getString("startIndex"));
			setPageNumbers(result,totalresults,pageNumber);
		}
		return result;

	}

	protected void addFacets(List<JSONObject> set, JSONObject result) throws JSONException {
		JSONArray facets = new JSONArray();
		for (Iterator iterator = set.iterator(); iterator.hasNext();) {
			JSONObject jsonObject = (JSONObject) iterator.next();
			String type = jsonObject.getString("type");
			//check if we have this type already
			boolean foundType = false;
			for(int i = 0 ; i < facets.length() ; i++){
				if(facets.getJSONObject(i).getString("type").equals(type)){
					foundType = true;
					//check the results, append new ones aggregate dupes
					for(int j = 0 ; j < jsonObject.getJSONArray("results").length() ; j++){
						String value = jsonObject.getJSONArray("results").getJSONObject(j).getString("value");
						boolean foundValue = false;
						for(int k = 0 ; k < facets.getJSONObject(i).getJSONArray("results").length() ; k++){
							if(facets.getJSONObject(i).getJSONArray("results").getJSONObject(k).getString("value").equals(value)){
								foundValue = true;
								//aggregate count
								int addCount = jsonObject.getJSONArray("results").getJSONObject(j).getInt("count");
								int existingCount = facets.getJSONObject(i).getJSONArray("results").getJSONObject(k).getInt("count");
								facets.getJSONObject(i).getJSONArray("results").getJSONObject(k).put("count", addCount+existingCount);
							}
						}
						if(!foundValue){
							//add the value under this type
							facets.getJSONObject(i).getJSONArray("results").put(jsonObject.getJSONArray("results").getJSONObject(j));
						}
					}
				}
			}
			if(!foundType){
				//then add the facet
				facets.put(jsonObject);
			}
		}
		
		result.put("facets", facets);
	}

	/**
	 * Method to push the pagination into the result object
	 * there is an assumption here that we will have 20 items to a page as this is hard coded
	 * @param result
	 * @param totalresults
	 * @param pageNumber
	 * @return 
	 * @throws JSONException
	 */
	protected void setPageNumbers(JSONObject result, int totalresults, int pageNumber) throws JSONException {
		//
		
		//set the first page number
		if(pageNumber > 1){
			result.put("firstPage", "1");
		}
		//set the previous page number
		if(pageNumber > 20){
			result.put("prevPage", Integer.toString(pageNumber-20));
		}
		//set the next page number
		if(totalresults > pageNumber+19){
			result.put("nextPage", Integer.toString(pageNumber+20));
		}
		//set the last page number
		if(((totalresults+19)/20*20-19)>(pageNumber+20)){
			result.put("lastPage", Integer.toString((totalresults+19)/20*20-19));
		}

	}

	protected JSONObject decorateResults(JSONObject assetResult) throws JSONException {
		JSONArray entryArray = assetResult.getJSONArray("entry");
		for(int i = 0 ; i < entryArray.length() ; i++){
			JSONArray linksArray = entryArray.getJSONObject(i).getJSONArray("links");
			for(int l = 0 ; l < linksArray.length() ; l++){
				if(linksArray.getJSONObject(l).getString("rel").equals("self")){
					String link = linksArray.getJSONObject(l).getString("href");
					entryArray.getJSONObject(i).put("objectId", link.substring(link.indexOf("asset")+6,link.indexOf("#")));					
				}
			}
		}
		return assetResult;
	}

	/**
	 * Send the search to Elastic Search
	 * @param searchObject
	 * @return
	 * @throws JSONException
	 */
	private JSONObject sendSearch(JSONObject searchObject) throws JSONException {
		RestTemplate restTemplate = new RestTemplate();

		final HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.valueOf("application/json")));
        final HttpEntity<String> requestEntity = new HttpEntity<String>(headers);
        String searchQuery = ((JSONObject)searchObject.get("query")).getString("text");
        String startIndex = ((JSONObject)searchObject.get("query")).getString("startIndex");
        String itemsPerPage = ((JSONObject)searchObject.get("query")).getString("itemsPerPage");
        String assetType = ((JSONObject)searchObject.get("query")).getString("assetType");
        //this is optional and can't be blank value
        String sort = ((JSONObject)searchObject.get("query")).getString("sort");
        //check for facet values for filtering
        JSONArray facetsArray = ((JSONObject)searchObject.get("query")).getJSONArray("facets");
        StringBuilder sb = new StringBuilder();
        for(int i = 0 ; i < facetsArray.length() ; i++){
        	sb.append("&");
        	sb.append(facetsArray.getJSONObject(i).getString("name"));
        	sb.append("=");
        	sb.append(facetsArray.getJSONObject(i).getString("value"));
        }
        
        HttpEntity<String> resultOb = null;
        if(sort != null && !sort.equals("")){
        	String url = chaskiSearchURL+"?text={searchQuery}&highlightFields=true&itemsPerPage={itemsPerPage}&startIndex={startIndex}&format={assetType}&sort={sort}&suggestions=true"+sb.toString();
        	LOG.debug("Sending URL to ES "+url);
        	resultOb =  
            		restTemplate.exchange(url, 
            				HttpMethod.GET, requestEntity, String.class,searchQuery,itemsPerPage,startIndex,assetType,sort);
        }else{
        	String url =chaskiSearchURL+"?text={searchQuery}&highlightFields=true&itemsPerPage={itemsPerPage}&startIndex={startIndex}&format={assetType}&suggestions=true"+sb.toString();
        	LOG.debug("Sending URL to ES "+url);
        	resultOb =  
            		restTemplate.exchange(url, 
            				HttpMethod.GET, requestEntity, String.class,searchQuery,itemsPerPage,startIndex,assetType);
        }
       
		JSONObject o = new JSONObject(resultOb.getBody());
		//get the old result object out of the feed object
		JSONObject feed = o.getJSONObject("feed");
		LOG.debug("Result = " + feed.toString(2));
        return feed;
		
	}

	/**
	 * Build a search object
	 * @param parameterMap
	 * @param assetType
	 * @return
	 * @throws JSONException
	 */
	protected JSONObject buildSearchObject(Map<String, String[]> parameterMap, String assetType)
			throws JSONException {
		
		// should always be one only
		String query = parameterMap.get("query")[0];

		JSONObject json = new JSONObject();

		JSONObject queryObject = new JSONObject();

		// for now allow a search with no text value although not sure this
		// would be true
		if (query != null && !query.equals("")) {
			queryObject.put("text", query);
		}

		// Max of one but optional
		String[] sorts = parameterMap.get("sort");
		String sort = "";
		if (sorts != null && sorts.length > 0) {
			sort = sorts[0];
		}

		String order = "desc";
		String[] orders = parameterMap.get("order");
		if (orders != null && orders.length > 0) {
			order = orders[0];
		}

//		if (sort != null && !sort.equals("")) {
//			JSONArray sortArray = new JSONArray();
//			sortArray.put(sort);
//			queryObject.put("sort", sortArray);
//
//			JSONArray orderArray = new JSONArray();
//			orderArray.put(order);
//			queryObject.put("order", orderArray);
//		}
		if (sort != null) {
			queryObject.put("sort", sort);
		}
		
		String[] itemsPerPages = parameterMap.get("itemsPerPage");
		String itemsPerPage = "20";
		if (itemsPerPages != null && itemsPerPages.length > 0) {
			itemsPerPage = itemsPerPages[0];
		}
		queryObject.put("itemsPerPage", itemsPerPage);
		
		String[] startIndexes = parameterMap.get("startIndex");
		String startIndex = "1";
		if (startIndexes != null && startIndexes.length > 0) {
			startIndex = startIndexes[0];
		}
		queryObject.put("startIndex", startIndex);
		
		queryObject.put("assetType", assetType);
		
		//look for facets
		JSONArray facetArray = new JSONArray();
		for(int i = 0 ; i < facetTypes.size() ; i++){
			String facetType = facetTypes.get(i);
			String[] array = parameterMap.get(facetType);
			if(array == null){
				continue;
			}
			StringBuilder sendValue = new StringBuilder();
			
			for (int j = 0; j < array.length; j++) {
				sendValue.append(array[j]);
				if(j+1 == array.length){
					//do nothing
				}else{
					sendValue.append(",");					
				}
				
			}
			JSONObject facetObject = new JSONObject();
			facetObject.put("name", facetType);
			facetObject.put("value", sendValue.toString());
			facetArray.put(facetObject);
			
		}
		queryObject.put("facets",facetArray);

		json.put("query", queryObject);

		return json;

	}
	
	public String getChaskiSearchURL() {
		return chaskiSearchURL;
	}

	public void setChaskiSearchURL(String chaskiSearchURL) {
		this.chaskiSearchURL = chaskiSearchURL;
	}
}