package com.pearson.chaski.ui.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.support.DaoSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pearson.chaski.ui.model.collections.Asset;
import com.pearson.chaski.ui.model.collections.CollectionAsset;

@Service
@Transactional
public class CollectionServiceDB implements CollectionService {

	@Autowired
	private CollectionDAO collectionDAO;
	
	@Override
	public void createCollection(String username, String collectionName) {
		CollectionAsset collectionAsset = new CollectionAsset();
		collectionAsset.setUsername(username);
		collectionAsset.setCollectionName(collectionName);
		
		collectionDAO.createCollection(collectionAsset);

	}

	@Override
	public List<String> getCollectionNames(String username) {
		return collectionDAO.getCollectionNames(username);
		
	}

	@Override
	public void addAssetToCollection(String username, String collectionName,
			String assetId, String type) {
		CollectionAsset collectionAsset = new CollectionAsset();
		collectionAsset.setUsername(username);
		collectionAsset.setCollectionName(collectionName);
		collectionAsset.setChaskiURI(assetId);
		collectionAsset.setType(type);
		
		collectionDAO.addAssetToCollection(collectionAsset);

	}

	@Override
	public List<Asset> getCollectionAssets(String username,
			String collectionName) {
		
		List<CollectionAsset> collection = collectionDAO.getAssetsInCollection(username, collectionName); 

		
		List<Asset> assets = new ArrayList<Asset>();
		
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
