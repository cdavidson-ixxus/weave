package com.pearson.chaski.ui.controller;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

/**
* @author Chris Davidson
* 
* Service to lookup a single asset by an id
*/

@RequestMapping(value = "/asset")
@Controller
public class AssetControllerJSON {
	private static final Logger LOG = LoggerFactory
			.getLogger(AssetControllerJSON.class);
	String chaskiAssetURL;
	
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody
	String getResult(@PathVariable String id,final HttpServletRequest request, Model model)
			throws JSONException {
		
		RestTemplate restTemplate = new RestTemplate();
		HttpEntity<String> resultOb = null;

		final HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.valueOf("application/json")));
        final HttpEntity<String> requestEntity = new HttpEntity<String>(headers);
        
        resultOb = restTemplate.exchange(chaskiAssetURL+"/asset/{id}", 
            				HttpMethod.GET, requestEntity, String.class,id);
        String s = resultOb.getBody();
        JSONObject json = new JSONObject(s);
        String link = json.getString("id");
        
        
        json.put("objectId", link.substring(link.indexOf("asset")+6,link.indexOf("#")));
        
		
        LOG.debug(json.toString(2));
		return json.toString();
	}


	public String getChaskiAssetURL() {
		return chaskiAssetURL;
	}


	public void setChaskiAssetURL(String chaskiAssetURL) {
		this.chaskiAssetURL = chaskiAssetURL;
	}


	
	
}
