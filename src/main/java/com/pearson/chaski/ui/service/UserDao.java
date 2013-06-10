package com.pearson.chaski.ui.service;

import java.util.List;

import javax.annotation.PostConstruct;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.pearson.chaski.ui.model.auth.User;

/**
 * Class to handle interaction with RDBMS
 * @author Cdavidson
 *
 */

@Repository
public class UserDao {
	private static final Logger LOG = LoggerFactory
			.getLogger(UserDao.class);
	
	@Autowired
	private SessionFactory sessionFactory;
	
	public User getUser(String username){
		Session session = sessionFactory.getCurrentSession();		
		Query q = session.createQuery("select c from User c where c.username = '"+username+"'");
		User user = (User) q.uniqueResult();
		return user;
	}
	
	public User getUserByEmail(String emailAddress){
		Session session = sessionFactory.getCurrentSession();		
		Query q = session.createQuery("select c from User c where c.emailAddress = '"+emailAddress+"'");
		User user = (User) q.uniqueResult();
		return user;
	}
	
	public List<User> getAllUsers(){
		Session session = sessionFactory.getCurrentSession();		
		Query q = session.createQuery("select c from User c");
		List<User> collectionList = q.list();
		return collectionList;
	}
	
	protected void createUser(User user){
		Session session = sessionFactory.getCurrentSession();
		session.save(user);
	}
//	@PostConstruct
//	public void seedData() {
//		if(this.getAllUsers().size()==0){
//			this.createUser(new User("Chris","chris.davidson@ixxus.com"));
//			this.createUser(new User("Evan","jon.paul@ixxus.com"));
//			this.createUser(new User("Evan","dan.tuffrey@ixxus.com"));
//			this.createUser(new User("Evan","evan.vanderploeg@ixxus.com"));
//			this.createUser(new User("Danielle","danielle.maurici-arnone@pearson.com"));
//		}
//	}
}
