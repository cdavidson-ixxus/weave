package com.pearson.chaski.ui.controller;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

import com.pearson.chaski.ui.test.AbstractSpringTestBase;

public class SearchControllerJSONTest  extends AbstractSpringTestBase{
	
	@Test
	public void testGetSearch() throws Exception {
		final String expectedViewName = "searchjson";
    	this.mockMvc
	    	.perform(
	        get("/searchjson").param("query", "hello"))
	        .andExpect(status().isOk());
	}
	
	@Test
	public void testBuildSearchSimple() throws JSONException{
		SearchControllerJSON controller = new SearchControllerJSON();
		
		Map<String, String[]> params = new HashMap<String, String[]>();
		params.put("query", new String[]{"my search term"});
		
		JSONObject obj = controller.buildSearchObject(params,"images");
		
		JSONObject query = obj.getJSONObject("query");
		assertNotNull(query);
		
		assertNotNull(query.get("text"));
		assertEquals("my search term",query.get("text"));
		
		//these should not be there
		try{
			obj.getJSONObject("sort");
			fail("sort should not be there");
		}catch(JSONException e ){
			
		}
		try{
			obj.getJSONObject("order");
			fail("order should not be there");
		}catch(JSONException e ){
			
		}
	}
	
	@Test
	public void testBuildSearchSort() throws JSONException{
		SearchControllerJSON controller = new SearchControllerJSON();
		
		Map<String, String[]> params = new HashMap<String, String[]>();
		params.put("query", new String[]{"my search term"});
		params.put("sort", new String[]{"sortField"});
		
		JSONObject obj = controller.buildSearchObject(params,"images");
		
		JSONObject queryObj = obj.getJSONObject("query");
		assertNotNull(queryObj);
		
		assertNotNull(queryObj.get("text"));
		assertNotNull(queryObj.getString("sort"));
		//assertNotNull(queryObj.getJSONArray("sort"));
		//taken order out         assertNotNull(queryObj.getJSONArray("order"));
		//taken order out         assertEquals("desc",queryObj.getJSONArray("order").get(0));
	}
	@Test
	public void testBuildSearchAssetType() throws JSONException{
		SearchControllerJSON controller = new SearchControllerJSON();
		
		Map<String, String[]> params = new HashMap<String, String[]>();
		params.put("query", new String[]{"my search term"});
		
		JSONObject obj = controller.buildSearchObject(params,null);
		
		JSONObject query = obj.getJSONObject("query");
		assertNotNull(query);
		
		assertNotNull(query.get("text"));
		assertEquals("my search term",query.get("text"));
		
		try{
			query.get("assetType");
			fail("Should not be an asset type by default");
		}catch(JSONException e){
			
		}
	}
	
	@Test
	public void testBuildSearchAssetTypeImages() throws JSONException{
		SearchControllerJSON controller = new SearchControllerJSON();
		
		Map<String, String[]> params = new HashMap<String, String[]>();
		params.put("query", new String[]{"my search term"});
		params.put("assetType", new String[]{"images"});
		
		JSONObject obj = controller.buildSearchObject(params,"images");
		
		JSONObject query = obj.getJSONObject("query");
		assertNotNull(query);
		
		assertNotNull(query.get("text"));
		assertEquals("my search term",query.get("text"));
		
		assertEquals("images",query.get("assetType"));
	}
	@Test
	public void testDecoration() throws JSONException{
		String resultString = "{\"entry\": ["
      +"{"
        +"\"created\": \"2007-03-23\","
        +"\"links\": ["
          +"{"
          
            +"\"href\": \"https://test.data.pearson.com:80/asset/456789#this\","
            +"\"rel\": \"self\""
          +"}"
        +"],"
        +"\"summary\": \"A book about Physical Science Lorem ipsum dolor sit amet, book consectetur adipiscing elit. Sed\","
        +"\"title\": \"A New Book\""
        +"}]}";
		JSONObject result = new JSONObject(resultString);
		
		SearchControllerJSON controller = new SearchControllerJSON();
		JSONObject decorated = controller.decorateResults(result);
		assertNotNull(((JSONObject)decorated.getJSONArray("entry").get(0)).getString("title"));
		assertNotNull("Should have added objectId",((JSONObject)decorated.getJSONArray("entry").get(0)).getString("objectId"));
		assertEquals("Should have added objectId","456789",((JSONObject)decorated.getJSONArray("entry").get(0)).getString("objectId"));
	}
	
	@Test
	public void testPagination() throws JSONException{
		JSONObject result = new JSONObject();
		
		SearchControllerJSON controller = new SearchControllerJSON();
		
		controller.setPageNumbers(result, 102, 1);
		
		assertEquals("21", result.getString("nextPage"));
		assertEquals("101", result.getString("lastPage"));
		try{
			assertNull(result.getString("firstPage"));
			assertNull(result.getString("prevPage"));
			fail("First and prev should not be there");
		}catch(JSONException e){
			
		}
	}
	

