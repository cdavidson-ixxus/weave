package com.pearson.chaski.ui.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.pearson.chaski.ui.model.collections.CollectionAsset;

@Repository
public class CollectionDAO {
	private static final Logger LOG = LoggerFactory
			.getLogger(CollectionDAO.class);
	
	@Autowired
	private SessionFactory sessionFactory;
	
//	public List<Greeting> getAllGreetings() {
//		Session session = sessionFactory.getCurrentSession();		
//		Query q = session.createQuery("select g from Greeting g order by id desc");
//		List<Greeting> greetingList = q.list(); 
//	        return greetingList;			
//	}
 
	public void createCollection(CollectionAsset collectionAsset) {
		Session session = sessionFactory.getCurrentSession();	
		
		session.save(collectionAsset);
		
	}

	public List<String> getCollectionNames(String username) {
		Session session = sessionFactory.getCurrentSession();
		
		List<CollectionAsset> collectionList = (List<CollectionAsset>) session.createQuery("from CollectionAsset").list();
		
//		Query q = session.createQuery("select c from CollectionAsset c");
//		List<CollectionAsset> collectionList = q.list(); 
		//do my own filtering whilst working out how to group by
		
		//put them in a set will make them unique
		Set<String> collectionNames = new HashSet<String>();
		
		for(int i = collectionList.size()-1 ; i >= 0 ; i--){
			if(collectionList.get(i).getUsername().equals(username)){
				collectionNames.add(collectionList.get(i).getCollectionName());
			}
		}
	    return new ArrayList<String>(collectionNames);	
	}

	

	public void addAssetToCollection(CollectionAsset collectionAsset) {
		//check it is not in there already 
		List<CollectionAsset> collection = getAssetsInCollection(collectionAsset.getUsername(), collectionAsset.getCollectionName());
		
		for(int i = 0 ; i < collection.size() ; i++){
			if(collection.get(i).chaskiURI.equals(collectionAsset.getChaskiURI())){
				return;
			}
		}
		
		Session session = sessionFactory.getCurrentSession();	
		session.save(collectionAsset);
		
	}

	public List<CollectionAsset> getAssetsInCollection(String username,
			String collectionName) {
		// TODO Auto-generated method stub
		Session session = sessionFactory.getCurrentSession();		
		Query q = session.createQuery("select c from CollectionAsset c where c.username = '"+username+"' " +
				"AND c.collectionName = '"+collectionName+"' AND c.chaskiURI IS NOT NULL");
		List<CollectionAsset> collectionList = q.list();
		
		
		return collectionList;
	}
}
