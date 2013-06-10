package com.pearson.chaski.ui.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pearson.chaski.ui.controller.collections.CollectionController;
import com.pearson.chaski.ui.model.collections.Asset;
import com.pearson.chaski.ui.model.collections.CollectionAsset;

public class CollectionServiceInMemory implements CollectionService {
	private static final Logger LOG = LoggerFactory
			.getLogger(CollectionServiceInMemory.class);
	//the database
	HashMap<String, HashMap> userCollections = new HashMap<String, HashMap>();
	@Override
	public void createCollection(String username, String collectionName) {
		if(userCollections.get(username.toLowerCase()) == null){
			userCollections.put(username.toLowerCase(), new HashMap<String,HashMap<String, List<CollectionAsset>>>());
		}
		HashMap<String, List<CollectionAsset>> collections = userCollections.get(username.toLowerCase());
		if(collections.get(collectionName)!=null){
			//TODO throw exception as already created, lookup http code
		}else{
			collections.put(collectionName, new ArrayList<CollectionAsset>());
		}
	}

	@Override
	public List<String> getCollectionNames(String username) {
		HashMap<String, List<CollectionAsset>> collections = userCollections.get(username.toLowerCase());
		
		if(collections==null){
			userCollections.put(username.toLowerCase(), new HashMap<String,HashMap<String, List<CollectionAsset>>>());
			collections = userCollections.get(username.toLowerCase());
		}
		
		Set<String> names = collections.keySet();
		
		return new ArrayList<String>(names);
	}

	@Override
	public void addAssetToCollection(String username, String collectionName,
			String assetId, String type) {
		HashMap<String, List<CollectionAsset>> collections = userCollections.get(username.toLowerCase());
		
		//check if item is already in there
		List<CollectionAsset> collection = collections.get(collectionName);
		for(int i = 0 ; i < collection.size() ; i++){
			if(collection.get(i).chaskiURI.equals(assetId)){
				//TODO should we return a code or just a 200 with a 201 if it worked?
				return;
			}
		}
		
		//TODO what to do if collection does not exist?
		CollectionAsset collectionItem = new CollectionAsset();
		collectionItem.setUsername(username.toLowerCase());
		collectionItem.setChaskiURI(assetId);
		collectionItem.setAddedDate(new Date());
		collectionItem.setCollectionName(collectionName);
		collectionItem.setType(type);
		collections.get(collectionName).add(collectionItem);

	}

	@Override
	public List<Asset> getCollectionAssets(String username,
			String collectionName) {
		HashMap<String, List<CollectionAsset>> collections = userCollections.get(username.toLowerCase());
		
		List<Asset> assets = new ArrayList<Asset>();
		List<CollectionAsset> collection = collections.get(collectionName); 
		
		if(collection == null){
			return assets;
		}
		
		for(int i = 0 ; i < collection.size() ; i++){
			CollectionAsset itemRow = collection.get(i);
			if(itemRow.getCollectionName().equals(collectionName)){
				Asset asset = new Asset();
				asset.setChaskiURI(itemRow.getChaskiURI());
				asset.setAddedToCollection(itemRow.getAddedDate());
				
				assets.add(asset);
			}
		}
		return assets;
	}

}
