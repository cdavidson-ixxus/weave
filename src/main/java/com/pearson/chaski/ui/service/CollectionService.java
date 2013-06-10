package com.pearson.chaski.ui.service;

import java.util.List;

import com.pearson.chaski.ui.model.collections.Asset;
import com.pearson.chaski.ui.model.collections.CollectionAsset;

public interface CollectionService {
	public void createCollection(String username, String collectionName);
	
	public List<String> getCollectionNames(String username);
	
	public void addAssetToCollection(String username, String collectionName, String assetId, String type);
	
	public List<Asset> getCollectionAssets(String username, String collectionName);
}
