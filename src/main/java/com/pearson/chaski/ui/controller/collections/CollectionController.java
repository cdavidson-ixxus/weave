package com.pearson.chaski.ui.controller.collections;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.pearson.chaski.ui.model.collections.Asset;
import com.pearson.chaski.ui.model.collections.CollectionAsset;
import com.pearson.chaski.ui.service.CollectionService;
/**
 * Service to handle interactions with Collections
 * @author Cdavidson
 *
 */
@Controller
@RequestMapping("/collections")
public class CollectionController {
	private static final Logger LOG = LoggerFactory
			.getLogger(CollectionController.class);
	String chaskiAssetURL;
	//List<CollectionItem> collection = new ArrayList<CollectionItem>();
	//HashMap<String, List<CollectionItem>> collections = new HashMap<String,List<CollectionItem>>();
	
	
	CollectionService collectionService;
	
	/**
	 * Create a collection
	 * Needs to return JSON for backbone to work
	 * @param name
	 * @throws JSONException 
	 */
	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody String createCollection(@RequestBody String body) throws JSONException {
		//check if already exists
		LOG.debug("Requestbody"+body);
		JSONObject json = new JSONObject(body);
		String collectionName = json.getString("name");
		String username = json.getString("username");
		
		getCollectionService().createCollection(username, collectionName);
		
		return "{\"response\":\"success\"}";
	}
	
	/**
	 * Delete a collection
	 * @param name
	 */
//	@RequestMapping(value="{name}", method = RequestMethod.DELETE)
//	public @ResponseBody void deleteCollection(@PathVariable String name) {
//		//collections.remove(name);
//	}
	
	/**
	 * Get a list of the names of all the collections
	 * @param name
	 * @return
	 * @throws JSONException 
	 */
	@RequestMapping(value="{username}", method = RequestMethod.GET)
	public @ResponseBody String getCollectionNames( @PathVariable String username) throws JSONException {
		
		List<String> list = getCollectionService().getCollectionNames(username);

		Collections.sort(list);
		JSONArray array = new JSONArray();
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			String name = (String) iterator.next();
			JSONObject obj = new JSONObject();
			obj.put("name", name);
			array.put(obj);
		}
		
		return array.toString();
	}
	

	/**
	 * Add an asset to a collection
	 * @param name
	 * @param item
	 */
	@RequestMapping(value="{username}/{name}/{id}", method = RequestMethod.PUT)
	public @ResponseBody void addItemToCollection(@PathVariable String username,@PathVariable String name, @PathVariable String id) {
		//TODO how do i know the type at this point?
		getCollectionService().addAssetToCollection(username, name, id, "");
	}
	
	/**
	 * Delete an asset from a collection
	 * @param name
	 * @param item
	 */
//	@RequestMapping(value="{name}/{id}", method = RequestMethod.DELETE)
//	public @ResponseBody void removeItemFromCollection(@PathVariable String name, @PathVariable String id) {
//		List<CollectionItem> collection = collections.get(name);
//		for(int i = 0 ; i < collection.size() ; i++){
//			CollectionItem itemRow = collection.get(i);
//			if(itemRow.getChaskiURI().equals(id)){
//				collection.remove(i);
//				break;
//			}
//		}
//	}
	/**
	 * Get a list of all the assets for a collection, get details from ES
	 * @param name
	 * @return
	 * @throws JSONException 
	 */
	@RequestMapping(value="{username}/{name}", method = RequestMethod.GET)
	public @ResponseBody List<Asset> getCollectionItems(@PathVariable String username,@PathVariable String name) throws JSONException {
		
		List<Asset> assets = getCollectionService().getCollectionAssets(username, name);
		
		RestTemplate restTemplate = new RestTemplate();
		final HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.valueOf("application/json")));
        final HttpEntity<String> requestEntity = new HttpEntity<String>(headers);
        
		//now we need the data from ES
		for (Iterator iterator = assets.iterator(); iterator.hasNext();) {
			Asset asset = (Asset) iterator.next();
			HttpEntity<String> resultOb = restTemplate.exchange(chaskiAssetURL+"/asset/{id}", 
    				HttpMethod.GET, requestEntity, String.class,asset.getChaskiURI());
			String s = resultOb.getBody();
			JSONObject json = new JSONObject(s);
			String link = json.getString("id");			
			asset.setTitle(json.getString("title"));
			asset.setDescription(json.getString("description"));
		}
		return assets;
	}

	public String getChaskiAssetURL() {
		return chaskiAssetURL;
	}

	public void setChaskiAssetURL(String chaskiAssetURL) {
		this.chaskiAssetURL = chaskiAssetURL;
	}

	public CollectionService getCollectionService() {
		return collectionService;
	}

	public void setCollectionService(CollectionService collectionService) {
		this.collectionService = collectionService;
	}
	
	
	
	
	
	
	
}