	@Test
	public void testPaginationRounding() throws JSONException{
		JSONObject result = new JSONObject();
		
		SearchControllerJSON controller = new SearchControllerJSON();
		
		controller.setPageNumbers(result, 100, 1);
		
		assertEquals("21", result.getString("nextPage"));
		assertEquals("81", result.getString("lastPage"));
		try{
			assertNull(result.getString("prevPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}
		try{
			assertNull(result.getString("firstPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}
	}
	
	@Test
	public void testPaginationLow() throws JSONException{
		JSONObject result = new JSONObject();
		
		SearchControllerJSON controller = new SearchControllerJSON();
		
		controller.setPageNumbers(result, 10, 1);
		
		try{
			assertNull(result.getString("lastPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}

		try{
			assertNull(result.getString("nextPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}

		try{
			assertNull(result.getString("prevPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}

		try{
			assertNull(result.getString("firstPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}
	}
	@Test
	public void testPaginationZero() throws JSONException{
		JSONObject result = new JSONObject();
		
		SearchControllerJSON controller = new SearchControllerJSON();
		
		controller.setPageNumbers(result, 0, 1);
		
		try{
			assertNull(result.getString("lastPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}

		try{
			assertNull(result.getString("nextPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}

		try{
			assertNull(result.getString("prevPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}

		try{
			assertNull(result.getString("firstPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}
	}
	@Test
	public void testPaginationPageTwo() throws JSONException{
		JSONObject result = new JSONObject();
		
		SearchControllerJSON controller = new SearchControllerJSON();
		
		controller.setPageNumbers(result, 119, 61);
		
		assertEquals("1", result.getString("firstPage"));
		assertEquals("41", result.getString("prevPage"));
		assertEquals("81", result.getString("nextPage"));
		assertEquals("101", result.getString("lastPage"));
		
	}
	

	@Test
	public void testPaginationPageThree() throws JSONException{
		JSONObject result = new JSONObject();
		
		SearchControllerJSON controller = new SearchControllerJSON();
		
		controller.setPageNumbers(result, 58, 21);
		
		assertEquals("1", result.getString("firstPage"));
		assertEquals("1", result.getString("prevPage"));
		assertEquals("41", result.getString("nextPage"));
		try{
			assertNull(result.getString("lastPage"));
			fail("Should not be there");
		}catch(JSONException e){
			
		}
		
	}
	
	@Test
	public void testAddFacets() throws JSONException{
		JSONObject result = new JSONObject();
		
		JSONObject facet1 = new JSONObject();
		facet1.put("type", "keyword");
		JSONObject res1 = new JSONObject();
		res1.put("value", "war");
		res1.put("count", 19);
		res1.put("label", "war");
		res1.put("href", "http://server/uri");
		
		JSONObject res2 = new JSONObject();
		res2.put("value", "bird");
		res2.put("count", 12);
		res2.put("label", "bird");
		res2.put("href", "http://server/uri");
		
		JSONArray array1 = new JSONArray();
		array1.put(res1);
		array1.put(res2);
		facet1.put("results", array1);
		
		
		JSONObject facet2 = new JSONObject();
		facet2.put("type", "type");
		JSONObject res3 = new JSONObject();
		res3.put("value", "image");
		res3.put("count", 23);
		res3.put("label", "image");
		res3.put("href", "http://server/uri");
		
		JSONObject res4 = new JSONObject();
		res4.put("value", "video");
		res4.put("count", 1);
		res4.put("label", "video");
		res4.put("href", "http://server/uri");
		
		JSONArray array2 = new JSONArray();
		array2.put(res3);
		array2.put(res4);
		facet2.put("results", array2);
		
		JSONObject facet3 = new JSONObject();
		facet3.put("type", "keyword");
		JSONObject res5 = new JSONObject();
		res5.put("value", "war");
		res5.put("count", 16);
		res5.put("label", "war");
		res5.put("href", "http://server/uri");
		
		JSONObject res6 = new JSONObject();
		res6.put("value", "solar");
		res6.put("count", 2);
		res6.put("label", "solar");
		res6.put("href", "http://server/uri");
		
		JSONArray array3 = new JSONArray();
		array3.put(res5);
		array3.put(res6);
		facet3.put("results", array3);
		
		List<JSONObject> set = new ArrayList<JSONObject>();
		set.add(facet1);
		set.add(facet2);
		set.add(facet3);
		
		SearchControllerJSON controllerJSON = new SearchControllerJSON();
		controllerJSON.addFacets(set, result);
		
		assertEquals(2, result.getJSONArray("facets").length());
		assertEquals("keyword", result.getJSONArray("facets").getJSONObject(0).getString("type"));
		assertEquals("type", result.getJSONArray("facets").getJSONObject(1).getString("type"));
		assertEquals(3, result.getJSONArray("facets").getJSONObject(0).getJSONArray("results").length());
		assertEquals(2, result.getJSONArray("facets").getJSONObject(1).getJSONArray("results").length());
		assertEquals("Should have added the results together for war",35, result.getJSONArray("facets").getJSONObject(0).getJSONArray("results").getJSONObject(0).getInt("count"));
		//check results for bird
		assertEquals(12, result.getJSONArray("facets").getJSONObject(0).getJSONArray("results").getJSONObject(1).getInt("count"));
	}
}
